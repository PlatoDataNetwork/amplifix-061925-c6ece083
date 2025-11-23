import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface CompanyUpdate {
  name: string;
  tags: string[];
  type: string;
  subtitle: string;
  main_sector: string;
}

const companyUpdates: CompanyUpdate[] = [
  { name: 'VSee Health', tags: ['Medical Device', 'AI', 'Telehealth'], type: 'stock', subtitle: 'NAS:VSEE', main_sector: 'Telehealth' },
  { name: 'FAIM', tags: ['AI', 'Blockchain', 'Token'], type: 'token', subtitle: 'AI Powered Fan Engagement', main_sector: 'WEB3' },
  { name: 'ForexGPT', tags: ['AI', 'Fintech', 'Forex'], type: 'private', subtitle: 'AI Powered Forex Analysis', main_sector: 'AI' },
  { name: 'CUT', tags: ['AI', 'Blockchain', 'Carbon', 'Fintech', 'Token'], type: 'token', subtitle: 'RWA / Carbon Tokenization', main_sector: 'CARBON' },
  { name: 'DevvStream Corp', tags: ['AI', 'Blockchain', 'Carbon', 'Fintech', 'Token'], type: 'token', subtitle: 'NAS:DEVS', main_sector: 'CARBON' },
  { name: "Int'l Land Alliance", tags: ['Real Estate'], type: 'stock', subtitle: 'OTCQB:ILAL', main_sector: 'REAL ESTATE' },
  { name: 'SILO Pharma Inc.', tags: ['AI', 'Biotech', 'Psychedelics'], type: 'stock', subtitle: 'NAS:SILO', main_sector: 'PSYCHEDELICS' },
  { name: "Synbio Int'l", tags: ['AI', 'Medical Device', 'Facial Analysis'], type: 'stock', subtitle: 'OTC:SYIN', main_sector: 'AI, FACIAL ANALYSIS' },
  { name: 'Abatis', tags: ['AI', 'Blockchain', 'Cyber', 'Token'], type: 'token', subtitle: 'Defense Grade Cybersecurity', main_sector: 'CYBERSECURITY' },
  { name: 'FacialDX', tags: ['AI', 'Facial Analysis'], type: 'private', subtitle: 'AI Powered Facial Analysis', main_sector: 'AI, FACIAL ANALYSIS' },
  { name: 'Naoris Protocol', tags: ['AI', 'Blockchain', 'Cyber', 'Token'], type: 'token', subtitle: 'Quantum Resistant Cybersecurity', main_sector: 'CYBERSECURITY' },
  { name: 'Karbon-X', tags: ['Carbon'], type: 'stock', subtitle: 'Carbon Credits', main_sector: 'CARBON' },
  { name: 'Micropolis', tags: ['AI', 'Automotive', 'Robotics'], type: 'stock', subtitle: 'AI Autonomous Vehicles', main_sector: 'ROBOTICS' },
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
          main_sector: company.main_sector,
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
