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

    console.log(`Adding source attribution to ${verticalSlug} articles...`);

    // Get all articles for this vertical that have content
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('id, content, title')
      .eq('vertical_slug', verticalSlug)
      .not('content', 'is', null);

    if (fetchError) throw fetchError;

    if (!articles || articles.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: `No articles found for ${verticalSlug}`,
          updated: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${articles.length} articles to update`);

    // Source attribution HTML with proper styling
    const sourceAttribution = `
<div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(229, 231, 235, 0.3);">
  <p style="margin: 0; font-size: 0.875rem; line-height: 1.5;">
    <span style="color: rgba(255, 255, 255, 0.7);">Source: </span>
    <a href="https://plato.io" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: none; font-weight: 500;">Plato Data Intelligence</a>
  </p>
</div>`;

    let updated = 0;
    let skipped = 0;
    const errors = [];

    // Update articles in batches
    for (const article of articles) {
      try {
        // Skip if already has source attribution
        if (article.content && article.content.includes('Plato Data Intelligence')) {
          console.log(`Skipping article ${article.id} - already has source attribution`);
          skipped++;
          continue;
        }

        // Append source attribution to content
        const updatedContent = article.content + sourceAttribution;

        const { error: updateError } = await supabase
          .from('articles')
          .update({ content: updatedContent })
          .eq('id', article.id);

        if (updateError) {
          console.error(`Error updating article ${article.id}:`, updateError);
          errors.push({ id: article.id, error: updateError.message });
        } else {
          updated++;
          if (updated % 10 === 0) {
            console.log(`Progress: ${updated}/${articles.length} articles updated`);
          }
        }
      } catch (error) {
        console.error(`Error processing article ${article.id}:`, error);
        errors.push({ id: article.id, error: error.message });
      }
    }

    console.log(`Completed: ${updated} updated, ${skipped} skipped, ${errors.length} errors`);

    return new Response(
      JSON.stringify({ 
        message: `Source attribution added to ${updated} articles`,
        updated,
        skipped,
        total: articles.length,
        errors: errors.length > 0 ? errors : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in add-source-attribution:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
