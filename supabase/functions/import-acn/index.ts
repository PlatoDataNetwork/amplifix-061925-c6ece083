import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import Parser from 'https://esm.sh/rss-parser@3.13.0'

const ACN_RSS_URL = 'https://www.acnnewswire.com/rss/lang/english.xml';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  // Verify authentication
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized: Missing authorization header' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Create client for auth verification
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: { persistSession: false },
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verify user authentication
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized: Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin role
    const { data: hasAdminRole, error: roleError } = await supabaseAuth
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });

    if (roleError || !hasAdminRole) {
      console.error('Role check error:', roleError);
      return new Response(
        JSON.stringify({ success: false, error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Admin user ${user.email} authenticated for ACN import`);

    // Create service role client for database operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: { persistSession: false },
      }
    );

    console.log(`Fetching ACN RSS from: ${ACN_RSS_URL}`);
    
    const parser = new Parser();
    const feed = await parser.parseURL(ACN_RSS_URL);
    
    console.log(`Found ${feed.items.length} items in RSS feed`);
    
    const articles = feed.items.map((item) => {
      const title = item.title || '';
      const link = item.link || '';
      const pubDate = item.pubDate || item.isoDate || '';
      const author = item.creator || item.author || 'ACN Newswire';
      const description = item.contentSnippet || item.description || '';
      const content = item.content || item['content:encoded'] || description;
      const categories = item.categories || [];
      
      // Generate unique post_id from title and date
      const postId = Math.abs(
        (title + pubDate).split('').reduce((hash, char) => {
          return ((hash << 5) - hash) + char.charCodeAt(0);
        }, 0)
      ) % 1000000000;
      
      const pubDateObj = new Date(pubDate);
      const wordCount = content?.split(/\s+/).length || 0;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));
      
      return {
        post_id: postId,
        title,
        excerpt: 'ACN. Your Gateway to the Asian Capital Markets.',
        content: content || '',
        author,
        read_time: `${readTime} min read`,
        category: 'ACN',
        vertical_slug: 'acn',
        image_url: null,
        external_url: link,
        published_at: pubDateObj.toISOString(),
        metadata: {
          sourceLink: [link],
          categories,
        }
      };
    });

    console.log(`Transformed ${articles.length} articles`);

    // Upsert articles in batches of 100
    let insertedCount = 0;
    let errorCount = 0;
    const BATCH_SIZE = 100;
    
    for (let i = 0; i < articles.length; i += BATCH_SIZE) {
      const batch = articles.slice(i, i + BATCH_SIZE);
      
      const { data, error } = await supabaseClient
        .from('articles')
        .upsert(batch, {
          onConflict: 'post_id',
          ignoreDuplicates: false
        })
        .select('id');

      if (error) {
        console.error(`Error in batch ${i / BATCH_SIZE + 1}:`, error);
        errorCount += batch.length;
      } else {
        insertedCount += data?.length || 0;
      }
    }

    const duration = Date.now() - startTime;
    const stats = {
      success: true,
      vertical: 'acn',
      totalArticles: articles.length,
      insertedArticles: insertedCount,
      errors: errorCount,
      duration
    };

    console.log('ACN import completed:', stats);

    return new Response(
      JSON.stringify(stats),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('ACN import error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        duration: Date.now() - startTime
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});