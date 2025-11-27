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

    const { verticalSlug = 'aviation' } = await req.json();

    console.log(`🚀 Starting AI processing for ${verticalSlug}`);

    // Check for existing in-progress job
    const { data: existingJob, error: checkError } = await supabase
      .from('ai_processing_jobs')
      .select('*')
      .eq('vertical_slug', verticalSlug)
      .eq('status', 'in_progress')
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    if (existingJob) {
      const progress = existingJob.processed_chunks?.length || 0;
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `AI processing already in progress for ${verticalSlug}`,
          jobId: existingJob.id,
          progress: `${progress}/${existingJob.total_chunks} chunks processed`,
          message: 'Please wait for the current job to complete or cancel it first'
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Count unprocessed articles
    const { count, error: countError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('vertical_slug', verticalSlug)
      .or('metadata->>ai_processed.is.null,metadata->>ai_processed.eq.false')
      .not('content', 'is', null);

    if (countError) {
      throw countError;
    }

    const totalArticles = count || 0;
    const chunkSize = 50;
    const totalChunks = Math.ceil(totalArticles / chunkSize);

    console.log(`📊 Found ${totalArticles} articles to process in ${totalChunks} chunks`);

    if (totalArticles === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No articles to process',
          totalArticles: 0,
          totalChunks: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create AI processing job
    const { data: job, error: jobError } = await supabase
      .from('ai_processing_jobs')
      .insert({
        vertical_slug: verticalSlug,
        total_chunks: totalChunks,
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (jobError) {
      throw jobError;
    }

    console.log(`✅ Created AI processing job ${job.id}`);

    // Process only the first chunk immediately, then let self-scheduling take over
    const processFirstChunk = async () => {
      try {
        console.log(`📦 Starting first chunk (0/${totalChunks}) for job ${job.id}`);
        
        const response = await fetch(`${supabaseUrl}/functions/v1/format-all-articles`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chunkIndex: 0,
            chunkSize,
            verticalSlug,
            jobId: job.id,
            autoScheduleNext: true
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ First chunk failed:`, errorText);
          
          // Mark job as failed
          await supabase
            .from('ai_processing_jobs')
            .update({
              status: 'failed',
              failed_chunks: [0],
              updated_at: new Date().toISOString()
            })
            .eq('id', job.id);
        } else {
          const result = await response.json();
          console.log(`✅ First chunk initiated:`, result);
        }
      } catch (error) {
        console.error(`❌ Error starting first chunk:`, error);
        await supabase
          .from('ai_processing_jobs')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', job.id);
      }
    };

    // Start processing first chunk in background
    processFirstChunk().catch(console.error);

    return new Response(
      JSON.stringify({ 
        success: true, 
        jobId: job.id,
        totalArticles,
        totalChunks,
        message: `Started AI processing for ${totalArticles} articles`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error starting AI processing:', error);
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
