import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Extract keywords and phrases from text
function extractKeywords(text: string, title: string): string[] {
  const combined = `${title} ${text}`.toLowerCase();
  
  const stopWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
    'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go',
    'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
    'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them',
    'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over',
    'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work',
    'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
    'give', 'day', 'most', 'us', 'is', 'was', 'are', 'been', 'has', 'had',
    'were', 'said', 'did', 'having', 'may', 'such', 'through', 'between'
  ]);

  // Extract single words
  const words = combined
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(word => 
      word.length > 3 && 
      !stopWords.has(word) &&
      !/^\d+$/.test(word)
    );

  // Extract phrases (2-3 words)
  const phrases: string[] = [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  
  sentences.forEach(sentence => {
    const sentenceWords = sentence.toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);
    
    for (let i = 0; i < sentenceWords.length - 1; i++) {
      const phrase2 = `${sentenceWords[i]} ${sentenceWords[i + 1]}`;
      if (!stopWords.has(sentenceWords[i]) && !stopWords.has(sentenceWords[i + 1])) {
        phrases.push(phrase2);
      }
      
      if (i < sentenceWords.length - 2) {
        const phrase3 = `${sentenceWords[i]} ${sentenceWords[i + 1]} ${sentenceWords[i + 2]}`;
        if (!stopWords.has(sentenceWords[i]) && 
            !stopWords.has(sentenceWords[i + 1]) && 
            !stopWords.has(sentenceWords[i + 2])) {
          phrases.push(phrase3);
        }
      }
    }
  });

  // Count frequency
  const frequency = new Map<string, number>();
  
  words.forEach(word => {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });
  
  phrases.forEach(phrase => {
    frequency.set(phrase, (frequency.get(phrase) || 0) + 2); // Give phrases more weight
  });

  // Get top keywords
  const sorted = Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => {
      // Capitalize first letter of each word
      return word.split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    });

  return sorted;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, title } = await req.json();

    if (!content || !title) {
      throw new Error('Content and title are required');
    }

    console.log(`Testing tag extraction for: ${title}`);

    // Extract tags
    const tags = extractKeywords(content, title);

    return new Response(
      JSON.stringify({ 
        success: true, 
        tags,
        title 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Test tag extraction error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
