import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const updateClientSchema = z.object({
  clientId: z.string().uuid(),
  isActive: z.boolean(),
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
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
    const { clientId, isActive } = updateClientSchema.parse(requestData);
    
    if (!clientId || typeof isActive !== 'boolean') {
      throw new Error('Client ID and status are required');
    }

    console.log(`Updating client ${clientId} status to ${isActive}`);

    // Update client status
    const { data, error } = await supabase
      .from('clients')
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', clientId)
      .select()
      .single();

    if (error) {
      console.error('Error updating client status:', error);
      throw new Error(`Error updating client: ${error.message}`);
    }

    console.log(`Client ${clientId} status updated successfully`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        client: data,
        message: isActive ? 'Cliente activado exitosamente' : 'Cliente desactivado exitosamente'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error in update-client-status function:', error);
    return new Response(
      JSON.stringify({ 
        error: "Unable to update client status. Please try again or contact support.",
        code: "CLIENT_UPDATE_FAILED"
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});