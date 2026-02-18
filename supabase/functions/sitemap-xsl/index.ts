const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const xsl = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>AmplifiX Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #333; max-width: 75rem; margin: 0 auto; padding: 2rem; }
          h1 { color: #1a1a1a; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          th { text-align: left; padding: 0.75rem; background: #f7f7f7; border-bottom: 2px solid #e2e8f0; font-size: 0.875rem; }
          td { padding: 0.75rem; border-bottom: 1px solid #e2e8f0; font-size: 0.875rem; }
          tr:hover td { background: #f7fafc; }
          a { color: #2563eb; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .count { color: #64748b; font-size: 0.875rem; margin-top: 0.5rem; }
        </style>
      </head>
      <body>
        <h1>AmplifiX XML Sitemap</h1>
        <xsl:choose>
          <xsl:when test="sitemap:sitemapindex">
            <p class="count">This sitemap index contains <xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/> sitemaps.</p>
            <table>
              <tr><th>Sitemap</th><th>Last Modified</th></tr>
              <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                <tr>
                  <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                  <td><xsl:value-of select="sitemap:lastmod"/></td>
                </tr>
              </xsl:for-each>
            </table>
          </xsl:when>
          <xsl:otherwise>
            <p class="count">This sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs.</p>
            <table>
              <tr><th>URL</th><th>Last Modified</th><th>Priority</th></tr>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                  <td><xsl:value-of select="sitemap:lastmod"/></td>
                  <td><xsl:value-of select="sitemap:priority"/></td>
                </tr>
              </xsl:for-each>
            </table>
          </xsl:otherwise>
        </xsl:choose>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

  return new Response(xsl, {
    headers: { ...corsHeaders, "Content-Type": "application/xslt+xml; charset=utf-8" },
  });
});
