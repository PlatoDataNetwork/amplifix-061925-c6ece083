import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { corsHeaders } from '../_shared/cors.ts';

const SUPPORTED_LANGUAGES = ['ar', 'bn', 'zh', 'da', 'nl', 'et', 'fi', 'fr', 'de', 'el', 'he', 'hi', 'hu', 'id', 'it', 'ja', 'km', 'ko', 'no', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sl', 'es', 'sv', 'th', 'tr', 'uk', 'ur', 'vi'];

const LANGUAGE_NAMES: Record<string, string> = {
  ar: 'Arabic', bn: 'Bengali', zh: 'Chinese', da: 'Danish', nl: 'Dutch',
  et: 'Estonian', fi: 'Finnish', fr: 'French', de: 'German', el: 'Greek',
  he: 'Hebrew', hi: 'Hindi', hu: 'Hungarian', id: 'Indonesian', it: 'Italian',
  ja: 'Japanese', km: 'Khmer', ko: 'Korean', no: 'Norwegian', fa: 'Persian',
  pl: 'Polish', pt: 'Portuguese', pa: 'Punjabi', ro: 'Romanian', ru: 'Russian',
  sl: 'Slovenian', es: 'Spanish', sv: 'Swedish', th: 'Thai', tr: 'Turkish',
  uk: 'Ukrainian', ur: 'Urdu', vi: 'Vietnamese'
};

async function translateArticle(
  supabase: any,
  article: any,
  targetLanguage: string,
  apiKey: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if translation exists
    const { data: existing } = await supabase
      .from('article_translations')
      .select('id')
      .eq('article_id', article.id)
      .eq('language_code', targetLanguage)
      .single();

    if (existing) {
      return { success: true }; // Already translated
    }

    const cleanContent = (article.content || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .substring(0, 8000);

    const prompt = `Translate the following article to ${LANGUAGE_NAMES[targetLanguage]}. Return ONLY valid JSON with these exact keys: title, excerpt, content. No markdown, no code blocks.

Title: ${article.title}
Excerpt: ${article.excerpt || ''}
Content: ${cleanContent}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a professional translator. Return ONLY valid JSON with keys: title, excerpt, content. No markdown formatting.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      return { success: false, error: `API error: ${response.status}` };
    }

    const data = await response.json();
    let translatedContent = data.choices?.[0]?.message?.content || '';
    
    // Clean up response
    translatedContent = translatedContent
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(translatedContent);

    await supabase.from('article_translations').insert({
      article_id: article.id,
      language_code: targetLanguage,
      translated_title: parsed.title || article.title,
      translated_excerpt: parsed.excerpt || article.excerpt,
      translated_content: parsed.content || '',
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const apiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { languages, limit = 50, offset = 0 } = await req.json();

    const targetLanguages = languages || SUPPORTED_LANGUAGES;

    // Get articles to translate
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, title, excerpt, content')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (articlesError) throw articlesError;

    console.log(`Processing ${articles.length} articles for ${targetLanguages.length} languages`);

    // Process translations in parallel batches
    const CONCURRENCY = 5; // Process 5 translations at a time
    const results = { translated: 0, skipped: 0, errors: 0 };

    for (const lang of targetLanguages) {
      console.log(`Translating to ${LANGUAGE_NAMES[lang]}...`);
      
      // Process articles in batches for this language
      for (let i = 0; i < articles.length; i += CONCURRENCY) {
        const batch = articles.slice(i, i + CONCURRENCY);
        
        const batchResults = await Promise.all(
          batch.map(article => translateArticle(supabase, article, lang, apiKey))
        );

        batchResults.forEach(result => {
          if (result.success) {
            results.translated++;
          } else if (result.error) {
            results.errors++;
            console.error(`Translation error: ${result.error}`);
          }
        });

        // Small delay between batches to avoid rate limits
        await new Promise(r => setTimeout(r, 200));
      }
    }

    console.log(`Batch complete: ${results.translated} translated, ${results.errors} errors`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        articlesProcessed: articles.length,
        languagesProcessed: targetLanguages.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Batch translation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
