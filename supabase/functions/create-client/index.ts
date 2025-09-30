import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const createClientSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(20).optional(),
  company: z.string().trim().max(100).optional(),
  city: z.string().trim().max(50).optional(),
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    // Verify user is authenticated and has admin role
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      throw new Error('Invalid authentication');
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      throw new Error('Admin access required');
    }

    // Validate request body
    const requestData = await req.json();
    const { name, email, phone, company, city } = createClientSchema.parse(requestData);

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