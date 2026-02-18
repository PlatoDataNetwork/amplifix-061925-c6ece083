import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Decode JWT
    const token = authHeader.replace('Bearer ', '');
    let userId: string;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.sub;
      if (!userId || (payload.exp && payload.exp * 1000 < Date.now())) throw new Error('Invalid token');
    } catch {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check admin
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', userId).eq('role', 'admin').single();
    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const body = await req.json().catch(() => ({}));
    const batchSize = body.batchSize || 1000;
    const offset = body.offset || 0;
    const verticalSlug = body.verticalSlug || null; // optional filter

    // Fetch default images pool
    const { data: defaultImages } = await supabase.from('default_featured_images').select('image_url');
    const pool = defaultImages?.map(img => img.image_url) || [];

    if (pool.length === 0) {
      return new Response(JSON.stringify({ error: 'No default images found' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Fetch a batch of article IDs
    let query = supabase.from('articles').select('id').range(offset, offset + batchSize - 1).order('published_at', { ascending: false });
    if (verticalSlug) {
      query = query.eq('vertical_slug', verticalSlug);
    }
    const { data: articles, error: fetchError } = await query;

    if (fetchError) throw fetchError;
    if (!articles || articles.length === 0) {
      return new Response(JSON.stringify({ done: true, updated: 0, message: 'No more articles to update' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    let updated = 0;
    // Update each article with a random image
    for (const article of articles) {
      const randomImage = pool[Math.floor(Math.random() * pool.length)];
      const { error: updateError } = await supabase
        .from('articles')
        .update({ image_url: randomImage })
        .eq('id', article.id);

      if (!updateError) updated++;
    }

    const hasMore = articles.length === batchSize;

    console.log(`Updated ${updated}/${articles.length} articles (offset: ${offset}, hasMore: ${hasMore})`);

    return new Response(
      JSON.stringify({
        done: !hasMore,
        updated,
        batchSize,
        offset,
        nextOffset: hasMore ? offset + batchSize : null,
        totalInBatch: articles.length,
        imagePoolSize: pool.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
