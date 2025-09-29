import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    console.log("Client and access code created successfully - manual handling required");

    return new Response(
      JSON.stringify({
        success: true,
        client: client,
        accessCode: accessCode,
        message: "Cliente creado exitosamente. Código de acceso disponible para envío manual",
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