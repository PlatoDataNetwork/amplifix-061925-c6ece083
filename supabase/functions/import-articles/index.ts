import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const BATCH_SIZE = 100;

interface PlatoDataArticle {
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

interface ImportRequest {
  vertical: string;
  limit?: number;
  offset?: number;
  customJsonUrl?: string;
}

interface ImportStats {
  success: boolean;
  vertical: string;
  totalArticles: number;
  processedArticles: number;
  insertedArticles: number;
  updatedArticles: number;
  errors: number;
  batches: number;
  duration: number;
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

    console.log(`Admin user ${user.email} authenticated for article import`);

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

    // Parse request body
    const { vertical, limit, offset = 0, customJsonUrl }: ImportRequest = await req.json();

    if (!vertical) {
      return new Response(
        JSON.stringify({ error: 'Vertical parameter is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Starting import for vertical: ${vertical}, offset: ${offset}`);

    // Create import history record
    const importStartTime = new Date();
    const { data: historyData, error: historyError } = await supabaseClient
      .from('import_history')
      .insert({
        vertical_slug: vertical,
        imported_by: user.id,
        started_at: importStartTime.toISOString(),
        status: 'in_progress'
      })
      .select()
      .single();

    if (historyError || !historyData) {
      console.error('Failed to create import history:', historyError);
    }
    const historyId = historyData?.id;

    // Fetch articles from PlatoData API - use custom URL if provided
    const apiUrl = customJsonUrl || `https://dashboard.platodata.io/json/${vertical}.json`;
    console.log(`Fetching from: ${apiUrl}`);

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${vertical} feed: ${response.statusText}`);
    }

    const responseData = await response.json();
    
    // Handle both array and object responses
    let articles: PlatoDataArticle[] = Array.isArray(responseData) 
      ? responseData 
      : responseData.articles || [];

    console.log(`Fetched ${articles.length} articles from API`);

    // Apply limit and offset if specified
    if (offset > 0) {
      articles = articles.slice(offset);
    }
    if (limit && limit > 0) {
      articles = articles.slice(0, limit);
    }

    if (articles.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No articles to import',
          vertical,
          totalArticles: 0,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let insertedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    const batchCount = Math.ceil(articles.length / BATCH_SIZE);

    // Process articles in batches
    for (let i = 0; i < articles.length; i += BATCH_SIZE) {
      // Check for cancellation if we have a history ID
      if (historyId) {
        const { data: shouldCancel } = await supabaseClient
          .rpc('should_cancel_import', {
            p_vertical_slug: vertical,
            p_started_after: importStartTime.toISOString()
          });

        if (shouldCancel) {
          console.log('🛑 Import cancelled by user');
          
          if (historyId) {
            await supabaseClient
              .from('import_history')
              .update({
                status: 'cancelled',
                completed_at: new Date().toISOString(),
                imported_count: insertedCount,
                error_count: errorCount,
                total_processed: insertedCount + errorCount,
                duration_ms: Date.now() - startTime
              })
              .eq('id', historyId);
          }
          
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Import cancelled by user',
              vertical,
              totalArticles: articles.length,
              insertedArticles: insertedCount,
              errors: errorCount,
              cancelled: true
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      }

      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const batch = articles.slice(i, i + BATCH_SIZE);
      
      console.log(`Processing batch ${batchNum}/${batchCount} (${batch.length} articles)`);

      // Transform articles to database format
      const transformedArticles = batch.map(article => {
        // Calculate read time
        const wordCount = article.content?.split(/\s+/).length || 0;
        const readTime = Math.max(1, Math.ceil(wordCount / 200));

        // Extract image URL
        const imageUrl = article.metadata?.featuredImage?.[0] || null;

        // Extract external URL - prioritize original source, not platodata.ai
        let externalUrl = article.metadata?.sourceLink?.[0] || null;
        
        // If sourceLink is missing or is a platodata.ai URL, try to extract from content
        if (!externalUrl || externalUrl.includes('platodata.')) {
          // Parse HTML content to find first external link
          const urlRegex = /https?:\/\/[^\s<>"]+/g;
          const urls = article.content?.match(urlRegex) || [];
          
          // Priority domains for better source attribution
          const priorityDomains = [
            'reuters.com', 'bloomberg.com', 'wsj.com', 'ft.com',
            'cnbc.com', 'techcrunch.com', 'theverge.com', 'wired.com',
            'forbes.com', 'businessinsider.com', 'marketwatch.com'
          ];
          
          // First try priority domains
          for (const url of urls) {
            if (!url.includes('platodata.') && priorityDomains.some(domain => url.includes(domain))) {
              externalUrl = url;
              break;
            }
          }
          
          // If no priority domain found, use first non-platodata URL
          if (!externalUrl || externalUrl.includes('platodata.')) {
            for (const url of urls) {
              if (!url.includes('platodata.')) {
                externalUrl = url;
                break;
              }
            }
          }
        }

        // Create excerpt from content
        const plainContent = article.content?.replace(/<[^>]*>/g, '') || '';
        const excerpt = plainContent.substring(0, 300).trim() || null;

        return {
          post_id: article.post_id,
          title: article.title,
          excerpt,
          content: article.content,
          author: 'PlatoData',
          published_at: new Date(article.date).toISOString(),
          read_time: `${readTime} min read`,
          category: vertical === 'artificial-intelligence' ? 'AI' : vertical,
          vertical_slug: vertical,
          image_url: imageUrl,
          external_url: externalUrl,
          metadata: article.metadata || {},
        };
      });

      // Insert articles (skip if post_id already exists)
      const { data, error } = await supabaseClient
        .from('articles')
        .upsert(transformedArticles, { 
          onConflict: 'post_id',
          ignoreDuplicates: true 
        })
        .select('id, post_id');

      if (error) {
        console.error(`Batch ${batchNum} error:`, error);
        errorCount += batch.length;
        continue;
      }

      // Count inserts vs updates based on whether the post_id existed before
      const insertedInBatch = data?.length || 0;
      insertedCount += insertedInBatch;

      console.log(`Batch ${batchNum} completed: ${insertedInBatch} articles processed`);

      // Extract and insert tags for articles with AI/Plato tags
      if (vertical === 'artificial-intelligence' && data) {
        try {
          // Ensure AI and Plato tags exist
          const tagsToCreate = [
            { name: 'AI', slug: 'ai' },
            { name: 'Plato', slug: 'plato' }
          ];

          for (const tag of tagsToCreate) {
            await supabaseClient
              .from('tags')
              .upsert(tag, { onConflict: 'slug', ignoreDuplicates: true });
          }

          // Get tag IDs
          const { data: tagData } = await supabaseClient
            .from('tags')
            .select('id, slug')
            .in('slug', ['ai', 'plato']);

          if (tagData && tagData.length > 0) {
            // Create article-tag associations
            const articleTags = data.flatMap(article => 
              tagData.map(tag => ({
                article_id: article.id,
                tag_id: tag.id
              }))
            );

            await supabaseClient
              .from('article_tags')
              .upsert(articleTags, { 
                onConflict: 'article_id,tag_id',
                ignoreDuplicates: true 
              });
          }
        } catch (tagError) {
          console.error('Error processing tags:', tagError);
        }
      }
    }

    const duration = Date.now() - startTime;

    const stats: ImportStats = {
      success: true,
      vertical,
      totalArticles: articles.length,
      processedArticles: articles.length,
      insertedArticles: insertedCount,
      updatedArticles: 0,
      errors: errorCount,
      batches: batchCount,
      duration,
    };

    console.log('Import completed:', stats);

    return new Response(
      JSON.stringify(stats),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Import error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        duration: Date.now() - startTime
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
