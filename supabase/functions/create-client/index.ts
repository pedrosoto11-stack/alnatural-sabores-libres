import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateClientRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  city?: string;
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, company, city }: CreateClientRequest = await req.json();

    console.log("Creating client:", { name, email, company });

    // Create client
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .insert({
        name,
        email,
        phone,
        company,
        city,
      })
      .select()
      .single();

    if (clientError) {
      console.error("Error creating client:", clientError);
      throw new Error(`Error creating client: ${clientError.message}`);
    }

    console.log("Client created:", client);

    // Generate unique access code
    const { data: codeData } = await supabase.rpc("generate_access_code");
    const accessCode = codeData;

    console.log("Generated access code:", accessCode);

    // Create access code entry
    const { error: codeError } = await supabase
      .from("access_codes")
      .insert({
        code: accessCode,
        client_id: client.id,
        is_active: true,
      });

    if (codeError) {
      console.error("Error creating access code:", codeError);
      throw new Error(`Error creating access code: ${codeError.message}`);
    }

    // Send email with access code
    const fromEmail = Deno.env.get("FROM_EMAIL") || "noreply@alnatural.com";
    
    const emailResponse = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: "Tu código de acceso - Al Natural",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4CAF50;">¡Bienvenido a Al Natural!</h1>
          <p>Hola <strong>${name}</strong>,</p>
          <p>Gracias por unirte a nuestra red de distribuidores. Tu código de acceso único es:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h2 style="color: #333; font-size: 24px; margin: 0; letter-spacing: 2px;">${accessCode}</h2>
          </div>
          <p>Con este código podrás:</p>
          <ul>
            <li>Ver precios especiales para distribuidores</li>
            <li>Realizar pedidos directamente desde nuestro catálogo</li>
            <li>Acceder a información exclusiva de productos</li>
          </ul>
          <p>Para acceder, visita nuestro catálogo y haz clic en "Tengo código de acceso".</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666;">
            Este código es personal e intransferible. Manténlo seguro.<br>
            Si tienes alguna pregunta, contáctanos directamente.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        client: client,
        accessCode: accessCode,
        message: "Cliente creado exitosamente y código enviado por email",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in create-client function:", error);
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