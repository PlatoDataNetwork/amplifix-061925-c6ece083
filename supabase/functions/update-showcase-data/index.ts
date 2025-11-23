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
  { name: 'FAIM', tags: ['AI', 'Blockchain', 'Token'], type: 'private', subtitle: 'AI Powered Fan Engagement', main_sector: 'WEB3' },
  { name: 'ForexGPT', tags: ['AI', 'Fintech', 'Forex'], type: 'private', subtitle: 'AI Powered Forex Analysis', main_sector: 'AI' },
  { name: 'CUT', tags: ['AI', 'Blockchain', 'Carbon', 'Fintech', 'Token'], type: 'private', subtitle: 'RWA / Carbon Tokenization', main_sector: 'CARBON' },
  { name: 'DevvStream Corp', tags: ['AI', 'Blockchain', 'Carbon', 'Fintech', 'Token'], type: 'token', subtitle: 'NAS:DEVS', main_sector: 'CARBON' },
  { name: "Int'l Land Alliance", tags: ['Real Estate'], type: 'stock', subtitle: 'OTCQB:ILAL', main_sector: 'REAL ESTATE' },
  { name: 'SILO Pharma Inc.', tags: ['AI', 'Biotech', 'Psychedelics'], type: 'stock', subtitle: 'NAS:SILO', main_sector: 'PSYCHEDELICS' },
  { name: "Synbio Int'l", tags: ['AI', 'Medical Device', 'Facial Analysis'], type: 'stock', subtitle: 'OTC:SYIN', main_sector: 'AI, FACIAL ANALYSIS' },
  { name: 'Abatis', tags: ['AI', 'Blockchain', 'Cyber', 'Token'], type: 'private', subtitle: 'Defense Grade Cybersecurity', main_sector: 'CYBERSECURITY' },
  { name: 'FacialDX', tags: ['AI', 'Facial Analysis'], type: 'private', subtitle: 'AI Powered Facial Analysis', main_sector: 'AI, FACIAL ANALYSIS' },
  { name: 'Naoris Protocol', tags: ['AI', 'Blockchain', 'Cyber', 'Token'], type: 'private', subtitle: 'Quantum Resistant Cybersecurity', main_sector: 'CYBERSECURITY' },
  { name: 'Karbon-X', tags: ['Carbon'], type: 'stock', subtitle: 'Carbon Credits', main_sector: 'CARBON' },
  { name: 'Micropolis', tags: ['AI', 'Automotive', 'Robotics'], type: 'stock', subtitle: 'AI Autonomous Vehicles', main_sector: 'ROBOTICS' },
  { name: 'Blockwell', tags: ['AI', 'Blockchain', 'Cyber'], type: 'private', subtitle: 'AI-Powered Blockchain Security', main_sector: 'CYBERSECURITY' },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const results = [];
    
    for (const company of companyUpdates) {
      // Check if company exists
      const { data: existing } = await supabase
        .from('showcase_companies')
        .select('id')
        .eq('company_name', company.name)
        .single();

      if (existing) {
        // Update existing company
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
      } else if (company.name === 'Blockwell') {
        // Insert Blockwell if it doesn't exist
        const { data, error } = await supabase
          .from('showcase_companies')
          .insert({
            company_name: company.name,
            description: 'Pioneering blockchain technology company specializing in AI-powered cybersecurity solutions and decentralized systems for the next generation of digital infrastructure.',
            tags: company.tags,
            type: company.type,
            subtitle: company.subtitle,
            main_sector: company.main_sector,
            link: '/showcase/blockwell',
            website: 'https://blockwell.ai',
            search_url: 'https://www.bing.com/copilotsearch?q=Blockwell%20Blockchain%20Crypto&FORM=CSSCOP',
            thumbnail: '/lovable-uploads/blockwell-thumbnail.png',
            button_text: 'View Showcase',
            disabled: false,
          })
          .select();

        if (error) {
          console.error(`Error inserting ${company.name}:`, error);
          results.push({ company: company.name, success: false, error: error.message });
        } else {
          console.log(`Inserted ${company.name}`);
          results.push({ company: company.name, success: true, data });
        }
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
