import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify admin access
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authentication failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: hasAdminRole, error: roleError } = await supabase
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });

    if (roleError || !hasAdminRole) {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🗑️ Starting aviation articles deletion...');

    // Count articles before deletion
    const { count: beforeCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('vertical_slug', 'aviation');

    console.log(`📊 Found ${beforeCount} aviation articles to delete`);

    // Delete all aviation articles
    const { error: deleteError } = await supabase
      .from('articles')
      .delete()
      .eq('vertical_slug', 'aviation');

    if (deleteError) {
      console.error('Error deleting articles:', deleteError);
      throw deleteError;
    }

    console.log('✅ Successfully deleted all aviation articles');

    // Also clear any related AI processing jobs
    const { error: jobsError } = await supabase
      .from('ai_processing_jobs')
      .delete()
      .eq('vertical_slug', 'aviation');

    if (jobsError) {
      console.warn('Warning: Could not clear AI processing jobs:', jobsError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'All aviation articles cleared successfully',
        deletedCount: beforeCount || 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in clear-aviation-articles:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
