import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LinkClientRequest {
  accessCode: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accessCode }: LinkClientRequest = await req.json();
    
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
      console.error("User error:", userError);
      throw new Error("Usuario no autenticado");
    }

    console.log("Linking client for user:", user.id, "with code:", accessCode);

    // Validate access code using the database function
    const { data: validationResult, error: validationError } = await supabase
      .rpc("validate_access_code", { access_code: accessCode });

    if (validationError) {
      console.error("Validation error:", validationError);
      throw new Error(`Error validating code: ${validationError.message}`);
    }

    if (!validationResult.valid) {
      return new Response(
        JSON.stringify({
          success: false,
          message: validationResult.message || "Código de acceso inválido",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const clientId = validationResult.client_id;

    // Use service role to link user to client (bypassing RLS)
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if user is already linked to this client
    const { data: existingLink } = await adminSupabase
      .from("user_clients")
      .select("id")
      .eq("user_id", user.id)
      .eq("client_id", clientId)
      .single();

    if (existingLink) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Ya tienes acceso a este cliente",
          client: {
            id: clientId,
            name: validationResult.client_name,
            email: validationResult.client_email,
            company: validationResult.client_company,
          },
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Link user to client
    const { error: linkError } = await adminSupabase
      .from("user_clients")
      .insert({
        user_id: user.id,
        client_id: clientId,
      });

    if (linkError) {
      console.error("Link error:", linkError);
      throw new Error(`Error linking user to client: ${linkError.message}`);
    }

    console.log("User successfully linked to client");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Acceso concedido exitosamente",
        client: {
          id: clientId,
          name: validationResult.client_name,
          email: validationResult.client_email,
          company: validationResult.client_company,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in link-client function:", error);
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