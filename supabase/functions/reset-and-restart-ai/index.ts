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

    const { verticalSlug } = await req.json();

    if (!verticalSlug) {
      return new Response(
        JSON.stringify({ error: 'verticalSlug is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`🔄 Resetting and restarting AI processing for ${verticalSlug}`);

    // Step 1: Find and complete any in-progress jobs
    const { data: existingJobs, error: fetchError } = await supabase
      .from('ai_processing_jobs')
      .select('*')
      .eq('vertical_slug', verticalSlug)
      .eq('status', 'in_progress')
      .order('started_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching existing jobs:', fetchError);
      throw fetchError;
    }

    if (existingJobs && existingJobs.length > 0) {
      console.log(`Found ${existingJobs.length} in-progress job(s) to complete`);
      
      for (const job of existingJobs) {
        const { error: updateError } = await supabase
          .from('ai_processing_jobs')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', job.id);

        if (updateError) {
          console.error(`Error completing job ${job.id}:`, updateError);
        } else {
          console.log(`✅ Marked job ${job.id} as completed`);
        }
      }
    }

    // Step 2: Count unprocessed articles
    const { count: unprocessedCount, error: countError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('vertical_slug', verticalSlug)
      .not('content', 'is', null)
      .or('metadata->>ai_processed.is.null,metadata->>ai_processed.eq.false');

    if (countError) {
      console.error('Error counting unprocessed articles:', countError);
      throw countError;
    }

    if (!unprocessedCount || unprocessedCount === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'All articles already processed, no new job needed',
          completedJobs: existingJobs?.length || 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${unprocessedCount} unprocessed articles`);

    // Step 3: Create new AI processing job
    const chunkSize = 50;
    const totalChunks = Math.ceil(unprocessedCount / chunkSize);

    const { data: newJob, error: jobError } = await supabase
      .from('ai_processing_jobs')
      .insert({
        vertical_slug: verticalSlug,
        total_chunks: totalChunks,
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (jobError || !newJob) {
      console.error('Error creating new job:', jobError);
      throw jobError;
    }

    console.log(`✅ Created new job ${newJob.id} with ${totalChunks} chunks`);

    // Step 4: Start processing first chunk
    const { error: startError } = await supabase.functions.invoke('format-all-articles', {
      body: {
        chunkIndex: 0,
        chunkSize,
        verticalSlug,
        jobId: newJob.id,
        autoScheduleNext: true
      }
    });

    if (startError) {
      console.error('Error starting first chunk:', startError);
      throw startError;
    }

    console.log(`🚀 Started processing chunk 0 for job ${newJob.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Reset complete. Started new job with ${unprocessedCount} articles (${totalChunks} chunks)`,
        completedJobs: existingJobs?.length || 0,
        newJobId: newJob.id,
        articlesToProcess: unprocessedCount,
        totalChunks
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in reset-and-restart-ai:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
