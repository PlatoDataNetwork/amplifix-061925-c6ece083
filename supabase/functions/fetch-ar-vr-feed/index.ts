import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let page = 1;

    try {
      const body = await req.json();
      if (body && typeof body.page === "number" && body.page > 0) {
        page = body.page;
      }
    } catch {
      // No body is fine, default page is 1
    }

    const url = `https://platodata.ai/ar-vr/json/?page=${encodeURIComponent(
      String(page),
    )}`;

    console.log("Fetching ar-vr feed", { url });

    const upstreamResponse = await fetch(url);

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text().catch(() => "");
      console.error("Upstream ar-vr feed error", {
        status: upstreamResponse.status,
        errorText,
      });

      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to fetch ar-vr feed",
          status: upstreamResponse.status,
        }),
        {
          status: 502,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const data = await upstreamResponse.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("fetch-ar-vr-feed unexpected error", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || "Unknown error while fetching ar-vr feed",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
});
