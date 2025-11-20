import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface AerospaceArticle {
  post_id: number;
  title: string;
  content: string;
  date: string;
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

    console.log(`Admin user ${user.email} authenticated for Aerospace test import`);

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

    // Parse request body for limit (default to 5 articles for testing)
    const body = await req.json().catch(() => ({}));
    const testLimit = body.limit || 5;

    console.log(`Starting test import of ${testLimit} Aerospace articles`);

    // Fetch articles from Aerospace feed
    const apiUrl = 'https://platodata.ai/aerospace/json/';
    console.log(`Fetching from: ${apiUrl}`);

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Aerospace feed: ${response.statusText}`);
    }

    const articlesData = await response.json();
    
    // Handle both array and object responses
    let articles: AerospaceArticle[] = [];
    if (Array.isArray(articlesData)) {
      articles = articlesData;
    } else if (articlesData.articles && Array.isArray(articlesData.articles)) {
      articles = articlesData.articles;
    } else {
      throw new Error('Unexpected API response format');
    }

    console.log(`Fetched ${articles.length} articles from feed`);

    // Take only the requested number of articles for testing
    const testArticles = articles.slice(0, testLimit);
    
    const results = {
      success: true,
      vertical: 'aerospace',
      totalInFeed: articles.length,
      testedArticles: testArticles.length,
      imported: 0,
      skipped: 0,
      errors: 0,
      articles: [] as any[],
      duration: 0
    };

    // Process each article
    for (const article of testArticles) {
      try {
        console.log(`Processing article: ${article.post_id} - ${article.title}`);

        // Check if article already exists
        const { data: existingArticle } = await supabaseClient
          .from('articles')
          .select('id, post_id')
          .eq('post_id', article.post_id)
          .maybeSingle();

        if (existingArticle) {
          console.log(`Article ${article.post_id} already exists, skipping`);
          results.skipped++;
          results.articles.push({
            post_id: article.post_id,
            title: article.title,
            status: 'skipped',
            reason: 'Already exists'
          });
          continue;
        }

        // Prepare article data
        const imageUrl = article.metadata?.featuredImage?.[0] || null;
        const externalUrl = article.metadata?.sourceLink?.[0] || null;

        const articleData = {
          post_id: article.post_id,
          title: article.title,
          content: article.content,
          excerpt: article.content?.substring(0, 300) || '',
          published_at: article.date,
          vertical_slug: 'aerospace',
          author: 'PlatoData',
          read_time: '3 Min Read',
          image_url: imageUrl,
          external_url: externalUrl,
          metadata: article.metadata || {},
        };

        // Insert article
        const { data: insertedArticle, error: insertError } = await supabaseClient
          .from('articles')
          .insert(articleData)
          .select()
          .single();

        if (insertError) {
          console.error(`Error inserting article ${article.post_id}:`, insertError);
          results.errors++;
          results.articles.push({
            post_id: article.post_id,
            title: article.title,
            status: 'error',
            error: insertError.message
          });
          continue;
        }

        console.log(`Successfully inserted article ${article.post_id}`);
        results.imported++;
        results.articles.push({
          post_id: article.post_id,
          title: article.title,
          status: 'imported',
          id: insertedArticle.id,
          url: `/intel/external/${article.post_id}`
        });

      } catch (err) {
        console.error(`Error processing article ${article.post_id}:`, err);
        results.errors++;
        results.articles.push({
          post_id: article.post_id,
          title: article.title || 'Unknown',
          status: 'error',
          error: err.message
        });
      }
    }

    results.duration = Date.now() - startTime;

    console.log(`Test import completed:`, results);

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
