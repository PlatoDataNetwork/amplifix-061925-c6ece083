import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.190.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GoogleCredentials {
  client_email: string;
  private_key: string;
  project_id: string;
}

// Create JWT for Google OAuth2
async function createJWT(credentials: GoogleCredentials): Promise<string> {
  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: credentials.client_email,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = base64Encode(JSON.stringify(header))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  
  const encodedPayload = base64Encode(JSON.stringify(payload))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  // Import private key
  const privateKey = credentials.private_key.replace(/\\n/g, "\n");
  const keyData = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(privateKey),
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  // Sign the JWT
  const signatureBuffer = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    keyData,
    new TextEncoder().encode(signatureInput)
  );

  const signature = base64Encode(new Uint8Array(signatureBuffer))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${signatureInput}.${signature}`;
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const pemContents = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  
  const binaryString = atob(pemContents);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

async function getAccessToken(credentials: GoogleCredentials): Promise<string> {
  const jwt = await createJWT(credentials);

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to get access token:", errorText);
    throw new Error(`Failed to get access token: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function fetchGA4Data(
  accessToken: string,
  propertyId: string,
  startDate: string,
  endDate: string
) {
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "averageSessionDuration" },
          { name: "bounceRate" },
          { name: "newUsers" },
        ],
        dimensions: [{ name: "date" }],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to fetch GA4 data:", errorText);
    throw new Error(`Failed to fetch GA4 data: ${response.status}`);
  }

  return response.json();
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const credentialsJson = Deno.env.get("GOOGLE_ANALYTICS_CREDENTIALS");
    
    if (!credentialsJson) {
      console.error("GOOGLE_ANALYTICS_CREDENTIALS not found");
      return new Response(
        JSON.stringify({ 
          error: "Google Analytics credentials not configured. Please add GOOGLE_ANALYTICS_CREDENTIALS secret." 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const credentials: GoogleCredentials = JSON.parse(credentialsJson);

    // Get request parameters
    const { propertyId = "properties/464543802", startDate = "30daysAgo", endDate = "today" } = 
      await req.json().catch(() => ({}));

    console.log("Fetching analytics data", { propertyId, startDate, endDate });

    // Get access token
    const accessToken = await getAccessToken(credentials);

    // Fetch GA4 data
    const analyticsData = await fetchGA4Data(
      accessToken,
      propertyId,
      startDate,
      endDate
    );

    // Transform the data for easier consumption
    const transformedData = {
      rows: analyticsData.rows?.map((row: any) => ({
        date: row.dimensionValues[0].value,
        activeUsers: parseInt(row.metricValues[0].value),
        sessions: parseInt(row.metricValues[1].value),
        pageViews: parseInt(row.metricValues[2].value),
        avgSessionDuration: parseFloat(row.metricValues[3].value),
        bounceRate: parseFloat(row.metricValues[4].value),
        newUsers: parseInt(row.metricValues[5].value),
      })) || [],
      totals: analyticsData.totals?.[0] ? {
        activeUsers: parseInt(analyticsData.totals[0].metricValues[0].value),
        sessions: parseInt(analyticsData.totals[0].metricValues[1].value),
        pageViews: parseInt(analyticsData.totals[0].metricValues[2].value),
        avgSessionDuration: parseFloat(analyticsData.totals[0].metricValues[3].value),
        bounceRate: parseFloat(analyticsData.totals[0].metricValues[4].value),
        newUsers: parseInt(analyticsData.totals[0].metricValues[5].value),
      } : null,
    };

    console.log("Successfully fetched analytics data", { 
      rowCount: transformedData.rows.length 
    });

    return new Response(
      JSON.stringify(transformedData),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in fetch-analytics function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to fetch analytics data",
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
