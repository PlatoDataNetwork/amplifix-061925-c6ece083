import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Stopping all active AI processing jobs');

    // Update all in_progress jobs to failed status
    const { data, error } = await supabase
      .from('ai_processing_jobs')
      .update({ 
        status: 'failed',
        completed_at: new Date().toISOString()
      })
      .eq('status', 'in_progress')
      .select();

    console.log(`Found ${data?.length || 0} jobs to stop`);

    if (error) {
      console.error('Error stopping jobs:', error);
      throw error;
    }

    console.log(`Stopped ${data?.length || 0} jobs`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Stopped ${data?.length || 0} AI processing jobs`,
        stoppedJobs: data?.length || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in stop-all-ai-processing:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
