import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const vertical = url.searchParams.get('vertical') || 'artificial-intelligence';
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const pageSize = Math.min(2000, Math.max(1, parseInt(url.searchParams.get('page_size') || '1000')));
    const countOnly = url.searchParams.get('count_only') === 'true';
    const includeTags = url.searchParams.get('include_tags') !== 'false';
    const includeTranslations = url.searchParams.get('include_translations') !== 'false';

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get total count
    const { count: total, error: countError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('vertical_slug', vertical);

    if (countError) throw countError;
    const totalArticles = total || 0;
    const totalPages = Math.ceil(totalArticles / pageSize);

    if (countOnly) {
      return new Response(JSON.stringify({
        vertical,
        total: totalArticles,
        suggested_pages: totalPages,
        page_size: pageSize,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch articles for this page
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('*')
      .eq('vertical_slug', vertical)
      .order('published_at', { ascending: false })
      .range(from, to);

    if (articlesError) throw articlesError;

    const articleIds = (articles || []).map((a: any) => a.id);
    const result: any = { articles: articles || [] };

    // Batch helper
    const batchFetch = async (table: string, column: string, ids: string[], select = '*') => {
      const all: any[] = [];
      for (let i = 0; i < ids.length; i += 500) {
        const chunk = ids.slice(i, i + 500);
        const { data, error } = await supabase
          .from(table)
          .select(select)
          .in(column, chunk);
        if (error) throw error;
        if (data) all.push(...data);
      }
      return all;
    };

    if (includeTranslations && articleIds.length > 0) {
      result.translations = await batchFetch('article_translations', 'article_id', articleIds);
    }

    if (includeTags && articleIds.length > 0) {
      const articleTags = await batchFetch('article_tags', 'article_id', articleIds);
      result.article_tags = articleTags;

      const tagIds = [...new Set(articleTags.map((at: any) => at.tag_id))];
      if (tagIds.length > 0) {
        result.tags = await batchFetch('tags', 'id', tagIds);
      }
    }

    result.meta = {
      vertical,
      page,
      page_size: pageSize,
      total_pages: totalPages,
      total_articles: totalArticles,
      articles_in_page: (articles || []).length,
      exported_at: new Date().toISOString(),
    };

    return new Response(JSON.stringify(result), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="export-${vertical}-page${page}.json"`,
      },
    });
  } catch (error) {
    console.error('export-articles error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
