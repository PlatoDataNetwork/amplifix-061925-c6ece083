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
      { name: 'Aerospace', slug: 'aerospace', url: 'https://dashboard.platodata.io/json/aerospace.json' },
      { name: 'AI', slug: 'artificial-intelligence', url: 'https://dashboard.platodata.io/json/artificial-intelligence.json' },
      { name: 'AR/VR', slug: 'ar-vr', url: 'https://dashboard.platodata.io/json/ar-vr.json' },
      { name: 'Autism', slug: 'autism', url: 'https://dashboard.platodata.io/json/autism.json' },
      { name: 'Automotive', slug: 'automotive', url: 'https://dashboard.platodata.io/json/automotive.json' },
      { name: 'Aviation', slug: 'aviation', url: 'https://dashboard.platodata.io/json/aviation.json' },
      { name: 'Big Data', slug: 'big-data', url: 'https://dashboard.platodata.io/json/big-data.json' },
      { name: 'Biotech', slug: 'biotech', url: 'https://dashboard.platodata.io/json/biotech.json' },
      { name: 'Cannabis', slug: 'cannabis', url: 'https://dashboard.platodata.io/json/cannabis.json' },
      { name: 'Carbon', slug: 'carbon', url: 'https://dashboard.platodata.io/json/carbon.json' },
      { name: 'Cleantech', slug: 'cleantech', url: 'https://dashboard.platodata.io/json/cleantech.json' },
      { name: 'Clinical Trials', slug: 'clinical-trials', url: 'https://dashboard.platodata.io/json/clinical-trials.json' },
      { name: 'Code', slug: 'code', url: 'https://dashboard.platodata.io/json/code.json' },
      { name: 'Crowdfunding', slug: 'crowdfunding', url: 'https://dashboard.platodata.io/json/crowdfunding.json' },
      { name: 'Blockchain', slug: 'blockchain', url: 'https://dashboard.platodata.io/json/blockchain.json' },
      { name: 'Cyber Security', slug: 'cyber-security', url: 'https://dashboard.platodata.io/json/cyber-security.json' },
      { name: 'Defense', slug: 'defense', url: 'https://dashboard.platodata.io/json/defense.json' },
      { name: 'Ecommerce', slug: 'ecommerce', url: 'https://dashboard.platodata.io/json/ecommerce.json' },
      { name: 'EdTech', slug: 'edtech', url: 'https://dashboard.platodata.io/json/edtech.json' },
      { name: 'Energy', slug: 'energy', url: 'https://dashboard.platodata.io/json/energy.json' },
      { name: 'ESG', slug: 'esg', url: 'https://dashboard.platodata.io/json/esg.json' },
      { name: 'Esports', slug: 'esports', url: 'https://dashboard.platodata.io/json/esports.json' },
      { name: 'Finance', slug: 'finance', url: 'https://dashboard.platodata.io/json/finance.json' },
      { name: 'FinanceFeeds', slug: 'financefeeds', url: 'https://dashboard.platodata.io/json/financefeeds.json' },
      { name: 'Fintech', slug: 'fintech', url: 'https://dashboard.platodata.io/json/fintech.json' },
      { name: 'Forex', slug: 'forex', url: 'https://dashboard.platodata.io/json/forex.json' },
      { name: 'Gaming', slug: 'gaming', url: 'https://dashboard.platodata.io/json/gaming.json' },
      { name: 'Hydrogen', slug: 'hydrogen', url: 'https://dashboard.platodata.io/json/hydrogen.json' },
      { name: 'IOT', slug: 'iot', url: 'https://dashboard.platodata.io/json/iot.json' },
      { name: 'Medical Devices', slug: 'medical-devices', url: 'https://dashboard.platodata.io/json/medical-devices.json' },
      { name: 'Music', slug: 'music', url: 'https://dashboard.platodata.io/json/music.json' },
      { name: 'Nano Technology', slug: 'nano-technology', url: 'https://dashboard.platodata.io/json/nano-technology.json' },
      { name: 'NFTs', slug: 'nfts', url: 'https://dashboard.platodata.io/json/nfts.json' },
      { name: 'Patents', slug: 'patents', url: 'https://dashboard.platodata.io/json/patents.json' },
      { name: 'Payments', slug: 'payments', url: 'https://dashboard.platodata.io/json/payments.json' },
      { name: 'Private Equity', slug: 'private-equity', url: 'https://dashboard.platodata.io/json/private-equity.json' },
      { name: 'Psychedelics', slug: 'psychedelics', url: 'https://dashboard.platodata.io/json/psychedelics.json' },
      { name: 'Quantum', slug: 'quantum', url: 'https://dashboard.platodata.io/json/quantum.json' },
      { name: 'Real Estate', slug: 'real-estate', url: 'https://dashboard.platodata.io/json/real-estate.json' },
      { name: 'SaaS', slug: 'saas', url: 'https://dashboard.platodata.io/json/saas.json' },
      { name: 'Semiconductor', slug: 'semiconductor', url: 'https://dashboard.platodata.io/json/semiconductor.json' },
      { name: 'SEO', slug: 'seo', url: 'https://dashboard.platodata.io/json/seo.json' },
      { name: 'Solar', slug: 'solar', url: 'https://dashboard.platodata.io/json/solar.json' },
      { name: 'SPACS', slug: 'spacs', url: 'https://dashboard.platodata.io/json/spacs.json' },
      { name: 'Startups', slug: 'startups', url: 'https://dashboard.platodata.io/json/startups.json' },
      { name: 'Stem Cell', slug: 'stem-cell', url: 'https://dashboard.platodata.io/json/stem-cell.json' },
      { name: 'Supply Chain', slug: 'supply-chain', url: 'https://dashboard.platodata.io/json/supply-chain.json' },
      { name: 'Trading', slug: 'trading', url: 'https://dashboard.platodata.io/json/trading.json' },
      { name: 'Venture Capital', slug: 'venture-capital', url: 'https://dashboard.platodata.io/json/venture-capital.json' },
      { name: 'Waste Management', slug: 'waste-management', url: 'https://dashboard.platodata.io/json/waste-management.json' },
    ];
    
    setVerticals(platoVerticals);
    setIsLoading(false);
  }, []);

  return { verticals, isLoading };
}
