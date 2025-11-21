import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Complete list of all verticals from PlatoData
const VERTICALS = [
  'aerospace',
  'artificial-intelligence',
  'ar-vr',
  'autism',
  'automotive',
  'aviation',
  'big-data',
  'biotech',
  'cannabis',
  'carbon',
  'cleantech',
  'clinical-trials',
  'code',
  'crowdfunding',
  'blockchain',
  'cyber-security',
  'defense',
  'ecommerce',
  'edtech',
  'energy',
  'esg',
  'esports',
  'finance',
  'financefeeds',
  'fintech',
  'forex',
  'gaming',
  'hydrogen',
  'iot',
  'medical-devices',
  'music',
  'nano-technology',
  'nfts',
  'patents',
  'payments',
  'private-equity',
  'psychedelics',
  'quantum',
  'real-estate',
  'saas',
  'semiconductor',
  'seo',
  'solar',
  'spacs',
  'startups',
  'stem-cell',
  'supply-chain',
  'trading',
  'venture-capital',
  'waste-management'
];



serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify admin access
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!roleData || roleData.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Starting import and processing for all verticals...');

    let totalImported = 0;
    let totalProcessed = 0;
    const verticalResults: Record<string, number> = {};

    // Process imports in smaller batches to avoid timeouts
    const BATCH_SIZE = 10;
    
    // Import articles from all verticals
    for (let i = 0; i < VERTICALS.length; i += BATCH_SIZE) {
      const batch = VERTICALS.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(VERTICALS.length / BATCH_SIZE)}`);
      
      for (const vertical of batch) {
      console.log(`Importing from ${vertical}...`);
      
      try {
        const response = await fetch(`https://dashboard.platodata.io/json/${vertical}.json`);
        
        if (!response.ok) {
          console.error(`Failed to fetch ${vertical}: ${response.status}`);
          verticalResults[vertical] = 0;
          continue;
        }

        const responseData = await response.json();
        
        // Handle both array and object responses - API returns { articles: [...] }
        const articles = Array.isArray(responseData) 
          ? responseData 
          : responseData.articles || [];
        
        if (!Array.isArray(articles) || articles.length === 0) {
          console.log(`No articles found for ${vertical}`);
          verticalResults[vertical] = 0;
          continue;
        }

        // Transform and insert articles
        const transformedArticles = articles.map(article => {
          // Remove source links from content  
          const cleanedContent = (article.content?.rendered || article.content)
            ?.replace(/<ul class="plato-post-bottom-links">[\s\S]*?<\/ul>/g, '')
            ?.trim() || null;
          
          // Extract metadata
          const metadata = article.metadata || {};
          const imageUrl = article.featured_image_url || 
                          article.image || 
                          metadata.featuredImage?.[0] || 
                          null;
          const externalUrl = article.link || 
                             metadata.sourceLink?.[0] || 
                             null;
          
          return {
            post_id: article.post_id || article.id,
            title: article.title?.rendered || article.title || 'Untitled',
            excerpt: (article.excerpt?.rendered || article.contentSnippet || '')
              .replace(/<[^>]*>/g, '')
              .trim() || null,
            content: cleanedContent,
            author: article.author_name || article.author || 'PlatoData',
            published_at: article.date || article.pubDate || new Date().toISOString(),
            image_url: imageUrl,
            external_url: externalUrl,
            vertical_slug: vertical,
            metadata: {
              categories: article.categories || metadata.categories || [],
              tags: article.tags || metadata.tags || [],
            }
          };
        });

        const { error: insertError, count } = await supabase
          .from('articles')
          .upsert(transformedArticles, {
            onConflict: 'post_id',
            count: 'exact'
          });

        if (insertError) {
          console.error(`Error inserting articles for ${vertical}:`, insertError);
          verticalResults[vertical] = 0;
        } else {
          const imported = count || 0;
          totalImported += imported;
          verticalResults[vertical] = imported;
          console.log(`Imported ${imported} articles from ${vertical}`);
        }
      } catch (error) {
        console.error(`Error processing ${vertical}:`, error);
        verticalResults[vertical] = 0;
      }
      }
    }

    console.log(`Total imported: ${totalImported} articles`);

    // Return immediately and process articles in background
    const processArticlesInBackground = async () => {
      if (totalImported > 0 && lovableApiKey) {
        console.log('Starting background AI processing...');

        // Fetch articles in batches
        const PROCESS_BATCH_SIZE = 20;
        let offset = 0;
        let hasMore = true;

        while (hasMore) {
          const { data: articles, error: fetchError } = await supabase
            .from('articles')
            .select('id, title, content, excerpt')
            .order('created_at', { ascending: false })
            .range(offset, offset + PROCESS_BATCH_SIZE - 1);

          if (fetchError) {
            console.error('Error fetching articles batch:', fetchError);
            break;
          }

          if (!articles || articles.length === 0) {
            hasMore = false;
            break;
          }

          console.log(`Processing batch at offset ${offset}, size: ${articles.length}`);

          for (const article of articles) {
            try {
              const cleanedContent = cleanText(article.content || article.excerpt || '');
              
              if (!cleanedContent) {
                console.log(`Skipping article ${article.id} - no content`);
                continue;
              }

              const formattedContent = await formatArticleWithAI(cleanedContent, lovableApiKey);

              await supabase
                .from('articles')
                .update({ content: formattedContent })
                .eq('id', article.id);

              const tags = extractKeywords(cleanedContent, article.title);
              
              for (const tagName of tags) {
                const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                
                let { data: tag } = await supabase
                  .from('tags')
                  .select('id')
                  .eq('slug', slug)
                  .maybeSingle();

                if (!tag) {
                  const { data: newTag } = await supabase
                    .from('tags')
                    .insert({ name: tagName, slug })
                    .select('id')
                    .maybeSingle();
                  tag = newTag;
                }

                if (tag) {
                  await supabase
                    .from('article_tags')
                    .upsert({ article_id: article.id, tag_id: tag.id }, {
                      onConflict: 'article_id,tag_id'
                    });
                }
              }

              totalProcessed++;
              if (totalProcessed % 10 === 0) {
                console.log(`Background processed: ${totalProcessed} articles`);
              }
            } catch (error) {
              console.error(`Error processing article ${article.id}:`, error);
            }
          }

          offset += PROCESS_BATCH_SIZE;
          
          if (articles.length < PROCESS_BATCH_SIZE) {
            hasMore = false;
          }
        }

        console.log(`Background processing completed: ${totalProcessed} articles`);
      }
    };

    // Use waitUntil to process in background without blocking response
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
      EdgeRuntime.waitUntil(processArticlesInBackground());
    } else {
      // Fallback: start processing but don't await
      processArticlesInBackground().catch(console.error);
    }

    return new Response(JSON.stringify({
      success: true,
      totalImported,
      totalProcessed,
      verticalResults,
      message: `Imported ${totalImported} articles and processed ${totalProcessed} with AI`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in import-and-process-all:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function cleanText(text?: string | null): string => {
  if (!text) return '';
  return text
    // Remove Plato source links first
    .replace(/<ul class="plato-post-bottom-links">[\s\S]*?<\/ul>/gi, '')
    .replace(/<div class="plato-post-bottom-links">[\s\S]*?<\/div>/gi, '')
    .replace(/Source Link:[\s\S]*?<\/a>/gi, '')
    // Remove other HTML and formatting
    .replace(/<[^>]*>/g, '')
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function formatArticleWithAI(text: string, apiKey: string): Promise<string> {
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
            content: 'You are an expert content formatter. Identify section headers - these are short topic titles (3-15 words) that introduce new sections, often at the start of major content blocks. Common patterns: "The [Topic]", "[Topic]: [Subtitle]", "[Action/Concept] and [Action/Concept]". Mark ALL section headers by prefixing with [HEADER]. Insert paragraph breaks at semantic boundaries. Return ONLY formatted text with [HEADER] markers.'
          },
          {
            role: 'user',
            content: `Identify ALL section headers in this article. Section headers are topic titles like "China Experiences Commercial Rocket Failure While Achieving Record-Breaking Annual Launch Count", "A Record-Breaking Year for Chinese Space Launches", "The Commercial Rocket Failure", "Balancing Success and Challenges". Prefix EVERY section header with [HEADER] and add paragraph breaks:\n\n${text.slice(0, 4000)}`
          }
        ],
      }),
    });

    if (!response.ok) {
      console.error('AI API error:', response.status);
      return fallbackFormatting(text);
    }

    const data = await response.json();
    const formattedText = data.choices?.[0]?.message?.content || text;
    
    // Process blocks and wrap in appropriate tags
    const blocks = formattedText
      .split(/\n\n+/)
      .map((block: string) => block.trim())
      .filter(Boolean);

    return blocks.map((block: string) => {
      if (block.startsWith('[HEADER]')) {
        const headerText = block.replace('[HEADER]', '').trim();
        return `<h3>${headerText}</h3>`;
      }
      return `<p>${block}</p>`;
    }).join("\n\n");
  } catch (error) {
    console.error('Error formatting with AI:', error);
    return fallbackFormatting(text);
  }
}

function fallbackFormatting(text: string): string {
  const paragraphs = text.split(/\n\n+/);
  return paragraphs
    .filter(p => p.trim().length > 0)
    .map(p => `<p>${p.trim()}</p>`)
    .join('\n');
}

function extractKeywords(text: string, title: string): string[] {
  const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by', 'that', 'this', 'it', 'from', 'are', 'was', 'be', 'been', 'has', 'have', 'had', 'will', 'would', 'could', 'should']);
  
  const combined = `${title} ${text}`.toLowerCase();
  const words = combined.match(/\b[a-z]{3,}\b/g) || [];
  
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    if (!stopWords.has(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });

  // Extract multi-word phrases
  const phrases = combined.match(/\b[a-z]+(?:\s+[a-z]+){1,2}\b/g) || [];
  phrases.forEach(phrase => {
    if (!stopWords.has(phrase.split(' ')[0])) {
      frequency[phrase] = (frequency[phrase] || 0) + 2;
    }
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
}
