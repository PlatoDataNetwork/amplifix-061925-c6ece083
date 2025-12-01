-- Add FG Nexus Inc. to showcase_companies table
INSERT INTO showcase_companies (
  company_name,
  ticker,
  subtitle,
  description,
  tags,
  type,
  link,
  website,
  stock_url,
  search_url,
  thumbnail,
  main_sector,
  display_order,
  button_text
) VALUES (
  'FG Nexus Inc.',
  'FGNX',
  'The Ethereum Treasury Company',
  'FG Nexus (NASDAQ: FGNX) provides institutional access to Ethereum with staking yield and capital markets execution. Building the leading vehicle for ETH accumulation, on-chain yield generation, and real-world asset tokenization.',
  ARRAY['Blockchain', 'Ethereum', 'Treasury', 'DeFi', 'Staking'],
  'stock',
  '/showcase/fg-nexus',
  'https://fgnexus.io/',
  'https://finance.yahoo.com/quote/FGNX/',
  'https://www.bing.com/search?q=FG+Nexus+FGNX+Ethereum+Treasury',
  '/lovable-uploads/fgnexus-logo.png',
  'BLOCKCHAIN',
  14,
  'View Showcase'
);