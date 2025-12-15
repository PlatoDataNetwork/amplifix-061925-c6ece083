import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPPORTED_LANGUAGES = [
  'ar', 'bn', 'zh', 'da', 'nl', 'et', 'fi', 'fr', 'de', 'el', 'he', 'hi', 'hu',
  'id', 'it', 'ja', 'km', 'ko', 'no', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sl',
  'es', 'sv', 'th', 'tr', 'uk', 'ur', 'vi'
];

const LANGUAGE_NAMES: Record<string, string> = {
  'ar': 'Arabic', 'bn': 'Bengali', 'zh': 'Chinese', 'da': 'Danish', 'nl': 'Dutch',
  'et': 'Estonian', 'fi': 'Finnish', 'fr': 'French', 'de': 'German', 'el': 'Greek',
  'he': 'Hebrew', 'hi': 'Hindi', 'hu': 'Hungarian', 'id': 'Indonesian', 'it': 'Italian',
  'ja': 'Japanese', 'km': 'Khmer', 'ko': 'Korean', 'no': 'Norwegian', 'fa': 'Persian',
  'pl': 'Polish', 'pt': 'Portuguese', 'pa': 'Punjabi', 'ro': 'Romanian', 'ru': 'Russian',
  'sl': 'Slovenian', 'es': 'Spanish', 'sv': 'Swedish', 'th': 'Thai', 'tr': 'Turkish',
  'uk': 'Ukrainian', 'ur': 'Urdu', 'vi': 'Vietnamese'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { articleId, targetLanguage, batchTranslate } = await req.json();
    
    console.log(`Translation request: articleId=${articleId}, targetLanguage=${targetLanguage}, batch=${batchTranslate}`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the article
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .select('id, title, excerpt, content')
      .eq('id', articleId)
      .single();

    if (articleError || !article) {
      console.error('Article not found:', articleError);
      return new Response(
        JSON.stringify({ error: 'Article not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const languagesToTranslate = batchTranslate ? SUPPORTED_LANGUAGES : [targetLanguage];
    const results: any[] = [];
    const errors: any[] = [];

    for (const langCode of languagesToTranslate) {
      if (!SUPPORTED_LANGUAGES.includes(langCode)) {
        errors.push({ language: langCode, error: 'Unsupported language' });
        continue;
      }

      // Check if translation already exists
      const { data: existing } = await supabase
        .from('article_translations')
        .select('id')
        .eq('article_id', articleId)
        .eq('language_code', langCode)
        .maybeSingle();

      if (existing) {
        console.log(`Translation already exists for ${langCode}, skipping`);
        results.push({ language: langCode, status: 'skipped', reason: 'already exists' });
        continue;
      }

      const languageName = LANGUAGE_NAMES[langCode] || langCode;
      
      // Prepare content for translation (strip HTML for cleaner translation)
      const cleanContent = article.content 
        ? article.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 8000)
        : '';
      
      const prompt = `Translate the following article content from English to ${languageName}. 
Maintain the original meaning, tone, and style. Return ONLY a JSON object with these fields:
- title: translated title
- excerpt: translated excerpt (keep it concise, max 200 characters)
- content: translated content (preserve paragraph breaks with \\n\\n)

Article to translate:
Title: ${article.title}
Excerpt: ${article.excerpt || ''}
Content: ${cleanContent}`;

      try {
        console.log(`Translating to ${languageName}...`);
        
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { 
                role: 'system', 
                content: 'You are a professional translator. Return only valid JSON with title, excerpt, and content fields. Do not include any markdown formatting or code blocks.' 
              },
              { role: 'user', content: prompt }
            ],
          }),
        });

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          console.error(`AI API error for ${langCode}:`, aiResponse.status, errorText);
          
          if (aiResponse.status === 429) {
            errors.push({ language: langCode, error: 'Rate limited, try again later' });
            // Wait before next request
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
          if (aiResponse.status === 402) {
            errors.push({ language: langCode, error: 'AI credits exhausted' });
            break; // Stop batch if out of credits
          }
          
          errors.push({ language: langCode, error: `AI error: ${aiResponse.status}` });
          continue;
        }

        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content;
        
        if (!content) {
          errors.push({ language: langCode, error: 'Empty AI response' });
          continue;
        }

        // Parse JSON response (handle markdown code blocks if present)
        let translation;
        try {
          const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          translation = JSON.parse(cleanedContent);
        } catch (parseError) {
          console.error(`Failed to parse translation for ${langCode}:`, content);
          errors.push({ language: langCode, error: 'Failed to parse translation' });
          continue;
        }

        // Store translation
        const { error: insertError } = await supabase
          .from('article_translations')
          .upsert({
            article_id: articleId,
            language_code: langCode,
            translated_title: translation.title || article.title,
            translated_excerpt: translation.excerpt || article.excerpt,
            translated_content: translation.content || '',
          }, {
            onConflict: 'article_id,language_code'
          });

        if (insertError) {
          console.error(`Failed to store translation for ${langCode}:`, insertError);
          errors.push({ language: langCode, error: 'Failed to store translation' });
          continue;
        }

        console.log(`Successfully translated to ${languageName}`);
        results.push({ language: langCode, status: 'success' });

        // Small delay between translations to avoid rate limiting
        if (batchTranslate) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }

      } catch (translationError) {
        console.error(`Translation error for ${langCode}:`, translationError);
        errors.push({ language: langCode, error: translationError.message });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        results, 
        errors,
        summary: {
          total: languagesToTranslate.length,
          successful: results.filter(r => r.status === 'success').length,
          skipped: results.filter(r => r.status === 'skipped').length,
          failed: errors.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in translate-article:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
