import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface AerospaceArticle {
  id?: number;
  post_id?: number;
  title: string;
  content?: string;
  excerpt?: string;
  date?: string;
  slug: string;
  metadata?: {
    sourceLink?: string[];
    featuredImage?: string[];
    [key: string]: any;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
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

    console.log(`Admin user ${user.email} authenticated for full Aerospace import`);

    // Create service role client for database operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    console.log('Starting full import of Aerospace articles');

    // Fetch articles from Aerospace feed
    const apiUrl = 'https://platodata.ai/aerospace/json/';
    console.log(`Fetching from: ${apiUrl}`);

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Aerospace feed: ${response.statusText}`);
    }

    const articlesData = await response.json();
    
    // Handle various response formats
    let articles: AerospaceArticle[] = [];
    if (Array.isArray(articlesData)) {
      articles = articlesData;
    } else if (articlesData.posts && Array.isArray(articlesData.posts)) {
      articles = articlesData.posts;
    } else if (articlesData.articles && Array.isArray(articlesData.articles)) {
      articles = articlesData.articles;
    } else if (typeof articlesData === 'object' && articlesData !== null) {
      const possibleArticles = Object.values(articlesData);
      if (possibleArticles.length > 0 && typeof possibleArticles[0] === 'object') {
        articles = possibleArticles as AerospaceArticle[];
      }
    }

    console.log(`Fetched ${articles.length} articles from feed`);

    const results = {
      success: true,
      vertical: 'aerospace',
      totalInFeed: articles.length,
      imported: 0,
      skipped: 0,
      errors: 0,
      duration: 0
    };

    // Process all articles
    for (const article of articles) {
      try {
        const postId = article.post_id || article.id;
        
        if (!postId) {
          console.error('Article missing ID:', article);
          results.errors++;
          continue;
        }

        // Check if article already exists
        const { data: existingArticle } = await supabaseClient
          .from('articles')
          .select('id, post_id')
          .eq('post_id', postId)
          .maybeSingle();

        if (existingArticle) {
          console.log(`Article ${postId} already exists, skipping`);
          results.skipped++;
          continue;
        }

        // Prepare article data
        const imageUrl = article.metadata?.featuredImage?.[0] || null;
        const externalUrl = article.metadata?.sourceLink?.[0] || null;
        const content = article.content || article.excerpt || '';
        const excerpt = article.excerpt || content.substring(0, 300);

        const articleData = {
          post_id: postId,
          title: article.title,
          content: content,
          excerpt: excerpt,
          published_at: article.date || new Date().toISOString(),
          vertical_slug: 'aerospace',
          author: 'PlatoData',
          read_time: '3 Min Read',
          image_url: imageUrl,
          external_url: externalUrl,
          metadata: article.metadata || {},
        };

        // Insert article
        const { error: insertError } = await supabaseClient
          .from('articles')
          .insert(articleData);

        if (insertError) {
          console.error(`Error inserting article ${postId}:`, insertError);
          results.errors++;
          continue;
        }

        console.log(`Successfully inserted article ${postId}`);
        results.imported++;

      } catch (err) {
        const postId = article.post_id || article.id || 'unknown';
        console.error(`Error processing article ${postId}:`, err);
        results.errors++;
      }
    }

    results.duration = Date.now() - startTime;

    console.log(`Full import completed:`, results);

    return new Response(
      JSON.stringify(results),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Import error:', error);
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