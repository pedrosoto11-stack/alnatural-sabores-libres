import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface PlaceOrderRequest {
  items: OrderItem[];
  notes?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate request body
    const requestData = await req.json();
    
    if (!requestData.items || !Array.isArray(requestData.items)) {
      throw new Error('Items array is required');
    }
    
    const items: OrderItem[] = requestData.items
      .filter((item: any) => 
        item && 
        typeof item.product_id === 'string' &&
        typeof item.product_name === 'string' &&
        typeof item.quantity === 'number' && 
        item.quantity > 0 && 
        item.quantity <= 100 &&
        typeof item.unit_price === 'number' &&
        item.unit_price > 0
      )
      .map((item: any) => ({
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
      }));
    
    if (items.length === 0) {
      throw new Error('At least one valid item is required');
    }
    
    const notes = typeof requestData.notes === 'string' ? requestData.notes.trim().substring(0, 500) : '';

    // Get user from Authorization header
    const authorization = req.headers.get("Authorization");
    if (!authorization) {
      throw new Error("No authorization header");
    }

    // Use service role for all operations
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      {
        global: {
          headers: { Authorization: authorization },
        },
      }
    );

    const { data: { user }, error: userError } = await adminSupabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("Usuario no autenticado");
    }

    // Get user's client information
    const { data: userClient, error: clientError } = await adminSupabase
      .from("user_clients")
      .select(`
        client_id,
        clients (
          id,
          name,
          email,
          company,
          phone
        )
      `)
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (clientError || !userClient) {
      console.error("Client lookup error:", clientError);
      throw new Error("Usuario no tiene un cliente asociado");
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: OrderItem) => sum + (item.quantity * item.unitPrice), 0);

    // Generate temporary order ID
    const orderId = crypto.randomUUID();

    // Prepare WhatsApp content (using product names from request)
    const client = userClient.clients as any;
    let orderTextWA = "Nuevo pedido de " + client.name + ":\n\n";

    items.forEach((item: OrderItem) => {
      orderTextWA += `• ${item.productName} x${item.quantity} = $${(item.quantity * item.unitPrice).toLocaleString()}\n`;
    });

    orderTextWA += `\nTotal: $${totalAmount.toLocaleString()}`;
    if (notes) {
      orderTextWA += `\nNotas: ${notes}`;
    }
    orderTextWA += `\n\nCliente: ${client.name}`;
    if (client.company) orderTextWA += ` (${client.company})`;
    orderTextWA += `\nEmail: ${client.email}`;
    if (client.phone) orderTextWA += `\nTeléfono: ${client.phone}`;

    console.log("Attempting to send order to dashboard");

    // Send webhook to external dashboard (CRITICAL - main operation)
    const dashboardWebhookUrl = Deno.env.get("DASHBOARD_WEBHOOK_URL");
    const dashboardApiKey = Deno.env.get("DASHBOARD_API_KEY");

    console.log("Dashboard webhook config:", {
      hasUrl: !!dashboardWebhookUrl,
      url: dashboardWebhookUrl,
      hasApiKey: !!dashboardApiKey,
      timestamp: new Date().toISOString()
    });

    if (!dashboardWebhookUrl || !dashboardApiKey) {
      throw new Error("Dashboard webhook not configured");
    }

    const webhookPayload = {
      order_id: orderId,
      client_name: client.name,
      client_email: client.email,
      client_company: client.company || null,
      client_phone: client.phone || null,
      total_amount: totalAmount,
      items: items.map((item: OrderItem) => ({
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.quantity * item.unitPrice
      })),
      notes: notes,
      created_at: new Date().toISOString(),
      skip_inventory_check: true
    };

    const webhookResponse = await fetch(dashboardWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": dashboardApiKey
      },
      body: JSON.stringify(webhookPayload)
    });

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error("Dashboard webhook failed:", errorText);
      throw new Error(`Error sending order to dashboard: ${webhookResponse.status} - ${errorText}`);
    }
    
    console.log("Order sent to dashboard successfully");

    // Send WhatsApp notification if configured
    const whatsappToken = Deno.env.get("WHATSAPP_TOKEN");
    const whatsappPhoneId = Deno.env.get("WHATSAPP_PHONE_ID");
    
    if (whatsappToken && whatsappPhoneId && client.phone) {
      try {
        await fetch(`https://graph.facebook.com/v17.0/${whatsappPhoneId}/messages`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${whatsappToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: client.phone.replace(/\D/g, ''), // Remove non-digits
            type: "text",
            text: {
              body: orderTextWA
            }
          })
        });
      } catch (whatsappError) {
        console.error("WhatsApp error (non-critical):", whatsappError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: orderId,
        message: "Pedido enviado exitosamente al dashboard",
        order: {
          id: orderId,
          total: totalAmount,
          status: "pending",
          items: items.length,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in place-order function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});