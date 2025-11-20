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

  const startTime = Date.now();

  try {
    const { englishContent, targetLanguage, fileName } = await req.json();
    
    console.log(`[${targetLanguage}/${fileName}] Request received`);
    
    if (!englishContent || !targetLanguage || !fileName) {
      console.error('Missing parameters:', { englishContent: !!englishContent, targetLanguage, fileName });
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Translation service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const languageName = languageNames[targetLanguage] || targetLanguage;
    
    console.log(`[${targetLanguage}/${fileName}] Starting translation to ${languageName}`);

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

    console.log(`[${targetLanguage}/${fileName}] Calling AI gateway...`);
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
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
            { role: 'system', content: systemPrompt },
            { role: 'user', content: JSON.stringify(englishContent, null, 2) }
          ],
          temperature: 0.3, // Lower temperature for more consistent translations
          max_tokens: 4096, // Ensure complete responses for large translations
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      console.log(`[${targetLanguage}/${fileName}] AI gateway responded with status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[${targetLanguage}/${fileName}] AI Gateway error: ${response.status} - ${errorText}`);
        
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Rate limit exceeded. Please wait and try again.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: 'Payment required. Please add credits to your Lovable AI workspace.' }),
            { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify({ error: `Translation API error: ${response.status}`, details: errorText }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`[${targetLanguage}/${fileName}] Parsing AI response...`);
      
      let data;
      try {
        const responseText = await response.text();
        console.log(`[${targetLanguage}/${fileName}] Response text length: ${responseText.length}`);
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error(`[${targetLanguage}/${fileName}] Failed to parse AI gateway response:`, jsonError);
        return new Response(
          JSON.stringify({ 
            error: 'AI gateway returned invalid JSON', 
            details: jsonError instanceof Error ? jsonError.message : 'Parse error'
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const translatedText = data.choices?.[0]?.message?.content;
      const finishReason = data.choices?.[0]?.finish_reason;
      
      // Check if response was truncated
      if (finishReason === 'length') {
        console.error(`[${targetLanguage}/${fileName}] Response was truncated due to token limit`);
        return new Response(
          JSON.stringify({ 
            error: 'Translation response was truncated',
            details: 'The response exceeded token limits. Try translating smaller sections.',
            retry: true
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (!translatedText) {
        console.error(`[${targetLanguage}/${fileName}] No content in AI response:`, data);
        return new Response(
          JSON.stringify({ error: 'No translation content received from AI' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
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
        console.error(`[${targetLanguage}/${fileName}] JSON parse error:`, parseError);
        console.error(`[${targetLanguage}/${fileName}] Raw response (first 1000 chars):`, cleanedText.substring(0, 1000));
        console.error(`[${targetLanguage}/${fileName}] Response length:`, cleanedText.length);
        console.error(`[${targetLanguage}/${fileName}] Finish reason:`, finishReason);
        
        // Check if response looks truncated (doesn't end with proper JSON closing)
        const trimmed = cleanedText.trim();
        const looksTruncated = !trimmed.endsWith('}') && !trimmed.endsWith(']');

        // If it doesn't look truncated, try a JSON repair pass via Lovable AI
        if (!looksTruncated) {
          console.log(`[${targetLanguage}/${fileName}] Attempting JSON repair via Lovable AI...`);
          try {
            const repairResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
                    content: `You are a strict JSON repair assistant. Your job is to fix ONLY JSON syntax issues (missing commas, brackets, quotes) in the user's message while preserving all keys and all text EXACTLY as-is.\n\nRules:\n- Do NOT change any translated text content.\n- Do NOT translate or rephrase anything.\n- Only fix JSON syntax so it becomes valid JSON.\n- Return ONLY valid JSON, no explanations or markdown.`,
                  },
                  {
                    role: 'user',
                    content: cleanedText,
                  },
                ],
                temperature: 0,
                max_tokens: 4096,
              }),
            });

            if (repairResponse.ok) {
              const repairText = await repairResponse.text();
              let repairData: any;
              try {
                repairData = JSON.parse(repairText);
              } catch (repairParseError) {
                console.error(`[${targetLanguage}/${fileName}] Failed to parse JSON repair response:`, repairParseError);
              }

              const repairedRaw = repairData?.choices?.[0]?.message?.content?.trim();
              if (repairedRaw) {
                let repairedText = repairedRaw;
                if (repairedText.startsWith('```json')) repairedText = repairedText.slice(7);
                if (repairedText.startsWith('```')) repairedText = repairedText.slice(3);
                if (repairedText.endsWith('```')) repairedText = repairedText.slice(0, -3);
                repairedText = repairedText.trim();

                try {
                  translatedContent = JSON.parse(repairedText);
                  console.log(`[${targetLanguage}/${fileName}] ✓ JSON repair succeeded`);
                } catch (finalParseError) {
                  console.error(`[${targetLanguage}/${fileName}] JSON repair parse failed:`, finalParseError);
                }
              }
            } else {
              const repairErrorText = await repairResponse.text();
              console.error(`[${targetLanguage}/${fileName}] JSON repair API error: ${repairResponse.status} - ${repairErrorText}`);
            }
          } catch (repairError) {
            console.error(`[${targetLanguage}/${fileName}] JSON repair request failed:`, repairError);
          }
        }

        // If we still don't have valid JSON, return an error
        if (!translatedContent) {
          return new Response(
            JSON.stringify({ 
              error: 'Invalid JSON returned from translation', 
              details: parseError instanceof Error ? parseError.message : 'Parse error',
              preview: cleanedText.substring(0, 300),
              truncated: looksTruncated,
              retry: true
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      const duration = Date.now() - startTime;
      console.log(`[${targetLanguage}/${fileName}] ✓ Translation completed in ${duration}ms`);
      
      return new Response(
        JSON.stringify({ translatedContent, language: targetLanguage, duration }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error(`[${targetLanguage}/${fileName}] Request timeout after 30s`);
        return new Response(
          JSON.stringify({ error: 'Translation request timed out. Please try again.' }),
          { status: 504, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw fetchError;
    }

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`Translation error after ${duration}ms:`, error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : typeof error,
        duration
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
