import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface CompanyUpdate {
  name: string;
  tags: string[];
  type: string;
  subtitle: string;
}

const companyUpdates: CompanyUpdate[] = [
  { name: 'VSee Health', tags: ['Medical Device', 'AI', 'Telehealth'], type: 'stock', subtitle: 'NAS:VSEE' },
  { name: 'FAIM', tags: ['AI', 'Blockchain', 'Token'], type: 'token', subtitle: 'AI Powered Fan Engagement' },
  { name: 'ForexGPT', tags: ['AI', 'Fintech', 'Forex'], type: 'private', subtitle: 'AI Powered Forex Analysis' },
  { name: 'CUT', tags: ['AI', 'Blockchain', 'Carbon', 'Fintech', 'Token'], type: 'token', subtitle: 'RWA / Carbon Tokenization' },
  { name: 'DevvStream Corp', tags: ['AI', 'Blockchain', 'Carbon', 'Fintech', 'Token'], type: 'token', subtitle: 'NAS:DEVS' },
  { name: "Int'l Land Alliance", tags: ['Real Estate'], type: 'stock', subtitle: 'OTCQB:ILAL' },
  { name: 'SILO Pharma Inc.', tags: ['AI', 'Biotech', 'Psychedelics'], type: 'stock', subtitle: 'NAS:SILO' },
  { name: "Synbio Int'l", tags: ['AI', 'Medical Device', 'Facial Analysis'], type: 'stock', subtitle: 'OTC:SYIN' },
  { name: 'Abatis', tags: ['AI', 'Blockchain', 'Cyber', 'Token'], type: 'token', subtitle: 'Defense Grade Cybersecurity' },
  { name: 'FacialDX', tags: ['AI', 'Facial Analysis'], type: 'private', subtitle: 'AI Powered Facial Analysis' },
  { name: 'Naoris Protocol', tags: ['AI', 'Blockchain', 'Cyber', 'Token'], type: 'token', subtitle: 'Quantum Resistant Cybersecurity' },
  { name: 'Karbon-X', tags: ['Carbon'], type: 'stock', subtitle: 'Carbon Credits' },
  { name: 'Micropolis', tags: ['AI', 'Automotive'], type: 'stock', subtitle: 'AI Autonomous Vehicles' },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const results = [];
    
    for (const company of companyUpdates) {
      const { data, error } = await supabase
        .from('showcase_companies')
        .update({
          tags: company.tags,
          type: company.type,
          subtitle: company.subtitle,
        })
        .eq('company_name', company.name)
        .select();

      if (error) {
        console.error(`Error updating ${company.name}:`, error);
        results.push({ company: company.name, success: false, error: error.message });
      } else {
        console.log(`Updated ${company.name}`);
        results.push({ company: company.name, success: true, data });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Updated ${successCount} companies successfully${failCount > 0 ? `, ${failCount} failed` : ''}`,
        results,
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
