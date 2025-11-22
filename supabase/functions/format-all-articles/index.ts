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
    // Remove other HTML and formatting
    .replace(/<a\b[^>]*>/gi, "")
    .replace(/<\/a>/gi, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/Source:?:?\s*/gi, "")
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
const formatArticleWithAI = async (text: string): Promise<string> => {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    console.error("LOVABLE_API_KEY not found, falling back to simple formatting");
    return fallbackFormatting(text);
  }

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
            content: "You are an expert content formatter. Identify section headers - these are short topic titles (3-15 words) that introduce new sections, often at the start of major content blocks. Common patterns: 'The [Topic]', '[Topic]: [Subtitle]', '[Action/Concept] and [Action/Concept]'. Mark ALL section headers by prefixing with [HEADER]. Insert paragraph breaks at semantic boundaries. Return ONLY formatted text with [HEADER] markers."
          },
          {
            role: "user",
            content: `Identify ALL section headers in this article. Section headers are topic titles like "China Experiences Commercial Rocket Failure While Achieving Record-Breaking Annual Launch Count", "A Record-Breaking Year for Chinese Space Launches", "The Commercial Rocket Failure", "Balancing Success and Challenges". Prefix EVERY section header with [HEADER] and add paragraph breaks:\n\n${text}`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error("AI API error:", response.status, await response.text());
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
    console.error("Error using AI for formatting:", error);
    return fallbackFormatting(text);
  }
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

    const { chunkIndex = 0, chunkSize = 10, verticalSlug = null } = await req.json();

    console.log(`Processing chunk ${chunkIndex} with size ${chunkSize}${verticalSlug ? ` for vertical ${verticalSlug}` : ''}`);

    // Fetch articles in this chunk (excluding those with null content)
    let query = supabase
      .from('articles')
      .select('id, title, content, excerpt')
      .not('content', 'is', null);
    
    // Filter by vertical if specified
    if (verticalSlug) {
      query = query.eq('vertical_slug', verticalSlug);
    }
    
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

    // Process articles in smaller batches to avoid rate limits
    const batchSize = 3;
    let processed = 0;
    const errors: string[] = [];

    for (let i = 0; i < articles.length; i += batchSize) {
      const batch = articles.slice(i, i + batchSize);
      
      for (const article of batch) {
        try {
          console.log(`Formatting article ${article.id}...`);
          const cleanedText = cleanText(article.content);
          const formattedContent = await formatArticleWithAI(cleanedText);

          // Update article content
          const { error: updateError } = await supabase
            .from('articles')
            .update({
              content: formattedContent,
              updated_at: new Date().toISOString(),
            })
            .eq('id', article.id);

          if (updateError) {
            console.error(`Error updating article ${article.id}:`, updateError);
            errors.push(`${article.id}: ${updateError.message}`);
          } else {
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
              
              processed++;
            } catch (tagError) {
              console.error(`Error extracting tags for article ${article.id}:`, tagError);
              // Don't fail the whole process if tag extraction fails
            }
          }
        } catch (err) {
          console.error(`Error processing article ${article.id}:`, err);
          errors.push(`${article.id}: ${err.message}`);
        }
      }

      // Small delay between batches to avoid rate limits
      if (i + batchSize < articles.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed,
        total: articles.length,
        errors: errors.length > 0 ? errors : undefined,
        message: `Processed ${processed}/${articles.length} articles with AI-powered formatting and tag extraction`
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
