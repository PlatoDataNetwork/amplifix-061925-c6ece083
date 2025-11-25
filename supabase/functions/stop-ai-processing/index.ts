import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🛑 Stopping all AI processing jobs');

    // Mark all in_progress jobs as failed
    const { data: stoppedJobs, error } = await supabase
      .from('ai_processing_jobs')
      .update({ 
        status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('status', 'in_progress')
      .select();

    if (error) {
      throw error;
    }

    console.log(`✅ Stopped ${stoppedJobs?.length || 0} jobs`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        stoppedJobs: stoppedJobs?.length || 0,
        message: `Stopped ${stoppedJobs?.length || 0} AI processing jobs`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error stopping AI processing:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
