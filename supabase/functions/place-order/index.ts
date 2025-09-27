import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

interface PlaceOrderRequest {
  items: OrderItem[];
  notes?: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, notes }: PlaceOrderRequest = await req.json();

    // Get user from Authorization header
    const authorization = req.headers.get("Authorization");
    if (!authorization) {
      throw new Error("No authorization header");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
      {
        global: {
          headers: { Authorization: authorization },
        },
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error("Usuario no autenticado");
    }

    // Get user's client information
    const { data: userClient, error: clientError } = await supabase
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
      .single();

    if (clientError || !userClient) {
      throw new Error("Usuario no tiene un cliente asociado");
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    // Use service role to create order (bypassing RLS)
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Create order
    const { data: order, error: orderError } = await adminSupabase
      .from("orders")
      .insert({
        client_id: userClient.client_id,
        user_id: user.id,
        total_amount: totalAmount,
        status: "pending",
        notes: notes,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order error:", orderError);
      throw new Error(`Error creating order: ${orderError.message}`);
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.quantity * item.unitPrice,
    }));

    const { error: itemsError } = await adminSupabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items error:", itemsError);
      throw new Error(`Error creating order items: ${itemsError.message}`);
    }

    // Get product details for email
    const productIds = items.map(item => item.productId);
    const { data: products } = await adminSupabase
      .from("products")
      .select("id, name, price")
      .in("id", productIds);

    // Prepare email content
    const client = userClient.clients as any;
    let orderDetailsHtml = "";
    let orderTextWA = "Nuevo pedido de " + client.name + ":\n\n";

    items.forEach(item => {
      const product = products?.find(p => p.id === item.productId);
      if (product) {
        orderDetailsHtml += `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${product.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.unitPrice.toLocaleString()}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(item.quantity * item.unitPrice).toLocaleString()}</td>
          </tr>
        `;
        orderTextWA += `• ${product.name} x${item.quantity} = $${(item.quantity * item.unitPrice).toLocaleString()}\n`;
      }
    });

    orderTextWA += `\nTotal: $${totalAmount.toLocaleString()}`;
    if (notes) {
      orderTextWA += `\nNotas: ${notes}`;
    }
    orderTextWA += `\n\nCliente: ${client.name}`;
    if (client.company) orderTextWA += ` (${client.company})`;
    orderTextWA += `\nEmail: ${client.email}`;
    if (client.phone) orderTextWA += `\nTeléfono: ${client.phone}`;

    // Send email notification
    const fromEmail = Deno.env.get("FROM_EMAIL") || "noreply@alnatural.com";
    
    try {
      await resend.emails.send({
        from: fromEmail,
        to: [client.email],
        subject: `Confirmación de pedido #${order.id.slice(-8)}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4CAF50;">Pedido Confirmado</h1>
            <p>Hola <strong>${client.name}</strong>,</p>
            <p>Tu pedido ha sido recibido exitosamente:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #f5f5f5;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Producto</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Cantidad</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Precio Unit.</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderDetailsHtml}
                <tr style="background: #f9f9f9; font-weight: bold;">
                  <td colspan="3" style="padding: 12px; text-align: right;">TOTAL:</td>
                  <td style="padding: 12px; text-align: right;">$${totalAmount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            ${notes ? `<p><strong>Notas:</strong> ${notes}</p>` : ''}
            
            <p>Nos pondremos en contacto contigo pronto para coordinar la entrega.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              Al Natural - Productos sin gluten de calidad<br>
              Número de pedido: #${order.id.slice(-8)}
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Email error (non-critical):", emailError);
    }

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
        orderId: order.id,
        message: "Pedido creado exitosamente",
        order: {
          id: order.id,
          total: totalAmount,
          status: order.status,
          items: orderItems.length,
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