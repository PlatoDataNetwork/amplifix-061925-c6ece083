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

    // Get the cutoff date from request body (default to Jan 1, 2025)
    const { cutoffDate = '2025-01-01' } = await req.json();
    
    console.log(`Starting deletion of articles after ${cutoffDate}...`);

    // First, count how many articles will be affected
    const { count: totalCount, error: countError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .gt('published_at', cutoffDate);

    if (countError) {
      console.error('Error counting articles:', countError);
      throw countError;
    }

    console.log(`Found ${totalCount || 0} articles to delete`);

    if (!totalCount || totalCount === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No articles found after specified date',
          deleted: 0,
          cutoffDate
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get some sample article IDs for logging
    const { data: sampleArticles } = await supabase
      .from('articles')
      .select('id, title, published_at, vertical_slug')
      .gt('published_at', cutoffDate)
      .limit(10);

    console.log('Sample articles to be deleted:', sampleArticles);

    // Delete article_tags relationships first (foreign key constraint)
    const { data: articlesToDelete } = await supabase
      .from('articles')
      .select('id')
      .gt('published_at', cutoffDate);

    if (articlesToDelete && articlesToDelete.length > 0) {
      const articleIds = articlesToDelete.map(a => a.id);
      
      // Delete related article_tags
      const { error: tagsError } = await supabase
        .from('article_tags')
        .delete()
        .in('article_id', articleIds);

      if (tagsError) {
        console.error('Error deleting article tags:', tagsError);
        // Continue anyway, might not have tags
      }
    }

    // Now delete the articles
    const { error: deleteError } = await supabase
      .from('articles')
      .delete()
      .gt('published_at', cutoffDate);

    if (deleteError) {
      console.error('Error deleting articles:', deleteError);
      throw deleteError;
    }

    console.log(`Successfully deleted ${totalCount} articles`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully deleted all articles after ${cutoffDate}`,
        deleted: totalCount,
        cutoffDate,
        sampleDeleted: sampleArticles?.slice(0, 5).map(a => ({
          title: a.title,
          date: a.published_at,
          vertical: a.vertical_slug
        }))
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in delete-articles-after-date function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to delete articles after specified date'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
