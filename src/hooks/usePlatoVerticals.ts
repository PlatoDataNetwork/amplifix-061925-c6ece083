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
    // Hardcoded verticals from platodata.ai in alphabetical order
    const platoVerticals: Vertical[] = [
      { name: 'ACN', slug: 'acn', url: 'https://platodata.ai/acn/' },
      { name: 'Aerospace', slug: 'aerospace', url: 'https://platodata.ai/aerospace/' },
      { name: 'AI', slug: 'artificial-intelligence', url: 'https://platodata.ai/artificial-intelligence/' },
      { name: 'AR/VR', slug: 'ar-vr', url: 'https://platodata.ai/ar-vr/' },
      { name: 'Autism', slug: 'autism', url: 'https://platodata.ai/autism/' },
      { name: 'Automotive', slug: 'automotive', url: 'https://platodata.ai/automotive/' },
      { name: 'Aviation', slug: 'aviation', url: 'https://platodata.ai/aviation/' },
      { name: 'Big Data', slug: 'big-data', url: 'https://platodata.ai/big-data/' },
      { name: 'Biotechnology', slug: 'biotechnology', url: 'https://platodata.ai/biotechnology/' },
      { name: 'Blockchain', slug: 'blockchain', url: 'https://platodata.ai/blockchain/' },
      { name: 'Cannabis', slug: 'cannabis', url: 'https://platodata.ai/cannabis/' },
      { name: 'Carbon', slug: 'carbon', url: 'https://platodata.ai/carbon/' },
      { name: 'Cleantech', slug: 'cleantech', url: 'https://platodata.ai/cleantech/' },
      { name: 'Clinical Trials', slug: 'clinical-trials', url: 'https://platodata.ai/clinical-trials/' },
      { name: 'Code', slug: 'code', url: 'https://platodata.ai/code/' },
      { name: 'Crowdfunding', slug: 'crowdfunding', url: 'https://platodata.ai/crowdfunding/' },
      { name: 'Cyber Security', slug: 'cyber-security', url: 'https://platodata.ai/cyber-security/' },
      { name: 'Defense', slug: 'defense', url: 'https://platodata.ai/defense/' },
      { name: 'Ecommerce', slug: 'ecommerce', url: 'https://platodata.ai/ecommerce/' },
      { name: 'EdTech', slug: 'edtech', url: 'https://platodata.ai/edtech/' },
      { name: 'Energy', slug: 'energy', url: 'https://platodata.ai/energy/' },
      { name: 'ESG', slug: 'esg', url: 'https://platodata.ai/esg' },
      { name: 'Esports', slug: 'esports', url: 'https://platodata.ai/esports/' },
      { name: 'Finance', slug: 'finance', url: 'https://platodata.ai/finance/' },
      { name: 'FinanceFeeds', slug: 'financefeeds', url: 'https://platodata.ai/financefeeds/' },
      { name: 'Fintech', slug: 'fintech', url: 'https://platodata.ai/fintech/' },
      { name: 'Forex', slug: 'forex', url: 'https://platodata.ai/forex/' },
      { name: 'Gambling', slug: 'gambling', url: 'https://platodata.ai/gambling/' },
      { name: 'Gaming', slug: 'gaming', url: 'https://platodata.ai/gaming/' },
      { name: 'Hydrogen', slug: 'hydrogen', url: 'https://platodata.ai/hydrogen/' },
      { name: 'IOT', slug: 'iot', url: 'https://platodata.ai/iot/' },
      { name: 'Medical Devices', slug: 'medical-devices', url: 'https://platodata.ai/medical-devices/' },
      { name: 'Music', slug: 'music', url: 'https://platodata.ai/music/' },
      { name: 'Nano Technology', slug: 'nano-technology', url: 'https://platodata.ai/nano-technology/' },
      { name: 'NFTs', slug: 'nfts', url: 'https://platodata.ai/nfts/' },
      { name: 'Patents', slug: 'patents', url: 'https://platodata.ai/patents/' },
      { name: 'Payments', slug: 'payments', url: 'https://platodata.ai/payments/' },
      { name: 'Plato', slug: 'artificial-intelligence', url: 'https://platodata.ai/artificial-intelligence/' },
      { name: 'Press Releases', slug: 'press-releases', url: 'https://platodata.ai/press-releases/' },
      { name: 'Private Equity', slug: 'private-equity', url: 'https://platodata.ai/private-equity/' },
      { name: 'Psychedelics', slug: 'psychedelics', url: 'https://platodata.ai/psychedelics/' },
      { name: 'Quantum', slug: 'quantum', url: 'https://platodata.ai/quantum/' },
      { name: 'Real Estate', slug: 'real-estate', url: 'https://platodata.ai/real-estate/' },
      { name: 'SaaS', slug: 'saas', url: 'https://platodata.ai/saas/' },
      { name: 'Semiconductor', slug: 'semiconductor', url: 'https://platodata.ai/semiconductor/' },
      { name: 'SEO', slug: 'seo', url: 'https://platodata.ai/seo/' },
      { name: 'Solar', slug: 'solar', url: 'https://platodata.ai/solar/' },
      { name: 'SPACS', slug: 'spacs', url: 'https://platodata.ai/spacs/' },
      { name: 'Startups', slug: 'startups', url: 'https://platodata.ai/startups/' },
      { name: 'Stem Cell', slug: 'stem-cell', url: 'https://platodata.ai/stem-cell/' },
      { name: 'Supply Chain', slug: 'supply-chain-logistics', url: 'https://platodata.ai/supply-chain-logistics/' },
      { name: 'Trading', slug: 'trading', url: 'https://platodata.ai/trading/' },
      { name: 'Venture Capital', slug: 'venture-capital', url: 'https://platodata.ai/venture-capital/' },
      { name: 'Waste Management', slug: 'waste-management', url: 'https://platodata.ai/waste-management/' }
    ];

    setVerticals(platoVerticals);
    setIsLoading(false);
  }, []);

  return { verticals, isLoading };
}
