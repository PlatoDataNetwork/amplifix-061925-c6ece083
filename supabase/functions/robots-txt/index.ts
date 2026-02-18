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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    // Try to get from site_settings first
    const { data: settings } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "robotsTxt")
      .maybeSingle();

    const robotsTxt = settings?.value || `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /management/
Disallow: /login
Disallow: /signup

Sitemap: https://amplifix.net/sitemaps/index.xml`;

    return new Response(robotsTxt, {
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
    });
  } catch (error) {
    return new Response(`User-agent: *\nAllow: /`, {
      headers: { ...corsHeaders, "Content-Type": "text/plain" },
    });
  }
});
