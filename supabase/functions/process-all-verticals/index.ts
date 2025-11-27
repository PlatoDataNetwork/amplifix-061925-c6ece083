import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { corsHeaders } from '../_shared/cors.ts';

const VERTICALS_TO_PROCESS = [
  'blockchain',
  'fintech',
  'ai',
  'healthtech',
  'cleantech',
  'edtech',
  'arvr',
  'security',
  'mobility',
  'iot',
  'biotech',
  'legal',
  'hr',
  'marketing',
  'analytics'
  // Explicitly excluding: aerospace, aviation
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting continuous AI processing for all verticals (except aerospace, aviation)');

    const results = [];
    
    for (const verticalSlug of VERTICALS_TO_PROCESS) {
      console.log(`\n=== Processing vertical: ${verticalSlug} ===`);
      
      try {
        // Count articles that need AI processing
        const { count, error: countError } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('vertical_slug', verticalSlug)
          .is('metadata->ai_processed', null);

        if (countError) {
          console.error(`Error counting articles for ${verticalSlug}:`, countError);
          results.push({ vertical: verticalSlug, status: 'error', error: countError.message });
          continue;
        }

        if (!count || count === 0) {
          console.log(`No unprocessed articles found for ${verticalSlug}, skipping`);
          results.push({ vertical: verticalSlug, status: 'skipped', reason: 'no_unprocessed_articles' });
          continue;
        }

        console.log(`Found ${count} unprocessed articles for ${verticalSlug}`);

        // Call the start-ai-processing function for this vertical
        const { data: processData, error: processError } = await supabase.functions.invoke(
          'start-ai-processing',
          {
            body: { verticalSlug }
          }
        );

        if (processError) {
          console.error(`Error starting AI processing for ${verticalSlug}:`, processError);
          results.push({ vertical: verticalSlug, status: 'error', error: processError.message });
          continue;
        }

        console.log(`Successfully started AI processing for ${verticalSlug}:`, processData);
        results.push({ 
          vertical: verticalSlug, 
          status: 'processing', 
          articlesCount: count,
          jobId: processData?.jobId 
        });

        // Wait a bit between verticals to avoid overwhelming the system
        console.log('Waiting 5 seconds before next vertical...');
        await new Promise(resolve => setTimeout(resolve, 5000));

      } catch (error) {
        console.error(`Exception processing ${verticalSlug}:`, error);
        results.push({ 
          vertical: verticalSlug, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    console.log('\n=== All verticals processing initiated ===');
    console.log('Summary:', results);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Initiated AI processing for ${results.filter(r => r.status === 'processing').length} verticals`,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-all-verticals:', error);
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
