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

// Text cleaning utility
function cleanText(text?: string | null): string {
  if (!text) return "";
  return text
    .replace(/<a\b[^>]*>/gi, "")
    .replace(/<\/a>/gi, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/Source:?:?\s*/gi, "")
    .replace(/Link:?:?\s*/gi, "")
    .replace(/---/g, "")
    .replace(/<\/?(p|div|span|strong|em|ul|ol|li|h[1-6])[^>]*>/gi, "")
    .replace(/<br\s*\/?>(?!\n)/gi, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// AI formatting using Lovable AI
async function formatArticleWithAI(text: string): Promise<string> {
  const apiKey = Deno.env.get('LOVABLE_API_KEY');
  
  if (!apiKey) {
    console.warn('LOVABLE_API_KEY not found, using fallback formatting');
    return fallbackFormatting(text);
  }

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a content formatting assistant. Format article text with proper HTML structure. Identify section headers and mark them with <h3> tags. Add <p> tags for paragraphs. Keep content clean and readable.'
          },
          {
            role: 'user',
            content: `Format this article content with proper HTML structure:\n\n${text}`
          }
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.error('AI formatting failed:', await response.text());
      return fallbackFormatting(text);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || fallbackFormatting(text);
  } catch (error) {
    console.error('Error formatting with AI:', error);
    return fallbackFormatting(text);
  }
}

function fallbackFormatting(text: string): string {
  const paragraphs = text.split(/\n\n+/);
  return paragraphs
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => `<p>${p}</p>`)
    .join('\n');
}

// Extract keywords from text
function extractKeywords(text: string, title: string): string[] {
  const combined = `${title} ${text}`.toLowerCase();
  const words = combined.split(/\s+/);
  
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these',
    'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which',
    'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
    'few', 'more', 'most', 'other', 'some', 'such', 'than', 'too', 'very'
  ]);

  const wordFreq: Record<string, number> = {};
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i].replace(/[^a-z0-9]/g, '');
    if (word.length > 3 && !stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
    
    // Also check 2-word phrases
    if (i < words.length - 1) {
      const phrase = `${word} ${words[i + 1].replace(/[^a-z0-9]/g, '')}`;
      if (phrase.length > 6 && !stopWords.has(word) && !stopWords.has(words[i + 1])) {
        wordFreq[phrase] = (wordFreq[phrase] || 0) + 1;
      }
    }
  }

  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  // Verify authentication
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
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
        global: { headers: { Authorization: authHeader } },
      }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role
    const { data: hasAdminRole, error: roleError } = await supabaseAuth
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });

    if (roleError || !hasAdminRole) {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Admin ${user.email} starting Aerospace import with AI processing (FULL FEED)`);

    // Create service role client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Create channel for real-time progress updates
    const progressChannel = supabaseClient.channel(`aerospace-import-${user.id}`);

    // Helper to broadcast progress
    const broadcastProgress = async (update: any) => {
      await progressChannel.send({
        type: 'broadcast',
        event: 'import-progress',
        payload: update
      });
    };

    const results = {
      success: true,
      vertical: 'aerospace',
      totalInFeed: 0,
      totalPages: 0,
      imported: 0,
      formatted: 0,
      tagged: 0,
      skipped: 0,
      errors: 0,
      duration: 0
    };

    // Loop through all pages
    let currentPage = 1;
    let hasMorePages = true;
    let allArticles: AerospaceArticle[] = [];

    console.log('🔄 Starting paginated import from https://platodata.ai/aerospace/json/');

    // Send initial progress
    await broadcastProgress({
      phase: 'fetching',
      currentPage: 0,
      totalPages: 0,
      articlesCollected: 0,
      message: 'Starting import...'
    });

    while (hasMorePages) {
      console.log(`\n📄 Fetching page ${currentPage}...`);
      
      // Fetch page
      const pageUrl = `https://platodata.ai/aerospace/json/?page=${currentPage}`;
      const response = await fetch(pageUrl);
      
      if (!response.ok) {
        console.error(`Failed to fetch page ${currentPage}: ${response.statusText}`);
        break;
      }

      const articlesData = await response.json();
      
      // Parse articles from various formats
      let pageArticles: AerospaceArticle[] = [];
      if (Array.isArray(articlesData)) {
        pageArticles = articlesData;
      } else if (articlesData.posts && Array.isArray(articlesData.posts)) {
        pageArticles = articlesData.posts;
      } else if (articlesData.articles && Array.isArray(articlesData.articles)) {
        pageArticles = articlesData.articles;
      } else if (typeof articlesData === 'object' && articlesData !== null) {
        const values = Object.values(articlesData);
        if (values.length > 0 && typeof values[0] === 'object') {
          pageArticles = values as AerospaceArticle[];
        }
      }

      console.log(`✓ Page ${currentPage}: Found ${pageArticles.length} articles`);

      // Check if this is the last page (0 articles)
      if (pageArticles.length === 0) {
        console.log(`\n🏁 Reached last page (page ${currentPage} has 0 articles)`);
        hasMorePages = false;
        
        await broadcastProgress({
          phase: 'fetching-complete',
          currentPage: currentPage - 1,
          totalPages: currentPage - 1,
          articlesCollected: allArticles.length,
          message: `Fetching complete: ${allArticles.length} articles collected`
        });
        break;
      }

      // Add to all articles
      allArticles = allArticles.concat(pageArticles);
      results.totalPages = currentPage;
      results.totalInFeed = allArticles.length;

      // Broadcast page progress
      await broadcastProgress({
        phase: 'fetching',
        currentPage: currentPage,
        totalPages: currentPage,
        articlesCollected: allArticles.length,
        articlesOnPage: pageArticles.length,
        message: `Page ${currentPage}: Found ${pageArticles.length} articles`
      });

      currentPage++;

      // Small delay between page fetches to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`\n📊 Total articles collected: ${allArticles.length} from ${results.totalPages} pages`);
    console.log(`\n🚀 Starting AI processing for all articles...\n`);

    // Broadcast processing start
    await broadcastProgress({
      phase: 'processing',
      currentPage: results.totalPages,
      totalPages: results.totalPages,
      articlesCollected: allArticles.length,
      articlesProcessed: 0,
      imported: 0,
      skipped: 0,
      message: 'Starting AI processing...'
    });

    // Process each article
    for (let i = 0; i < allArticles.length; i++) {
      const article = allArticles[i];
      
      // Broadcast progress every 5 articles
      if (i % 5 === 0 && i > 0) {
        await broadcastProgress({
          phase: 'processing',
          currentPage: results.totalPages,
          totalPages: results.totalPages,
          articlesCollected: allArticles.length,
          articlesProcessed: i,
          imported: results.imported,
          skipped: results.skipped,
          errors: results.errors,
          percentComplete: Math.round((i / allArticles.length) * 100),
          message: `Processing: ${i}/${allArticles.length} articles`
        });
      }
      
      if (i % 10 === 0) {
        console.log(`\n📈 Progress: ${i}/${allArticles.length} articles processed (${Math.round((i/allArticles.length)*100)}%)`);
      }
      try {
        const postId = article.post_id || article.id;
        
        if (!postId) {
          console.error('Article missing ID');
          results.errors++;
          continue;
        }

        // Check if exists
        const { data: existingArticle } = await supabaseClient
          .from('articles')
          .select('id, post_id')
          .eq('post_id', postId)
          .maybeSingle();

        if (existingArticle) {
          console.log(`Article ${postId} exists, skipping`);
          results.skipped++;
          continue;
        }

        // Clean and format content
        const rawContent = article.content || article.excerpt || '';
        const cleanedText = cleanText(rawContent);
        
        console.log(`Formatting article ${postId} with AI...`);
        const formattedContent = await formatArticleWithAI(cleanedText);
        
        // Extract keywords
        const keywords = extractKeywords(cleanedText, article.title);
        console.log(`Extracted ${keywords.length} keywords for article ${postId}`);

        // Prepare article data
        const imageUrl = article.metadata?.featuredImage?.[0] || null;
        const externalUrl = article.metadata?.sourceLink?.[0] || null;
        const excerpt = article.excerpt || cleanedText.substring(0, 300);

        const articleData = {
          post_id: postId,
          title: article.title,
          content: formattedContent,
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
        const { data: insertedArticle, error: insertError } = await supabaseClient
          .from('articles')
          .insert(articleData)
          .select('id')
          .single();

        if (insertError) {
          console.error(`Error inserting article ${postId}:`, insertError);
          results.errors++;
          continue;
        }

        results.imported++;
        results.formatted++;

        // Save tags
        if (insertedArticle && keywords.length > 0) {
          for (const keyword of keywords) {
            const slug = keyword.toLowerCase().replace(/\s+/g, '-');
            
            // Upsert tag
            const { data: tag } = await supabaseClient
              .from('tags')
              .upsert({ name: keyword, slug: slug }, { onConflict: 'slug' })
              .select('id')
              .single();

            if (tag) {
              // Link article to tag
              await supabaseClient
                .from('article_tags')
                .upsert({
                  article_id: insertedArticle.id,
                  tag_id: tag.id
                }, { onConflict: 'article_id,tag_id' });
            }
          }
          results.tagged++;
        }

        console.log(`✓ Article ${postId} imported, formatted, and tagged`);

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (err) {
        const postId = article.post_id || article.id || 'unknown';
        console.error(`Error processing article ${postId}:`, err);
        results.errors++;
      }
    }

    results.duration = Date.now() - startTime;

    // Send final progress update
    await broadcastProgress({
      phase: 'complete',
      currentPage: results.totalPages,
      totalPages: results.totalPages,
      articlesCollected: allArticles.length,
      articlesProcessed: allArticles.length,
      imported: results.imported,
      skipped: results.skipped,
      errors: results.errors,
      percentComplete: 100,
      message: 'Import complete!'
    });

    // Clean up channel
    await supabaseClient.removeChannel(progressChannel);

    console.log('\n✅ Aerospace FULL FEED import completed:', results);
    console.log(`   📊 Total Pages: ${results.totalPages}`);
    console.log(`   📰 Total Articles in Feed: ${results.totalInFeed}`);
    console.log(`   ✅ Imported: ${results.imported}`);
    console.log(`   🎨 Formatted with AI: ${results.formatted}`);
    console.log(`   🏷️  Tagged: ${results.tagged}`);
    console.log(`   ⏭️  Skipped (existing): ${results.skipped}`);
    console.log(`   ❌ Errors: ${results.errors}`);
    console.log(`   ⏱️  Duration: ${Math.round(results.duration / 1000)}s`);

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
