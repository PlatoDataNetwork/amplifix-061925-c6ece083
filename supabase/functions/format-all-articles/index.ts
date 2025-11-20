import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { corsHeaders } from '../_shared/cors.ts';

// Clean text by removing unwanted HTML and formatting
const cleanText = (text?: string | null): string => {
  if (!text) return "";
  
  return text
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
            content: "You are an expert content formatter. Your task is to analyze text and identify section headers and paragraphs. Section headers are typically short phrases (3-10 words) that introduce new topics or sections. Mark section headers by prefixing them with '[HEADER]'. Insert paragraph breaks (double newlines) at semantic boundaries. Return ONLY the formatted text with [HEADER] markers and paragraph breaks. Do not add commentary."
          },
          {
            role: "user",
            content: `Analyze this article and identify section headers (short topic titles like "Applications Across Industries" or "2023: A Breakthrough Year"). Prefix section headers with [HEADER] and add paragraph breaks at topic boundaries. Keep original text:\n\n${text}`
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
        return `<h2>${headerText}</h2>`;
      }
      return `<p>${block}</p>`;
    }).join("\n\n");
  } catch (error) {
    console.error("Error using AI for formatting:", error);
    return fallbackFormatting(text);
  }
};

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

    const { chunkIndex = 0, chunkSize = 100 } = await req.json();

    console.log(`Processing chunk ${chunkIndex} with size ${chunkSize}`);

    // Fetch articles in this chunk (excluding those with null content)
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('id, content')
      .not('content', 'is', null)
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
    const batchSize = 5;
    let processed = 0;
    const errors: string[] = [];

    for (let i = 0; i < articles.length; i += batchSize) {
      const batch = articles.slice(i, i + batchSize);
      
      for (const article of batch) {
        try {
          console.log(`Formatting article ${article.id}...`);
          const cleanedText = cleanText(article.content);
          const formattedContent = await formatArticleWithAI(cleanedText);

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
            processed++;
            console.log(`Successfully formatted article ${article.id}`);
          }
        } catch (err) {
          console.error(`Error processing article ${article.id}:`, err);
          errors.push(`${article.id}: ${err.message}`);
        }
      }

      // Small delay between batches to avoid rate limits
      if (i + batchSize < articles.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed,
        total: articles.length,
        errors: errors.length > 0 ? errors : undefined,
        message: `Processed ${processed}/${articles.length} articles with AI-powered formatting`
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
