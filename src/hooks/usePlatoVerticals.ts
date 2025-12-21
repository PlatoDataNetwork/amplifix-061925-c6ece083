import { useState, useEffect } from 'react';

export interface Vertical {
  name: string;
  slug: string;
  url: string;
}

export function usePlatoVerticals() {
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verticals from PlatoData JSON API
    const platoVerticals: Vertical[] = [
      { name: 'Aerospace', slug: 'aerospace', url: 'https://platodata.ai/aerospace/json/' },
      { name: 'AI', slug: 'artificial-intelligence', url: 'https://platodata.ai/artificial-intelligence/json/' },
      { name: 'AR/VR', slug: 'ar-vr', url: 'https://platodata.ai/ar-vr/json/' },
      { name: 'Autism', slug: 'autism', url: 'https://platodata.ai/autism/json/' },
      { name: 'Automotive', slug: 'automotive', url: 'https://platodata.ai/automotive/json/' },
      { name: 'Aviation', slug: 'aviation', url: 'https://platodata.ai/aviation/json/' },
      { name: 'Big Data', slug: 'big-data', url: 'https://platodata.ai/big-data/json/' },
      { name: 'Biotech', slug: 'biotech', url: 'https://platodata.ai/biotech/json/' },
      { name: 'Cannabis', slug: 'cannabis', url: 'https://platodata.ai/cannabis/json/' },
      { name: 'Carbon', slug: 'carbon', url: 'https://platodata.ai/carbon/json/' },
      { name: 'Cleantech', slug: 'cleantech', url: 'https://platodata.ai/cleantech/json/' },
      { name: 'Clinical Trials', slug: 'clinical-trials', url: 'https://platodata.ai/clinical-trials/json/' },
      { name: 'Code', slug: 'code', url: 'https://platodata.ai/code/json/' },
      { name: 'Crowdfunding', slug: 'crowdfunding', url: 'https://platodata.ai/crowdfunding/json/' },
      { name: 'Blockchain', slug: 'blockchain', url: 'https://platodata.ai/blockchain/json/' },
      { name: 'Cyber Security', slug: 'cyber-security', url: 'https://platodata.ai/cyber-security/json/' },
      { name: 'Defense', slug: 'defense', url: 'https://platodata.ai/defense/json/' },
      { name: 'Ecommerce', slug: 'ecommerce', url: 'https://platodata.ai/ecommerce/json/' },
      { name: 'EdTech', slug: 'edtech', url: 'https://platodata.ai/edtech/json/' },
      { name: 'Energy', slug: 'energy', url: 'https://platodata.ai/energy/json/' },
      { name: 'ESG', slug: 'esg', url: 'https://platodata.ai/esg/json/' },
      { name: 'Esports', slug: 'esports', url: 'https://platodata.ai/esports/json/' },
      { name: 'Finance', slug: 'finance', url: 'https://platodata.ai/finance/json/' },
      { name: 'FinanceFeeds', slug: 'financefeeds', url: 'https://platodata.ai/financefeeds/json/' },
      { name: 'Fintech', slug: 'fintech', url: 'https://platodata.ai/fintech/json/' },
      { name: 'Forex', slug: 'forex', url: 'https://platodata.ai/forex/json/' },
      { name: 'Gaming', slug: 'gaming', url: 'https://platodata.ai/gaming/json/' },
      { name: 'Hydrogen', slug: 'hydrogen', url: 'https://platodata.ai/hydrogen/json/' },
      { name: 'IOT', slug: 'iot', url: 'https://platodata.ai/iot/json/' },
      { name: 'Medical Devices', slug: 'medical-devices', url: 'https://platodata.ai/medical-devices/json/' },
      { name: 'Music', slug: 'music', url: 'https://platodata.ai/music/json/' },
      { name: 'Nano Technology', slug: 'nano-technology', url: 'https://platodata.ai/nano-technology/json/' },
      { name: 'NFTs', slug: 'nfts', url: 'https://platodata.ai/nfts/json/' },
      { name: 'Patents', slug: 'patents', url: 'https://platodata.ai/patents/json/' },
      { name: 'Payments', slug: 'payments', url: 'https://platodata.ai/payments/json/' },
      { name: 'Private Equity', slug: 'private-equity', url: 'https://platodata.ai/private-equity/json/' },
      { name: 'Psychedelics', slug: 'psychedelics', url: 'https://platodata.ai/psychedelics/json/' },
      { name: 'Quantum', slug: 'quantum', url: 'https://platodata.ai/quantum/json/' },
      { name: 'Real Estate', slug: 'real-estate', url: 'https://platodata.ai/real-estate/json/' },
      { name: 'SaaS', slug: 'saas', url: 'https://platodata.ai/saas/json/' },
      { name: 'Semiconductor', slug: 'semiconductor', url: 'https://platodata.ai/semiconductor/json/' },
      { name: 'SEO', slug: 'seo', url: 'https://platodata.ai/seo/json/' },
      { name: 'Solar', slug: 'solar', url: 'https://platodata.ai/solar/json/' },
      { name: 'SPACS', slug: 'spacs', url: 'https://platodata.ai/spacs/json/' },
      { name: 'Startups', slug: 'startups', url: 'https://platodata.ai/startups/json/' },
      { name: 'Stem Cell', slug: 'stem-cell', url: 'https://platodata.ai/stem-cell/json/' },
      { name: 'Supply Chain', slug: 'supply-chain', url: 'https://platodata.ai/supply-chain/json/' },
      { name: 'Trading', slug: 'trading', url: 'https://platodata.ai/trading/json/' },
      { name: 'Venture Capital', slug: 'venture-capital', url: 'https://platodata.ai/venture-capital/json/' },
      { name: 'Waste Management', slug: 'waste-management', url: 'https://platodata.ai/waste-management/json/' },
    ];
    
    // Sort alphabetically by name
    const sortedVerticals = platoVerticals.sort((a, b) => a.name.localeCompare(b.name));
    setVerticals(sortedVerticals);
    setIsLoading(false);
  }, []);

  return { verticals, isLoading };
}
