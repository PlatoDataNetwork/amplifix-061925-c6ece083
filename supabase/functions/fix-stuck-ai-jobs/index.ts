import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

async function verifyAdmin(req: Request): Promise<{ authorized: boolean; error?: string }> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return { authorized: false, error: 'Missing authorization header' };
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const token = authHeader.replace('Bearer ', '');
  
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) {
    return { authorized: false, error: 'Invalid or expired token' };
  }

  const { data: roles, error: rolesError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id);

  if (rolesError || !roles?.some(r => r.role === 'admin')) {
    return { authorized: false, error: 'Admin access required' };
  }

  return { authorized: true };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin authorization
    const { authorized, error: authError } = await verifyAdmin(req);
    if (!authorized) {
      console.error('Authorization failed:', authError);
      return new Response(
        JSON.stringify({ success: false, error: authError }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, serviceKey);

    console.log('🔍 Looking for stuck AI processing jobs...');

    // Find jobs that have been "in_progress" for more than 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data: stuckJobs, error: findError } = await supabase
      .from('ai_processing_jobs')
      .select('*')
      .eq('status', 'in_progress')
      .lt('updated_at', fiveMinutesAgo);

    if (findError) {
      console.error('❌ Error finding stuck jobs:', findError);
      throw findError;
    }

    console.log(`📊 Found ${stuckJobs?.length || 0} stuck jobs`);

    const fixedJobs = [];

    if (stuckJobs && stuckJobs.length > 0) {
      for (const job of stuckJobs) {
        console.log(`🔧 Fixing job ${job.id} for vertical ${job.vertical_slug}`);
        
        // Mark job as failed so it can be restarted
        const { error: updateError } = await supabase
          .from('ai_processing_jobs')
          .update({
            status: 'failed',
            completed_at: new Date().toISOString(),
          })
          .eq('id', job.id);

        if (updateError) {
          console.error(`❌ Error updating job ${job.id}:`, updateError);
        } else {
          console.log(`✅ Successfully marked job ${job.id} as failed`);
          fixedJobs.push({
            id: job.id,
            vertical_slug: job.vertical_slug,
            processed_chunks: job.processed_chunks?.length || 0,
            total_chunks: job.total_chunks,
          });
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Fixed ${fixedJobs.length} stuck AI processing jobs`,
        fixedJobs,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Error fixing stuck AI jobs:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
