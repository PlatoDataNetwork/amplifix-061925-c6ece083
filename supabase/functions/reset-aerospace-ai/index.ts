import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify admin access
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🔧 Starting aerospace AI processing reset...');

    // Step 1: Delete all aerospace AI processing jobs
    const { error: deleteJobsError } = await supabase
      .from('ai_processing_jobs')
      .delete()
      .eq('vertical_slug', 'aerospace');

    if (deleteJobsError) {
      console.error('Error deleting jobs:', deleteJobsError);
      throw deleteJobsError;
    }

    console.log('✅ Deleted all aerospace AI processing jobs');

    // Step 2: Count articles that still need AI processing (skip already processed)
    const { count: totalCount, error: countError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('vertical_slug', 'aerospace')
      .not('content', 'is', null)
      .or('metadata->>ai_processed.is.null,metadata->>ai_processed.eq.false');

    if (countError) throw countError;

    console.log(`📊 Found ${totalCount} aerospace articles to process`);

    // Step 3: Create a new processing job
    const chunkSize = 50;
    const totalChunks = Math.ceil((totalCount || 0) / chunkSize);

    const { data: newJob, error: createJobError } = await supabase
      .from('ai_processing_jobs')
      .insert({
        vertical_slug: 'aerospace',
        status: 'in_progress',
        total_chunks: totalChunks,
        processed_chunks: [],
        failed_chunks: [],
        started_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (createJobError) {
      console.error('Error creating job:', createJobError);
      throw createJobError;
    }

    console.log(`✅ Created new AI processing job: ${newJob.id}`);

    // Step 4: Start processing first few chunks to kickstart the process
    console.log('🚀 Starting initial chunk processing...');
    
    const initialChunks = Math.min(5, totalChunks); // Process first 5 chunks
    const chunkPromises = [];

    for (let i = 0; i < initialChunks; i++) {
      const promise = supabase.functions.invoke('format-all-articles', {
        body: { 
          chunkIndex: i, 
          chunkSize, 
          verticalSlug: 'aerospace', 
          jobId: newJob.id 
        }
      });
      chunkPromises.push(promise);
    }

    // Wait for initial chunks to start (but don't block on completion)
    Promise.all(chunkPromises).then(() => {
      console.log(`✅ Initial ${initialChunks} chunks started processing`);
    }).catch(err => {
      console.error('Error in initial chunk processing:', err);
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Aerospace AI processing reset and restarted',
        jobId: newJob.id,
        totalArticles: totalCount,
        totalChunks: totalChunks,
        chunkSize: chunkSize,
        initialChunksStarted: initialChunks
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in reset-aerospace-ai:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
