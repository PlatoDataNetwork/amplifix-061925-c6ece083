import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, verticalSlug } = await req.json();
    console.log("Received chat request for vertical:", verticalSlug);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get context from recent articles in this vertical
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: articles, error: articlesError } = await supabase
      .from("articles")
      .select("title, excerpt, content")
      .eq("vertical_slug", verticalSlug)
      .order("published_at", { ascending: false })
      .limit(10);

    if (articlesError) {
      console.error("Error fetching articles:", articlesError);
    }

    // Build context from articles
    const contextText = articles
      ?.map((a) => `Title: ${a.title}\nSummary: ${a.excerpt || ""}`)
      .join("\n\n") || "";

    const systemPrompt = `You are an intelligent AI assistant specialized in ${verticalSlug.replace(/-/g, " ")} intelligence and news analysis.

Your role is to:
- Provide insightful, accurate answers about ${verticalSlug.replace(/-/g, " ")} topics
- Reference recent developments and trends when relevant
- Offer analysis and context to help users understand complex topics
- Be concise but thorough, using 2-3 paragraphs for most answers

RECENT CONTEXT from latest articles:
${contextText}

Keep responses focused, professional, and informative. If asked about topics outside ${verticalSlug.replace(/-/g, " ")}, politely redirect to the vertical's scope.`;

    console.log("Calling Lovable AI with streaming...");
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), 
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service quota exceeded. Please contact support." }), 
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    console.log("Streaming response from AI...");
    
    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (e) {
    console.error("Error in vertical-ai-chat:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
