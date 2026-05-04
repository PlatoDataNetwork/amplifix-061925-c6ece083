import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PROPERTY_ID = "504421609";

// Base64url encode
function base64url(input: string): string {
  return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Import RSA key from PEM
async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const pemContents = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

// Create signed JWT for Google API
async function createSignedJWT(credentials: { client_email: string; private_key: string }): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify({
    iss: credentials.client_email,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));

  const signingInput = `${header}.${payload}`;
  const key = await importPrivateKey(credentials.private_key);
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signingInput)
  );

  const sig = base64url(String.fromCharCode(...new Uint8Array(signature)));
  return `${signingInput}.${sig}`;
}

// Get access token from Google
async function getAccessToken(credentials: { client_email: string; private_key: string }): Promise<string> {
  const jwt = await createSignedJWT(credentials);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Token exchange failed: ${errText}`);
  }

  const data = await res.json();
  return data.access_token;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const credentialsJson = Deno.env.get("GOOGLE_ANALYTICS_CREDENTIALS");
    if (!credentialsJson) {
      return new Response(JSON.stringify({ error: "GA credentials not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate JWT and require admin role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const serviceClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: isAdmin } = await serviceClient.rpc("has_role", {
      _user_id: claimsData.claims.sub,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse query parameters from URL (GET request)
    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "realtime";
    const dimension = url.searchParams.get("dimension");
    const startDate = url.searchParams.get("startDate") || "7daysAgo";
    const endDate = url.searchParams.get("endDate") || "today";
    const metrics = url.searchParams.get("metrics") || "sessions,totalUsers";

    const credentials = JSON.parse(credentialsJson);
    const accessToken = await getAccessToken(credentials);

    let gaResponse: Response;

    if (type === "realtime") {
      // GA4 Realtime API
      gaResponse = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runRealtimeReport`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            metrics: [
              { name: "activeUsers" },
              { name: "screenPageViews" },
              { name: "conversions" },
              { name: "eventCount" },
            ],
          }),
        }
      );
    } else if (type === "realtime-overview") {
      // GA4 Realtime with dimension breakdown
      const dims = dimension ? [{ name: dimension }] : [];
      gaResponse = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runRealtimeReport`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dimensions: dims,
            metrics: [{ name: "activeUsers" }],
          }),
        }
      );
    } else if (type === "historical") {
      // GA4 Data API - runReport
      const metricNames = metrics.split(",").map((m: string) => ({ name: m.trim() }));
      const dims = dimension ? [{ name: dimension }] : [];
      gaResponse = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dateRanges: [{ startDate, endDate }],
            dimensions: dims,
            metrics: metricNames,
            limit: 100,
            orderBys: dimension === "date" 
              ? [{ dimension: { dimensionName: "date" }, desc: false }]
              : [{ metric: { metricName: metricNames[0]?.name || "sessions" }, desc: true }],
          }),
        }
      );
    } else {
      return new Response(JSON.stringify({ error: `Unknown type: ${type}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!gaResponse.ok) {
      const errText = await gaResponse.text();
      console.error("GA API error:", errText);
      return new Response(JSON.stringify({ error: `GA API error: ${gaResponse.status}`, details: errText }), {
        status: gaResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const gaData = await gaResponse.json();
    return new Response(JSON.stringify(gaData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
