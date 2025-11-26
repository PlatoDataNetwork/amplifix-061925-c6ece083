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

    console.log('Starting footer normalization for all verticals except aerospace and aviation...');

    // Get all articles EXCEPT aerospace and aviation with non-null content
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('id, vertical_slug, content')
      .not('vertical_slug', 'in', '(aerospace,aviation)')
      .not('content', 'is', null);

    if (fetchError) throw fetchError;

    if (!articles || articles.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No articles found to normalize',
          updated: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${articles.length} articles to normalize`);

    let updated = 0;
    const errors = [];

    // Process articles in batches
    for (const article of articles) {
      try {
        let cleanedContent = article.content || '';
        
        // Remove all footer patterns from content:
        cleanedContent = cleanedContent
          // Remove Published paragraphs at the end
          .replace(/<p class="text-sm text-muted-foreground mt-6 pt-4 border-t border-border">[\s\S]*?Published:[\s\S]*?<\/p>/gi, '')
          .replace(/<p[^>]*>[\s\S]*?Published:[\s\S]*?Source:[\s\S]*?<\/p>/gi, '')
          
          // Remove source attribution divs
          .replace(/<div[^>]*style="[^"]*margin-top:[^"]*"[^>]*>[\s\S]*?Plato Data Intelligence[\s\S]*?<\/div>/gi, '')
          
          // Remove legacy Plato/Zephyrnet blocks
          .replace(/<ul class="plato-post-bottom-links">[\s\S]*?<\/ul>/gi, '')
          .replace(/<div class="plato-post-bottom-links">[\s\S]*?<\/div>/gi, '')
          .replace(/Source Link:[\s\S]*?<\/a>/gi, '')
          
          // Remove text source lines
          .replace(/Published:.*?\|.*?Source:.*?platodata\.ai/gi, '')
          .replace(/Published:.*?\|.*?Source:.*?Plato Data Intelligence/gi, '')
          .replace(/Source:\s*Platodata\.?ai/gi, '')
          .replace(/Source:\s*Plato\s*Data\.?ai/gi, '')
          .replace(/Source:\s*Zephyrnet/gi, '')
          .replace(/Source:\s*PlatoData\.network/gi, '')
          .replace(/Source:\s*Plato\s*Data\s*Intelligence/gi, '')
          
          // Remove Zephyrnet links
          .replace(/<a[^>]*zephyrnet[^>]*>[\s\S]*?<\/a>/gi, '')
          .replace(/https?:\/\/[^\s]*zephyrnet[^\s]*/gi, '')
          .replace(/\[.*?\]\(.*?zephyrnet.*?\)/gi, '');
        
        // Trim trailing whitespace
        cleanedContent = cleanedContent.trim();

        // Only update if content actually changed
        if (cleanedContent !== article.content) {
          const { error: updateError } = await supabase
            .from('articles')
            .update({ 
              content: cleanedContent,
              updated_at: new Date().toISOString()
            })
            .eq('id', article.id);

          if (updateError) {
            console.error(`Error updating article ${article.id}:`, updateError);
            errors.push({ id: article.id, error: updateError.message });
          } else {
            updated++;
            if (updated % 100 === 0) {
              console.log(`Progress: ${updated}/${articles.length} articles normalized`);
            }
          }
        }
      } catch (error) {
        console.error(`Error processing article ${article.id}:`, error);
        errors.push({ id: article.id, error: error.message });
      }
    }

    console.log(`Completed: ${updated} normalized, ${errors.length} errors`);

    return new Response(
      JSON.stringify({ 
        message: `Footer normalization complete`,
        updated,
        total: articles.length,
        skipped: articles.length - updated - errors.length,
        errors: errors.length > 0 ? errors.slice(0, 10) : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in normalize-article-footers:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
