import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Clean text from HTML and formatting artifacts
function cleanText(text?: string | null): string {
  if (!text) return '';
  
  let cleaned = text
    .replace(/<[^>]*>/g, ' ')
    .replace(/\[caption[^\]]*\]/gi, '')
    .replace(/\[\/caption\]/gi, '')
    .replace(/\[.*?\]/g, '')
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ');
  
  // Decode numeric HTML entities (&#160;, &#8220;, &#8217;, etc.)
  cleaned = cleaned
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
  
  return cleaned
    .replace(/\s+/g, ' ')
    .trim();
}

// Format article content using AI
async function formatArticleWithAI(text: string): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  
  if (!LOVABLE_API_KEY) {
    console.log('LOVABLE_API_KEY not found, using fallback formatting');
    return fallbackFormatting(text);
  }

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a content formatter. Identify section headers and add [HEADER] prefix to them. Add [BREAK] between major topic changes. Return formatted text only.'
          },
          {
            role: 'user',
            content: `Format this article by identifying headers and breaks:\n\n${text.substring(0, 4000)}`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error('AI API error:', response.status);
      return fallbackFormatting(text);
    }

    const data = await response.json();
    const formatted = data.choices[0].message.content;

    // Convert markers to HTML
    return formatted
      .split('\n')
      .map((line: string) => {
        if (line.startsWith('[HEADER]')) {
          return `<h3>${line.replace('[HEADER]', '').trim()}</h3>`;
        } else if (line.startsWith('[BREAK]')) {
          return '<p></p>';
        } else if (line.trim()) {
          return `<p>${line.trim()}</p>`;
        }
        return '';
      })
      .join('\n');
  } catch (error) {
    console.error('AI formatting error:', error);
    return fallbackFormatting(text);
  }
}

// Fallback formatting without AI
function fallbackFormatting(text: string): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const paragraphs: string[] = [];
  let current = '';
  
  sentences.forEach((sentence, i) => {
    current += sentence + ' ';
    if ((i + 1) % 3 === 0 || Math.random() > 0.7) {
      paragraphs.push(`<p>${current.trim()}</p>`);
      current = '';
    }
  });
  
  if (current.trim()) {
    paragraphs.push(`<p>${current.trim()}</p>`);
  }
  
  return paragraphs.join('\n');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, title } = await req.json();

    if (!content) {
      throw new Error('Content is required');
    }

    console.log(`Testing format for: ${title || 'Untitled'}`);

    // Clean and format the content
    const cleaned = cleanText(content);
    const formatted = await formatArticleWithAI(cleaned);

    return new Response(
      JSON.stringify({ 
        success: true, 
        formatted,
        title 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Test format error:', error);
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
