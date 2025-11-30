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

    const { articleIds } = await req.json();

    if (!articleIds || !Array.isArray(articleIds) || articleIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'articleIds array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`🔄 Clearing ai_processed flag for ${articleIds.length} article(s)`);

    let cleared = 0;
    for (const articleId of articleIds) {
      const { data: article, error: fetchError } = await supabase
        .from('articles')
        .select('id, metadata')
        .eq('id', articleId)
        .maybeSingle();

      if (fetchError || !article) {
        console.error(`Article ${articleId} not found:`, fetchError);
        continue;
      }

      const metadata = article.metadata || {};
      delete metadata.ai_processed;
      delete metadata.ai_processed_at;

      const { error: updateError } = await supabase
        .from('articles')
        .update({ metadata })
        .eq('id', articleId);

      if (updateError) {
        console.error(`Error clearing article ${articleId}:`, updateError);
      } else {
        cleared++;
        console.log(`✅ Cleared article ${articleId}`);
      }
    }

    console.log(`✅ Cleared ${cleared} out of ${articleIds.length} articles`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Cleared ai_processed flag for ${cleared} articles`,
        cleared,
        total: articleIds.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in clear-article-ai-flag:', error);
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
