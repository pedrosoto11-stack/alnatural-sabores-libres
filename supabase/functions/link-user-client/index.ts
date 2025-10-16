import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { client_id } = await req.json();
    
    if (!client_id) {
      throw new Error('client_id is required');
    }

    // Get authenticated user
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

    // Use service role to create the link (bypassing RLS)
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if link already exists
    const { data: existingLink } = await adminSupabase
      .from("user_clients")
      .select("id")
      .eq("user_id", user.id)
      .eq("client_id", client_id)
      .single();

    if (existingLink) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Link already exists",
          link_id: existingLink.id
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Create new link
    const { data: newLink, error: linkError } = await adminSupabase
      .from("user_clients")
      .insert({
        user_id: user.id,
        client_id: client_id
      })
      .select()
      .single();

    if (linkError) {
      console.error("Error creating user-client link:", linkError);
      throw new Error(`Error creating link: ${linkError.message}`);
    }

    console.log(`User ${user.id} linked to client ${client_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "User linked to client successfully",
        link_id: newLink.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error: any) {
    console.error("Error in link-user-client function:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
