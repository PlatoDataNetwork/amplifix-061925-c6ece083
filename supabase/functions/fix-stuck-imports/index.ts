import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: { persistSession: false },
        global: { headers: { Authorization: authHeader } },
      }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: hasAdminRole, error: roleError } = await supabaseAuth
      .rpc('has_role', { _user_id: user.id, _role: 'admin' });

    if (roleError || !hasAdminRole) {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Find stuck imports (in_progress for more than 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data: stuckImports, error: fetchError } = await supabaseClient
      .from('import_history')
      .select('*')
      .eq('status', 'in_progress')
      .eq('vertical_slug', 'aerospace')
      .lt('started_at', fiveMinutesAgo);

    if (fetchError) throw fetchError;

    if (!stuckImports || stuckImports.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No stuck imports found',
          fixed: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${stuckImports.length} stuck imports`);

    const fixed = [];

    for (const imp of stuckImports) {
      const metadata = (imp.metadata || {}) as any;
      const lastPage = metadata.currentPage || metadata.lastProcessedPage || 1;
      const nextPage = lastPage + 1;

      const { error: updateError } = await supabaseClient
        .from('import_history')
        .update({
          status: 'partial',
          completed_at: null,
          metadata: {
            ...metadata,
            lastProcessedPage: lastPage,
            nextPage: nextPage,
            resumable: true,
            note: `Auto-fixed: Resume from page ${nextPage}`
          }
        })
        .eq('id', imp.id);
      
      console.log(`Update result for ${imp.id}:`, updateError ? 'ERROR' : 'SUCCESS', updateError);

      if (!updateError) {
        fixed.push({
          id: imp.id,
          lastPage,
          nextPage,
          vertical: imp.vertical_slug
        });
        console.log(`Fixed import ${imp.id}: will resume from page ${nextPage}`);
      } else {
        console.error(`Failed to fix import ${imp.id}:`, updateError);
      }
    }

    // Trigger auto-resume immediately
    if (fixed.length > 0) {
      console.log('Triggering auto-resume...');
      fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/auto-resume-imports`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          'Content-Type': 'application/json'
        }
      }).catch(err => console.error('Failed to trigger auto-resume:', err));
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Fixed ${fixed.length} stuck imports`,
        fixed: fixed
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
