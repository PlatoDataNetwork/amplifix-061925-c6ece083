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

    console.log('Starting AR/VR source attribution fix...');

    // Get all AR/VR articles without attribution
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('id, content')
      .eq('vertical_slug', 'ar-vr')
      .not('content', 'is', null)
      .not('content', 'like', '%Plato Data Intelligence%');

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${articles?.length || 0} articles to update`);

    if (!articles || articles.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'All AR/VR articles already have source attribution',
          updated: 0,
          total: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Source attribution with proper line break
    const sourceAttribution = `

<div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 2px solid rgba(229, 231, 235, 0.5);">
  <p style="margin: 0; font-size: 0.875rem; line-height: 1.5;">
    <span style="color: rgba(255, 255, 255, 0.7);">Source: </span>
    <a href="https://plato.io" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: none; font-weight: 500;">Plato Data Intelligence</a>
  </p>
</div>`;

    let updated = 0;
    const errors = [];

    // Process in batches of 10 for better performance
    const batchSize = 10;
    for (let i = 0; i < articles.length; i += batchSize) {
      const batch = articles.slice(i, i + batchSize);
      
      const updatePromises = batch.map(async (article) => {
        try {
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
          }
        } catch (error) {
          console.error(`Exception updating article ${article.id}:`, error);
          errors.push({ id: article.id, error: error.message });
        }
      });

      await Promise.all(updatePromises);
      console.log(`Processed batch ${Math.floor(i / batchSize) + 1}: ${updated}/${articles.length} updated`);
    }

    console.log(`Completed: ${updated} updated, ${errors.length} errors`);

    return new Response(
      JSON.stringify({ 
        message: `Source attribution added to ${updated} AR/VR articles`,
        updated,
        total: articles.length,
        errors: errors.length > 0 ? errors.slice(0, 5) : undefined // Only return first 5 errors
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in fix-arvr-attribution:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
