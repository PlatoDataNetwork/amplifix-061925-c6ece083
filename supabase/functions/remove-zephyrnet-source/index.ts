import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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

    console.log('Starting Zephyrnet source removal process...');

    // Fetch all articles that have Zephyrnet in their metadata or content
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('id, metadata, external_url, content')
      .or('metadata->source.ilike.%zephyrnet%,content.ilike.%zephyrnet%,external_url.ilike.%zephyrnet%');

    if (fetchError) {
      console.error('Error fetching articles:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${articles?.length || 0} articles with Zephyrnet references`);

    let updatedCount = 0;
    let errorCount = 0;

    // Update each article
    for (const article of articles || []) {
      try {
        const updates: any = {};
        let needsUpdate = false;

        // Update metadata source
        if (article.metadata && typeof article.metadata === 'object') {
          const metadata = article.metadata as any;
          if (metadata.source && typeof metadata.source === 'string' && 
              metadata.source.toLowerCase().includes('zephyrnet')) {
            metadata.source = 'Plato Data Intelligence';
            updates.metadata = metadata;
            needsUpdate = true;
          }
        }

        // Update content - replace Zephyrnet references
        if (article.content && typeof article.content === 'string' && 
            article.content.toLowerCase().includes('zephyrnet')) {
          updates.content = article.content.replace(/zephyrnet/gi, 'Plato Data Intelligence');
          needsUpdate = true;
        }

        // Update external_url if it points to zephyrnet
        if (article.external_url && typeof article.external_url === 'string' && 
            article.external_url.toLowerCase().includes('zephyrnet')) {
          // Remove zephyrnet URLs, set to null or keep original
          updates.external_url = null;
          needsUpdate = true;
        }

        if (needsUpdate) {
          const { error: updateError } = await supabase
            .from('articles')
            .update(updates)
            .eq('id', article.id);

          if (updateError) {
            console.error(`Error updating article ${article.id}:`, updateError);
            errorCount++;
          } else {
            updatedCount++;
            console.log(`Updated article ${article.id}`);
          }
        }
      } catch (error) {
        console.error(`Error processing article ${article.id}:`, error);
        errorCount++;
      }
    }

    console.log(`Completed: ${updatedCount} articles updated, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Zephyrnet source removal completed',
        articlesFound: articles?.length || 0,
        articlesUpdated: updatedCount,
        errors: errorCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in remove-zephyrnet-source function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
