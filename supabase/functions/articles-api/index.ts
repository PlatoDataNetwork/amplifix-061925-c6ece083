import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const vertical = url.searchParams.get("vertical");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const search = url.searchParams.get("search");
    const id = url.searchParams.get("id");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    // Single article by ID
    if (id) {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Search
    if (search) {
      const { data, error } = await supabase.rpc("search_articles", {
        search_query: search,
        vertical_filter: vertical || null,
        limit_count: limit,
        offset_count: offset,
      });
      if (error) throw error;
      return new Response(JSON.stringify({ articles: data, count: data?.length || 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // List articles
    let query = supabase
      .from("articles")
      .select("id, title, excerpt, author, published_at, image_url, vertical_slug, external_url, read_time, category", { count: "exact" })
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (vertical) {
      query = query.eq("vertical_slug", vertical);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return new Response(
      JSON.stringify({ articles: data, total: count, limit, offset }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
