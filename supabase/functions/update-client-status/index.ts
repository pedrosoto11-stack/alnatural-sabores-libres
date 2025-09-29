import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clientId, isActive } = await req.json();
    
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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});