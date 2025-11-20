import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const languageNames: Record<string, string> = {
  ar: 'Arabic', bn: 'Bengali', zh: 'Chinese', da: 'Danish', nl: 'Dutch',
  et: 'Estonian', fi: 'Finnish', fr: 'French', de: 'German', el: 'Greek',
  he: 'Hebrew', hi: 'Hindi', hu: 'Hungarian', id: 'Indonesian', it: 'Italian',
  ja: 'Japanese', km: 'Khmer', ko: 'Korean', no: 'Norwegian', fa: 'Persian',
  pl: 'Polish', pt: 'Portuguese', pa: 'Punjabi', ro: 'Romanian', ru: 'Russian',
  sl: 'Slovenian', es: 'Spanish', sv: 'Swedish', th: 'Thai', tr: 'Turkish',
  uk: 'Ukrainian', ur: 'Urdu', vi: 'Vietnamese'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { englishContent, targetLanguage, fileName } = await req.json();
    
    if (!englishContent || !targetLanguage || !fileName) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const languageName = languageNames[targetLanguage] || targetLanguage;
    
    console.log(`Translating ${fileName} to ${languageName} (${targetLanguage})`);

    const systemPrompt = `You are a professional translator. Translate the following JSON content from English to ${languageName}.

CRITICAL RULES:
1. Preserve the EXACT JSON structure - all keys must remain in English
2. Only translate the string VALUES, never the keys
3. Keep all special characters like →, emojis, and HTML entities
4. Maintain {{variable}} placeholders exactly as they are
5. Keep technical terms like "AmplifiX", "AI", "IPO", "SEC", "CRM" untranslated
6. Preserve all punctuation and formatting
7. Return ONLY valid JSON, no markdown code blocks or explanations
8. Ensure natural, culturally appropriate translations for ${languageName}

Example:
Input: {"title": "Hello {{name}}", "button": "Learn more →"}
Output: {"title": "Bonjour {{name}}", "button": "En savoir plus →"}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(englishContent, null, 2) }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI Gateway error: ${response.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ error: `Translation API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const translatedText = data.choices[0].message.content;
    
    // Clean up markdown code blocks if present
    let cleanedText = translatedText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.slice(7);
    }
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    // Validate it's valid JSON
    let translatedContent;
    try {
      translatedContent = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error(`JSON parse error for ${targetLanguage}:`, parseError);
      console.error('Raw response:', cleanedText);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON returned from translation', raw: cleanedText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully translated ${fileName} to ${languageName}`);
    
    return new Response(
      JSON.stringify({ translatedContent, language: targetLanguage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
