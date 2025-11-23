import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    console.log('🔄 Resetting AI processing jobs...');

    // Get all jobs to show what will be deleted
    const { data: jobs, error: fetchError } = await supabaseClient
      .from('ai_processing_jobs')
      .select('id, vertical_slug, status, total_chunks, started_at');

    if (fetchError) {
      console.error('Error fetching jobs:', fetchError);
      throw fetchError;
    }

    console.log(`📊 Found ${jobs?.length || 0} AI processing jobs to delete`);

    // Delete all jobs
    const { error: deleteError } = await supabaseClient
      .from('ai_processing_jobs')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (using a dummy condition)

    if (deleteError) {
      console.error('Error deleting jobs:', deleteError);
      throw deleteError;
    }

    console.log('✅ All AI processing jobs have been reset');

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully deleted ${jobs?.length || 0} AI processing jobs`,
        deletedJobs: jobs,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in reset-ai-jobs function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
