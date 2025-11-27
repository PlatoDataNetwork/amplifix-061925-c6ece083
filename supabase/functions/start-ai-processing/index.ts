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
          status: 409,
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

    // Process first chunk to get started
    const processFirstChunk = async () => {
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        try {
          console.log(`📦 Processing chunk ${chunkIndex + 1}/${totalChunks}`);
          
          const response = await fetch(`${supabaseUrl}/functions/v1/format-all-articles`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chunkIndex,
              chunkSize,
              verticalSlug,
              jobId: job.id
            })
          });

          if (!response.ok) {
            console.error(`❌ Chunk ${chunkIndex} failed:`, await response.text());
            
            // Mark chunk as failed
            await supabase
              .from('ai_processing_jobs')
              .update({
                failed_chunks: supabase.rpc('array_append', {
                  arr: job.failed_chunks || [],
                  element: chunkIndex
                })
              })
              .eq('id', job.id);
          } else {
            const result = await response.json();
            console.log(`✅ Chunk ${chunkIndex} complete:`, result);
            
            // Mark chunk as processed
            const { data: currentJob } = await supabase
              .from('ai_processing_jobs')
              .select('processed_chunks')
              .eq('id', job.id)
              .single();

            const processedChunks = currentJob?.processed_chunks || [];
            processedChunks.push(chunkIndex);

            await supabase
              .from('ai_processing_jobs')
              .update({
                processed_chunks: processedChunks,
                updated_at: new Date().toISOString()
              })
              .eq('id', job.id);
          }

          // Longer delay between chunks to prevent overwhelming the system
          await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (error) {
          console.error(`❌ Error processing chunk ${chunkIndex}:`, error);
        }
      }

      // Mark job as complete
      await supabase
        .from('ai_processing_jobs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', job.id);

      console.log(`🎉 AI processing complete for ${verticalSlug}`);
    };

    // Start processing in background
    const ctx = Deno.env.get('DENO_REGION') ? (globalThis as any).EdgeRuntime : null;
    if (ctx && ctx.waitUntil) {
      ctx.waitUntil(processFirstChunk());
    } else {
      processFirstChunk().catch(console.error);
    }

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
