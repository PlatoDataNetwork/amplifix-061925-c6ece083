import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const token = authHeader.replace("Bearer ", "");

    // Use anon key + user token for auth / role checks
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser(token);

    if (userError || !user) {
      console.error("Auth error in delete-empty-cannabis-articles:", userError);
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
      console.error("Role check failed in delete-empty-cannabis-articles:", roleError);
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Use service role for deletion
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Starting deletion of empty cannabis articles...");

    // Count empty cannabis articles before deletion
    const { count: beforeCount } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("vertical_slug", "cannabis")
      .or("content.is.null,content.eq.,title.is.null,title.eq.");

    console.log(`Found ${beforeCount} empty cannabis articles to delete`);

    // Delete all cannabis articles with empty content or title
    const { error: deleteError } = await supabase
      .from("articles")
      .delete()
      .eq("vertical_slug", "cannabis")
      .or("content.is.null,content.eq.,title.is.null,title.eq.");

    if (deleteError) {
      console.error("Error deleting empty cannabis articles:", deleteError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to delete empty cannabis articles",
          details: deleteError.message 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Successfully deleted ${beforeCount} empty cannabis articles`);

    return new Response(
      JSON.stringify({
        success: true,
        deletedCount: beforeCount,
        message: `Deleted ${beforeCount} cannabis articles with empty content`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Unexpected error in delete-empty-cannabis-articles:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
