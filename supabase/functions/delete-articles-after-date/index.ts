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

    // Get date range and optional vertical filter from request body
    const { startDate, endDate, verticalSlug, previewOnly = false } = await req.json();
    
    if (!startDate && !endDate) {
      throw new Error('Either startDate or endDate must be provided');
    }
    
    // Build the query based on provided dates and vertical
    let query = supabase.from('articles').select('*', { count: 'exact', head: true });
    
    // Add vertical filter if provided
    if (verticalSlug) {
      console.log(`Filtering by vertical: ${verticalSlug}`);
      query = query.eq('vertical_slug', verticalSlug);
    }
    
    if (startDate && endDate) {
      console.log(`Date range: ${startDate} to ${endDate}`);
      query = query.gte('published_at', startDate).lte('published_at', endDate);
    } else if (startDate) {
      console.log(`Articles from ${startDate} onwards`);
      query = query.gte('published_at', startDate);
    } else if (endDate) {
      console.log(`Articles up to ${endDate}`);
      query = query.lte('published_at', endDate);
    }

    // Count how many articles will be affected
    const { count: totalCount, error: countError } = await query;

    if (countError) {
      console.error('Error counting articles:', countError);
      throw countError;
    }

    console.log(`Found ${totalCount || 0} articles in date range`);

    if (!totalCount || totalCount === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No articles found in specified date range',
          deleted: 0,
          preview: true,
          startDate,
          endDate,
          verticalSlug
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build query for fetching sample articles
    let sampleQuery = supabase
      .from('articles')
      .select('id, title, published_at, vertical_slug');
    
    // Add vertical filter if provided
    if (verticalSlug) {
      sampleQuery = sampleQuery.eq('vertical_slug', verticalSlug);
    }
    
    if (startDate && endDate) {
      sampleQuery = sampleQuery.gte('published_at', startDate).lte('published_at', endDate);
    } else if (startDate) {
      sampleQuery = sampleQuery.gte('published_at', startDate);
    } else if (endDate) {
      sampleQuery = sampleQuery.lte('published_at', endDate);
    }
    
    const { data: sampleArticles } = await sampleQuery.limit(10);

    console.log('Sample articles in range:', sampleArticles);
    
    // If preview only, return the count and samples without deleting
    if (previewOnly) {
      return new Response(
        JSON.stringify({
          success: true,
          preview: true,
          count: totalCount,
          startDate,
          endDate,
          verticalSlug,
          sampleArticles: sampleArticles?.map(a => ({
            title: a.title,
            date: a.published_at,
            vertical: a.vertical_slug
          }))
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Delete article_tags relationships first (foreign key constraint)
    let articlesToDeleteQuery = supabase.from('articles').select('id');
    
    // Add vertical filter if provided
    if (verticalSlug) {
      articlesToDeleteQuery = articlesToDeleteQuery.eq('vertical_slug', verticalSlug);
    }
    
    if (startDate && endDate) {
      articlesToDeleteQuery = articlesToDeleteQuery.gte('published_at', startDate).lte('published_at', endDate);
    } else if (startDate) {
      articlesToDeleteQuery = articlesToDeleteQuery.gte('published_at', startDate);
    } else if (endDate) {
      articlesToDeleteQuery = articlesToDeleteQuery.lte('published_at', endDate);
    }
    
    const { data: articlesToDelete } = await articlesToDeleteQuery;

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
    let deleteQuery = supabase.from('articles').delete();
    
    // Add vertical filter if provided
    if (verticalSlug) {
      deleteQuery = deleteQuery.eq('vertical_slug', verticalSlug);
    }
    
    if (startDate && endDate) {
      deleteQuery = deleteQuery.gte('published_at', startDate).lte('published_at', endDate);
    } else if (startDate) {
      deleteQuery = deleteQuery.gte('published_at', startDate);
    } else if (endDate) {
      deleteQuery = deleteQuery.lte('published_at', endDate);
    }
    
    const { error: deleteError } = await deleteQuery;

    if (deleteError) {
      console.error('Error deleting articles:', deleteError);
      throw deleteError;
    }

    console.log(`Successfully deleted ${totalCount} articles`);
    
    const dateRangeMsg = startDate && endDate 
      ? `between ${startDate} and ${endDate}`
      : startDate 
        ? `from ${startDate} onwards`
        : `up to ${endDate}`;
    
    const verticalMsg = verticalSlug ? ` in ${verticalSlug}` : '';

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully deleted articles ${dateRangeMsg}${verticalMsg}`,
        deleted: totalCount,
        startDate,
        endDate,
        verticalSlug,
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
