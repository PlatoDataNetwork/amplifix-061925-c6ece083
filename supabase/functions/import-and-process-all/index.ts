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

const PLATO_DATA_API = 'https://data.platodata.network/api';

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

    // Import articles from all verticals
    for (const vertical of VERTICALS) {
      console.log(`Importing from ${vertical}...`);
      
      try {
        const response = await fetch(`${PLATO_DATA_API}/${vertical}?limit=100`);
        
        if (!response.ok) {
          console.error(`Failed to fetch ${vertical}: ${response.status}`);
          verticalResults[vertical] = 0;
          continue;
        }

        const articles = await response.json();
        
        if (!Array.isArray(articles) || articles.length === 0) {
          console.log(`No articles found for ${vertical}`);
          verticalResults[vertical] = 0;
          continue;
        }

        // Transform and insert articles
        const transformedArticles = articles.map(article => ({
          post_id: article.id,
          title: article.title?.rendered || 'Untitled',
          excerpt: article.excerpt?.rendered?.replace(/<[^>]*>/g, '').trim() || null,
          content: article.content?.rendered || null,
          author: article.author_name || null,
          published_at: article.date || new Date().toISOString(),
          image_url: article.featured_image_url || null,
          external_url: article.link || null,
          vertical_slug: vertical,
          metadata: {
            categories: article.categories || [],
            tags: article.tags || [],
          }
        }));

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

    console.log(`Total imported: ${totalImported} articles`);

    // Now process all articles with AI formatting and tag extraction
    if (totalImported > 0 && lovableApiKey) {
      console.log('Starting AI processing...');

      // Fetch all articles that need processing
      const { data: articles, error: fetchError } = await supabase
        .from('articles')
        .select('id, title, content, excerpt')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching articles for processing:', fetchError);
      } else if (articles && articles.length > 0) {
        console.log(`Processing ${articles.length} articles with AI...`);

        for (const article of articles) {
          try {
            // Clean and format content
            const cleanedContent = cleanText(article.content || article.excerpt || '');
            
            if (!cleanedContent) {
              console.log(`Skipping article ${article.id} - no content`);
              continue;
            }

            // Format with AI
            const formattedContent = await formatArticleWithAI(cleanedContent, lovableApiKey);

            // Update article content
            const { error: updateError } = await supabase
              .from('articles')
              .update({ content: formattedContent })
              .eq('id', article.id);

            if (updateError) {
              console.error(`Error updating article ${article.id}:`, updateError);
              continue;
            }

            // Extract and save tags
            const tags = extractKeywords(cleanedContent, article.title);
            
            for (const tagName of tags) {
              const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              
              // Get or create tag
              let { data: tag } = await supabase
                .from('tags')
                .select('id')
                .eq('slug', slug)
                .single();

              if (!tag) {
                const { data: newTag } = await supabase
                  .from('tags')
                  .insert({ name: tagName, slug })
                  .select('id')
                  .single();
                tag = newTag;
              }

              if (tag) {
                // Link article to tag
                await supabase
                  .from('article_tags')
                  .upsert({ article_id: article.id, tag_id: tag.id });
              }
            }

            totalProcessed++;
            console.log(`Processed article ${article.id} (${totalProcessed}/${articles.length})`);
          } catch (error) {
            console.error(`Error processing article ${article.id}:`, error);
          }
        }
      }
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

function cleanText(text?: string | null): string {
  if (!text) return '';
  return text
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
            content: 'You are a content formatter. Add semantic HTML structure with headers and paragraphs. Prefix main sections with [HEADER] tag.'
          },
          {
            role: 'user',
            content: `Format this article with proper HTML structure:\n\n${text.slice(0, 4000)}`
          }
        ],
      }),
    });

    if (!response.ok) {
      console.error('AI API error:', response.status);
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
