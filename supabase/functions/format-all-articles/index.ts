import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { corsHeaders } from '../_shared/cors.ts';

// Clean text by removing unwanted HTML and formatting
const cleanText = (text?: string | null): string => {
  if (!text) return "";
  
  return text
    // Remove Plato source links first
    .replace(/<ul class="plato-post-bottom-links">[\s\S]*?<\/ul>/gi, '')
    .replace(/<div class="plato-post-bottom-links">[\s\S]*?<\/div>/gi, '')
    .replace(/Source Link:[\s\S]*?<\/a>/gi, '')
    // Remove various source attributions
    .replace(/Source:\s*Platodata\.ai/gi, '')
    .replace(/Source:\s*Plato\s*Data\.ai/gi, '')
    .replace(/Source:\s*Zephyrnet/gi, '')
    .replace(/Source:\s*PlatoData\.network/gi, '')
    .replace(/Source:\s*Plato\s*Data\s*Intelligence/gi, '')
    // Remove other HTML and formatting
    .replace(/<a\b[^>]*>/gi, "")
    .replace(/<\/a>/gi, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/Link:?:?\s*/gi, "")
    .replace(/---/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/<\/?p>/gi, "")
    .replace(/<\/?div>/gi, "")
    .replace(/<\/?span>/gi, "")
    .replace(/<ul[^>]*>[\s\S]*?<\/ul>/gi, "")
    .replace(/<li[^>]*>[\s\S]*?<\/li>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^[ \t]+/gm, "")
    .trim();
};

// Use AI to detect semantic breaks and split into paragraphs with headers
const formatArticleWithAI = async (text: string, retries = 3): Promise<string> => {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    console.error("LOVABLE_API_KEY not found, falling back to simple formatting");
    return fallbackFormatting(text);
  }

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `You are an expert article formatter. Your job is to identify section headers and structure articles properly.

WHAT IS A SECTION HEADER:
- A short title (3-15 words) that introduces a NEW topic, concept, or section
- Usually appears at natural topic transitions in the article
- Often in title case or starts with capital letters
- Examples: "The Rise of AI", "Key Benefits", "Technical Implementation", "Market Impact"

WHAT IS NOT A SECTION HEADER:
- The first sentence of a paragraph describing details
- Long sentences (over 15 words)
- Questions within paragraphs
- Statistical statements or data points

FORMATTING RULES:
1. Mark ONLY clear section headers with [HEADER] prefix
2. A well-structured article should have 3-6 section headers (not every paragraph needs one)
3. Add blank lines between sections for readability
4. Keep related sentences together in paragraphs (3-5 sentences per paragraph)

Return the formatted text with [HEADER] markers for section titles only.`
            },
            {
              role: "user",
              content: `Format this article by identifying section headers and adding proper structure. Look for topic transitions and major concept introductions. Mark them with [HEADER]:\n\n${text}`
            }
          ],
          temperature: 0.2,
        }),
      });

      if (response.status === 429) {
        // Rate limited - exponential backoff
        const backoffMs = Math.min(1000 * Math.pow(2, attempt), 10000);
        console.log(`Rate limited, retrying in ${backoffMs}ms (attempt ${attempt + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
        continue;
      }

      if (!response.ok) {
        console.error("AI API error:", response.status, await response.text());
        return fallbackFormatting(text);
      }

      const data = await response.json();
      const formattedText = data.choices?.[0]?.message?.content || text;
    
      // Process the text line by line to properly separate headers from content
      const lines = formattedText.split('\n').map((line: string) => line.trim());
      const result: string[] = [];
      let currentParagraph: string[] = [];
      
      for (const line of lines) {
        if (!line) {
          // Empty line - end current paragraph if any
          if (currentParagraph.length > 0) {
            result.push(`<p>${currentParagraph.join(' ')}</p>`);
            currentParagraph = [];
          }
          continue;
        }
        
        if (line.startsWith('[HEADER]')) {
          // End current paragraph before adding header
          if (currentParagraph.length > 0) {
            result.push(`<p>${currentParagraph.join(' ')}</p>`);
            currentParagraph = [];
          }
          // Extract ONLY the header text (first line after [HEADER])
          const headerText = line.replace('[HEADER]', '').trim();
          if (headerText) {
            result.push(`<h3>${headerText}</h3>`);
          }
        } else {
          // Regular content line - add to current paragraph
          currentParagraph.push(line);
        }
      }
      
      // Add any remaining paragraph
      if (currentParagraph.length > 0) {
        result.push(`<p>${currentParagraph.join(' ')}</p>`);
      }
      
      return result.filter(Boolean).join("\n\n");
    } catch (error) {
      if (attempt === retries - 1) {
        console.error("Error using AI for formatting after retries:", error);
        return fallbackFormatting(text);
      }
      // Retry on error
      const backoffMs = Math.min(1000 * Math.pow(2, attempt), 10000);
      console.log(`Error on attempt ${attempt + 1}, retrying in ${backoffMs}ms`);
      await new Promise(resolve => setTimeout(resolve, backoffMs));
    }
  }
  
  return fallbackFormatting(text);
};

// Tag extraction logic (copied from extract-article-tags)
function extractKeywords(text: string, title: string): string[] {
  const stopWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 
    'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 
    'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 
    'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time',
    'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could',
    'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think',
    'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
    'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is', 'was', 'are', 'been'
  ]);

  const fullText = `${title} ${text}`.toLowerCase();
  const words = fullText
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  const phrases: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    const twoWord = `${words[i]} ${words[i + 1]}`;
    if (!stopWords.has(words[i]) && !stopWords.has(words[i + 1])) {
      phrases.push(twoWord);
    }
    
    if (i < words.length - 2) {
      const threeWord = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      if (!stopWords.has(words[i]) && !stopWords.has(words[i + 1]) && !stopWords.has(words[i + 2])) {
        phrases.push(threeWord);
      }
    }
  }

  const phraseCount = new Map<string, number>();
  phrases.forEach(phrase => {
    phraseCount.set(phrase, (phraseCount.get(phrase) || 0) + 1);
  });

  const topWords = Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word);

  const topPhrases = Array.from(phraseCount.entries())
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([phrase]) => phrase);

  const tags = [...new Set([...topPhrases, ...topWords])].slice(0, 8);
  
  return tags.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1));
}

// Fallback formatting if AI is unavailable
const fallbackFormatting = (text: string): string => {
  const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z])/);
  const paragraphs: string[] = [];
  let currentParagraph: string[] = [];
  
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim();
    if (!sentence) continue;
    
    currentParagraph.push(sentence);
    
    if (currentParagraph.length >= 3 && (i === sentences.length - 1 || Math.random() > 0.5)) {
      paragraphs.push(currentParagraph.join(" "));
      currentParagraph = [];
    }
  }
  
  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph.join(" "));
  }

  return paragraphs
    .filter(Boolean)
    .map((p) => `<p>${p}</p>`)
    .join("\n\n");
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { chunkIndex = 0, chunkSize = 50, verticalSlug = null, jobId = null } = await req.json();

    console.log(`Processing chunk ${chunkIndex} with size ${chunkSize}${verticalSlug ? ` for vertical ${verticalSlug}` : ''}`);

    // Fetch articles in this chunk (excluding those with null content)
    let query = supabase
      .from('articles')
      .select('id, title, content, excerpt, metadata')
      .not('content', 'is', null);
    
    // Filter by vertical if specified
    if (verticalSlug) {
      query = query.eq('vertical_slug', verticalSlug);
    }

    // Only process articles that have not yet been AI-processed
    query = query.or('metadata->>ai_processed.is.null,metadata->>ai_processed.eq.false');
    
    const { data: articles, error: fetchError } = await query
      .range(chunkIndex * chunkSize, (chunkIndex + 1) * chunkSize - 1);

    if (fetchError) {
      throw fetchError;
    }

    if (!articles || articles.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          processed: 0,
          message: 'No more articles to process'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${articles.length} articles to process`);

    // Background processing function with parallel batching
    const processArticles = async () => {
      let processed = 0;
      const failed: string[] = [];
      const PARALLEL_BATCH_SIZE = 3; // Process 3 articles simultaneously to avoid overwhelming API

      // Split articles into batches
      const batches = [];
      for (let i = 0; i < articles.length; i += PARALLEL_BATCH_SIZE) {
        batches.push(articles.slice(i, i + PARALLEL_BATCH_SIZE));
      }

      console.log(`Processing ${articles.length} articles in ${batches.length} parallel batches of ${PARALLEL_BATCH_SIZE}`);

      for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
        const batch = batches[batchIdx];
        console.log(`[Batch ${batchIdx + 1}/${batches.length}] Processing ${batch.length} articles in parallel...`);

        // Process all articles in this batch simultaneously
        const batchResults = await Promise.allSettled(
          batch.map(async (article, idx) => {
            const articleNum = batchIdx * PARALLEL_BATCH_SIZE + idx + 1;
            try {
              console.log(`[${articleNum}/${articles.length}] Formatting article ${article.id}...`);
              const cleanedText = cleanText(article.content);
              const formattedContent = await formatArticleWithAI(cleanedText);

              // Add source attribution at the end
              const contentWithSource = `${formattedContent}\n\n<p class="text-sm text-muted-foreground mt-6 pt-4 border-t border-border">Source: <a href="https://platodata.ai" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Plato Data Intelligence</a></p>`;

              // Update article content and set ai_processed flag
              const currentMetadata = article.metadata || {};
              const { error: updateError } = await supabase
                .from('articles')
                .update({
                  content: contentWithSource,
                  updated_at: new Date().toISOString(),
                  metadata: {
                    ...currentMetadata,
                    ai_processed: true,
                    ai_processed_at: new Date().toISOString()
                  }
                })
                .eq('id', article.id);

              if (updateError) {
                console.error(`Error updating article ${article.id}:`, updateError);
                return { success: false, articleId: article.id };
              }

              console.log(`Successfully formatted article ${article.id}`);

              // Extract and store tags
              try {
                const tags = extractKeywords(article.content || article.excerpt || '', article.title);
                console.log(`Extracted ${tags.length} tags for article ${article.id}`);

                // Delete existing tags first
                await supabase
                  .from('article_tags')
                  .delete()
                  .eq('article_id', article.id);

                // Create or get tags and link to article
                for (const tagName of tags) {
                  const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');

                  const { data: existingTag } = await supabase
                    .from('tags')
                    .select('id')
                    .eq('slug', tagSlug)
                    .maybeSingle();

                  let tagId: string;

                  if (existingTag) {
                    tagId = existingTag.id;
                  } else {
                    const { data: newTag, error: tagError } = await supabase
                      .from('tags')
                      .insert({ name: tagName, slug: tagSlug })
                      .select('id')
                      .single();

                    if (tagError || !newTag) {
                      console.error(`Failed to create tag ${tagName}:`, tagError);
                      continue;
                    }

                    tagId = newTag.id;
                  }

                  await supabase
                    .from('article_tags')
                    .insert({ article_id: article.id, tag_id: tagId });
                }
              } catch (tagError) {
                console.error(`Error extracting tags for article ${article.id}:`, tagError);
              }

              return { success: true, articleId: article.id };
            } catch (err) {
              console.error(`Error processing article ${article.id}:`, err);
              return { success: false, articleId: article.id };
            }
          })
        );

        // Count successes and failures
        batchResults.forEach((result) => {
          if (result.status === 'fulfilled' && result.value.success) {
            processed++;
          } else {
            const articleId = result.status === 'fulfilled' ? result.value.articleId : 'unknown';
            failed.push(articleId);
          }
        });

        console.log(`Batch ${batchIdx + 1} complete: ${processed} total processed, ${failed.length} total failed`);

        // Longer delay between batches to avoid overwhelming the API
        if (batchIdx < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Update job tracking if jobId provided
      if (jobId) {
        const { data: currentJob } = await supabase
          .from('ai_processing_jobs')
          .select('processed_chunks, failed_chunks, total_chunks')
          .eq('id', jobId)
          .single();

        const currentChunks = currentJob?.processed_chunks || [];
        const failedChunks = currentJob?.failed_chunks || [];
        const totalChunks = currentJob?.total_chunks || 0;
        
        // Use Set to prevent duplicates
        const uniqueChunks = new Set([...currentChunks, chunkIndex]);
        const updatedChunks = Array.from(uniqueChunks).sort((a, b) => a - b);
        
        // Track failed chunks if we had failures
        const updatedFailedChunks = failed.length > 0 
          ? Array.from(new Set([...failedChunks, chunkIndex]))
          : failedChunks;

        const { error: jobError } = await supabase
          .from('ai_processing_jobs')
          .update({
            processed_chunks: updatedChunks,
            failed_chunks: updatedFailedChunks,
            updated_at: new Date().toISOString()
          })
          .eq('id', jobId);

        if (jobError) {
          console.error('Error updating job tracking:', jobError);
        } else {
          console.log(`Chunk ${chunkIndex} complete: ${processed}/${articles.length} processed, ${failed.length} failed`);
        }
      }
    };

    // Start background processing using waitUntil if available
    const ctx = Deno.env.get('DENO_REGION') ? (globalThis as any).EdgeRuntime : null;
    if (ctx && ctx.waitUntil) {
      ctx.waitUntil(processArticles());
    } else {
      processArticles().catch(console.error);
    }

    // Return immediately
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Started processing ${articles.length} articles in background`,
        articlesCount: articles.length,
        chunkIndex
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
