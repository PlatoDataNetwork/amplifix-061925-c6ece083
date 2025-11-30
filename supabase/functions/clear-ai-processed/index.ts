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

    console.log(`🔄 Clearing ai_processed flag for ${verticalSlug}`);

    // Count articles to be cleared
    const { count: totalCount, error: countError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('vertical_slug', verticalSlug)
      .eq('metadata->>ai_processed', 'true');

    if (countError) {
      throw countError;
    }

    console.log(`Found ${totalCount || 0} articles to clear`);

    // Clear ai_processed flag by updating metadata
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('id, metadata')
      .eq('vertical_slug', verticalSlug)
      .eq('metadata->>ai_processed', 'true');

    if (fetchError) {
      throw fetchError;
    }

    if (!articles || articles.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No articles found to clear',
          cleared: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update each article to remove ai_processed flag
    let cleared = 0;
    for (const article of articles) {
      const metadata = article.metadata || {};
      delete metadata.ai_processed;
      delete metadata.ai_processed_at;

      const { error: updateError } = await supabase
        .from('articles')
        .update({ metadata })
        .eq('id', article.id);

      if (updateError) {
        console.error(`Error clearing article ${article.id}:`, updateError);
      } else {
        cleared++;
      }
    }

    console.log(`✅ Cleared ${cleared} articles`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Cleared ai_processed flag for ${cleared} articles`,
        cleared 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in clear-ai-processed:', error);
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
