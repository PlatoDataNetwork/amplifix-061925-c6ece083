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

    const { jobId } = await req.json();

    if (!jobId) {
      return new Response(
        JSON.stringify({ error: 'jobId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`🔄 Resuming AI job ${jobId}`);

    // Get job details
    const { data: job, error: jobError } = await supabase
      .from('ai_processing_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      return new Response(
        JSON.stringify({ error: 'Job not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if job is eligible for resume
    // Allow resuming if there are remaining chunks, even if marked as completed
    const processedChunks = job.processed_chunks || [];
    const totalChunks = job.total_chunks;
    const remainingChunks = totalChunks - processedChunks.length;

    if (remainingChunks === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'All chunks have been processed' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📦 ${remainingChunks} chunks remaining (${processedChunks.length}/${totalChunks} processed)`);

    // Find next unprocessed chunk
    let nextChunkIndex = 0;
    for (let i = 0; i < totalChunks; i++) {
      if (!processedChunks.includes(i)) {
        nextChunkIndex = i;
        break;
      }
    }

    console.log(`📦 Resuming from chunk ${nextChunkIndex}/${totalChunks}`);

    // Reset job status to in_progress
    await supabase
      .from('ai_processing_jobs')
      .update({
        status: 'in_progress',
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);

    // Trigger next chunk with auto-scheduling
    const response = await fetch(`${supabaseUrl}/functions/v1/format-all-articles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chunkIndex: nextChunkIndex,
        chunkSize: 50,
        verticalSlug: job.vertical_slug,
        jobId: job.id,
        autoScheduleNext: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to resume job:`, errorText);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to schedule next chunk',
          details: errorText 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Resumed job from chunk ${nextChunkIndex}/${totalChunks}`,
        jobId,
        nextChunkIndex,
        totalChunks,
        processedSoFar: processedChunks.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error resuming AI job:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
