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

    console.log(`Resetting AI processing flag for vertical: ${verticalSlug}`);

    // Get all articles for this vertical that have been AI processed
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('id, metadata')
      .eq('vertical_slug', verticalSlug)
      .not('metadata->ai_processed', 'is', null);

    if (fetchError) {
      throw fetchError;
    }

    if (!articles || articles.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No AI-processed articles found for this vertical',
          count: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${articles.length} articles to reset`);

    // Reset the ai_processed flag for each article
    const updates = articles.map(article => {
      const metadata = article.metadata || {};
      delete metadata.ai_processed;
      delete metadata.ai_processed_at;

      return supabase
        .from('articles')
        .update({ 
          metadata,
          updated_at: new Date().toISOString()
        })
        .eq('id', article.id);
    });

    const results = await Promise.all(updates);
    
    const errors = results.filter(r => r.error);
    if (errors.length > 0) {
      console.error(`Failed to reset ${errors.length} articles:`, errors);
    }

    const successCount = results.filter(r => !r.error).length;

    console.log(`Successfully reset ${successCount} articles for ${verticalSlug}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Reset ${successCount} articles for reprocessing`,
        count: successCount,
        errors: errors.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error resetting AI processing:', error);
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
