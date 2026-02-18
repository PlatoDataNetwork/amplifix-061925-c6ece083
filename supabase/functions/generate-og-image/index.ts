const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, subtitle } = await req.json();

    if (!title) {
      return new Response(JSON.stringify({ error: "Title is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate a simple SVG-based OG image
    const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <rect x="40" y="40" width="4" height="550" fill="#3b82f6" rx="2" />
  <text x="80" y="280" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white">
    ${escapeXml(title.substring(0, 50))}
  </text>
  ${title.length > 50 ? `<text x="80" y="340" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white">${escapeXml(title.substring(50, 100))}</text>` : ""}
  ${subtitle ? `<text x="80" y="${title.length > 50 ? 400 : 340}" font-family="Arial, sans-serif" font-size="24" fill="#94a3b8">${escapeXml(subtitle.substring(0, 80))}</text>` : ""}
  <text x="80" y="570" font-family="Arial, sans-serif" font-size="20" fill="#3b82f6" font-weight="bold">AmplifiX</text>
  <text x="210" y="570" font-family="Arial, sans-serif" font-size="18" fill="#64748b">Intelligence Platform</text>
</svg>`;

    // Return SVG as the image (can be converted to PNG with a service)
    return new Response(svg, {
      headers: { ...corsHeaders, "Content-Type": "image/svg+xml" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
