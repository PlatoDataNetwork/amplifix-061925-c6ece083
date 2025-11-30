// Feed Health Check - Pings all vertical source feeds to check availability
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerticalFeedConfig {
  slug: string;
  name: string;
  feedUrl: string;
}

// Define all vertical feed URLs
const VERTICAL_FEEDS: VerticalFeedConfig[] = [
  { slug: "aerospace", name: "Aerospace", feedUrl: "https://platodata.ai/aerospace/json/" },
  { slug: "ar-vr", name: "AR/VR", feedUrl: "https://platodata.ai/ar-vr/json/" },
  { slug: "artificial-intelligence", name: "AI", feedUrl: "https://platodata.ai/artificial-intelligence/json/" },
  { slug: "autism", name: "Autism", feedUrl: "https://platodata.ai/autism/json/" },
  { slug: "aviation", name: "Aviation", feedUrl: "https://platodata.ai/aviation/json/" },
  { slug: "biotech", name: "Biotech", feedUrl: "https://platodata.ai/biotech/json/" },
  { slug: "blockchain", name: "Blockchain", feedUrl: "https://platodata.ai/blockchain/json/" },
  { slug: "cannabis", name: "Cannabis", feedUrl: "https://platodata.ai/cannabis/json/" },
  { slug: "cleantech", name: "Cleantech", feedUrl: "https://platodata.ai/cleantech/json/" },
  { slug: "cyber-security", name: "Cyber Security", feedUrl: "https://platodata.ai/cyber-security/json/" },
  { slug: "fintech", name: "Fintech", feedUrl: "https://platodata.ai/fintech/json/" },
  { slug: "gaming", name: "Gaming", feedUrl: "https://platodata.ai/gaming/json/" },
  { slug: "quantum", name: "Quantum", feedUrl: "https://platodata.ai/quantum/json/" },
];

interface FeedHealthResult {
  slug: string;
  name: string;
  feedUrl: string;
  status: "online" | "offline" | "error";
  responseTime: number | null;
  httpStatus: number | null;
  error?: string;
  timestamp: string;
}

async function checkFeedHealth(feed: VerticalFeedConfig): Promise<FeedHealthResult> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  try {
    console.log(`Checking ${feed.name} feed at ${feed.feedUrl}?page=1`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const response = await fetch(`${feed.feedUrl}?page=1`, {
      method: "HEAD", // Use HEAD to minimize data transfer
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    const status = response.ok ? "online" : "offline";
    
    return {
      slug: feed.slug,
      name: feed.name,
      feedUrl: feed.feedUrl,
      status,
      responseTime,
      httpStatus: response.status,
      timestamp,
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    console.error(`Error checking ${feed.name}:`, error.message);
    
    return {
      slug: feed.slug,
      name: feed.name,
      feedUrl: feed.feedUrl,
      status: "error",
      responseTime: responseTime > 10000 ? null : responseTime,
      httpStatus: null,
      error: error.name === "AbortError" ? "Timeout after 10s" : error.message,
      timestamp,
    };
  }
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { data: hasAdminRole, error: roleError } = await supabaseAuth.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (roleError || !hasAdminRole) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("Starting feed health checks for all verticals...");
    const startTime = Date.now();
    
    // Check all feeds in parallel
    const results = await Promise.all(
      VERTICAL_FEEDS.map(feed => checkFeedHealth(feed))
    );
    
    const totalTime = Date.now() - startTime;
    const onlineCount = results.filter(r => r.status === "online").length;
    const offlineCount = results.filter(r => r.status === "offline").length;
    const errorCount = results.filter(r => r.status === "error").length;
    
    console.log(
      `Health check complete in ${totalTime}ms: ${onlineCount} online, ${offlineCount} offline, ${errorCount} errors`
    );
    
    return new Response(
      JSON.stringify({
        summary: {
          total: results.length,
          online: onlineCount,
          offline: offlineCount,
          error: errorCount,
          checkDuration: totalTime,
        },
        feeds: results,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in feed health check:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to check feed health",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
