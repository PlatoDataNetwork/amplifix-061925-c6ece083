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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { verticalSlug } = await req.json();

    if (!verticalSlug) {
      throw new Error('verticalSlug is required');
    }

    console.log(`Removing source attribution from ${verticalSlug} articles...`);

    // Get all articles for this vertical that have source attribution
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('id, content, title')
      .eq('vertical_slug', verticalSlug)
      .not('content', 'is', null);

    if (fetchError) throw fetchError;

    if (!articles || articles.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: `No articles with source attribution found for ${verticalSlug}`,
          removed: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${articles.length} articles to clean`);

    let removed = 0;
    const errors = [];

    // Update articles in batches
    for (const article of articles) {
      try {
        // Remove source attribution - handle various formats
        let cleanedContent = article.content || '';
        
        // Remove the div with source attribution (handles both old and new formats)
        cleanedContent = cleanedContent.replace(
          /<div[^>]*style="[^"]*margin-top:[^"]*"[^>]*>[\s\S]*?Plato Data Intelligence[\s\S]*?<\/div>/gi,
          ''
        );

        // Remove legacy Plato/Zephyrnet source blocks and links
        cleanedContent = cleanedContent
          // Plato bottom link lists
          .replace(/<ul class="plato-post-bottom-links">[\s\S]*?<\/ul>/gi, '')
          .replace(/<div class="plato-post-bottom-links">[\s\S]*?<\/div>/gi, '')
          .replace(/Source Link:[\s\S]*?<\/a>/gi, '')
          // Text "Source:" lines for legacy domains
          .replace(/Source:\s*Platodata\.?ai/gi, '')
          .replace(/Source:\s*Plato\s*Data\.?ai/gi, '')
          .replace(/Source:\s*Zephyrnet/gi, '')
          .replace(/Source:\s*PlatoData\.network/gi, '')
          .replace(/Source:\s*Plato\s*Data\s*Intelligence/gi, '')
          // Zephyrnet links and URLs
          .replace(/<a[^>]*zephyrnet[^>]*>[\s\S]*?<\/a>/gi, '')
          .replace(/https?:\/\/[^^\s]*zephyrnet[^\s]*/gi, '')
          .replace(/\[.*?\]\(.*?zephyrnet.*?\)/gi, '');
        
        // Remove any lingering line breaks before the end
        cleanedContent = cleanedContent.trim();

        const { error: updateError } = await supabase
          .from('articles')
          .update({ content: cleanedContent })
          .eq('id', article.id);

        if (updateError) {
          console.error(`Error updating article ${article.id}:`, updateError);
          errors.push({ id: article.id, error: updateError.message });
        } else {
          removed++;
          if (removed % 10 === 0) {
            console.log(`Progress: ${removed}/${articles.length} articles cleaned`);
          }
        }
      } catch (error) {
        console.error(`Error processing article ${article.id}:`, error);
        errors.push({ id: article.id, error: error.message });
      }
    }

    console.log(`Completed: ${removed} cleaned, ${errors.length} errors`);

    return new Response(
      JSON.stringify({ 
        message: `Source attribution removed from ${removed} articles`,
        removed,
        total: articles.length,
        errors: errors.length > 0 ? errors : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in remove-source-attribution:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
