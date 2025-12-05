import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

async function verifyAdmin(req: Request): Promise<{ authorized: boolean; error?: string }> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return { authorized: false, error: 'Missing authorization header' };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin authorization
    const { authorized, error: authError } = await verifyAdmin(req);
    if (!authorized) {
      console.error('Authorization failed:', authError);
      return new Response(
        JSON.stringify({ error: authError }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check if Blockwell already exists
    const { data: existingCompany } = await supabase
      .from('showcase_companies')
      .select('id')
      .eq('company_name', 'Blockwell')
      .single();

    if (existingCompany) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Blockwell already exists in the database',
          data: existingCompany,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Insert Blockwell
    const { data, error } = await supabase
      .from('showcase_companies')
      .insert({
        company_name: 'Blockwell',
        subtitle: 'AI Blockchain Solutions',
        description: 'Blockwell is a pioneering blockchain technology company specializing in AI-powered cybersecurity solutions and decentralized systems.',
        tags: ['AI', 'Blockchain', 'Cybersecurity'],
        type: 'private',
        link: '/showcase/blockwell',
        website: 'https://Blockwell.ai',
        search_url: 'https://www.bing.com/copilotsearch?q=Blockwell%20Blockchain%20Crypto&FORM=CSSCOP',
        thumbnail: '/lovable-uploads/blockwell-thumbnail.png',
        main_sector: 'BLOCKCHAIN',
        display_order: 13,
        button_text: 'View Showcase',
      })
      .select();

    if (error) {
      console.error('Error inserting Blockwell:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Successfully added Blockwell:', data);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Blockwell added successfully!',
        data,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
