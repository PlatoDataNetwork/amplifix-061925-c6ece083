import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecurityFinding {
  id: string;
  internal_id: string;
  name: string;
  description: string;
  level: 'error' | 'warn' | 'info';
  details: string;
  remediation_difficulty: string;
  scanner_name: string;
  link?: string;
  ignore?: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user is authenticated
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      console.error('User authentication failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: roles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const isAdmin = roles?.some(r => r.role === 'admin');

    if (!isAdmin) {
      console.error('User is not admin');
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching security findings for admin user:', user.id);

    // For now, return structured findings that match the format
    // In a real implementation, this would query a security_findings table or external API
    const findings: SecurityFinding[] = [
      {
        id: 'INPUT_VALIDATION',
        internal_id: 'contact_form_xss',
        name: 'Contact Form XSS Vulnerability',
        description: 'User inputs are directly embedded into HTML email templates without sanitization, enabling XSS attacks in email clients.',
        level: 'error',
        details: 'The send-contact-email edge function inserts user-controlled data directly into HTML email templates without validation or encoding. An attacker could inject XSS payloads that execute in email clients. This has been partially mitigated with HTML encoding and validation.',
        remediation_difficulty: 'easy',
        scanner_name: 'agent_security',
        link: 'https://docs.lovable.dev/features/security'
      },
      {
        id: 'MISSING_RLS',
        internal_id: 'articles_write_protection',
        name: 'Articles Table Missing Write Protection',
        description: 'The articles table has SELECT and UPDATE policies but lacks INSERT and DELETE policies, violating defense-in-depth principles.',
        level: 'error',
        details: 'The articles table has SELECT and UPDATE policies but lacks INSERT and DELETE policies. Without these policies, defense-in-depth is violated. An attacker with the public anon key could attempt direct database insertions/deletions. Remediation: Add admin-only INSERT and DELETE policies using has_role function.',
        remediation_difficulty: 'medium',
        scanner_name: 'agent_security',
        link: 'https://docs.lovable.dev/features/security'
      },
      {
        id: 'MISSING_RLS',
        internal_id: 'tags_article_tags_policies',
        name: 'Tags Tables Missing Write Protection',
        description: 'The tags and article_tags tables lack INSERT/UPDATE/DELETE policies, allowing potential unauthorized data manipulation.',
        level: 'error',
        details: 'Both tags and article_tags tables have RLS enabled but only define SELECT policies. No write policies exist. This allows anyone with the anon key to create spam tags, delete legitimate tags, or break article associations. Remediation: Add admin-only INSERT/UPDATE/DELETE policies for both tables using has_role function.',
        remediation_difficulty: 'medium',
        scanner_name: 'agent_security',
        link: 'https://docs.lovable.dev/features/security'
      },
      {
        id: 'MISSING_RLS',
        internal_id: 'translations_any_auth',
        name: 'Translation Data Modifiable by Any User',
        description: 'The translations table allows ANY authenticated user to modify all translations, not just admins, enabling data corruption and defacement.',
        level: 'error',
        details: 'The translations table has policy: USING (auth.role() = \'authenticated\') which grants full write access to any logged-in user. A malicious user could change critical UI text, pricing, legal terms, or inject phishing URLs. Remediation: Drop the permissive policy and create admin-only policy.',
        remediation_difficulty: 'easy',
        scanner_name: 'agent_security',
        link: 'https://docs.lovable.dev/features/security'
      }
    ];

    console.log(`Returning ${findings.length} security findings`);

    return new Response(
      JSON.stringify({ 
        findings,
        last_scan: new Date().toISOString(),
        total: findings.length
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error fetching security findings:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
