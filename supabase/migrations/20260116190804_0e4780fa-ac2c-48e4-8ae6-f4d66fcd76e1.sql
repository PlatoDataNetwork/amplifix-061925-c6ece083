INSERT INTO public.showcase_companies (
  company_name,
  description,
  link,
  website,
  type,
  tags,
  ticker,
  subtitle,
  main_sector,
  button_text,
  display_order,
  disabled
) VALUES (
  'OpenWorld',
  'Leading RWA tokenization platform transforming real-world assets into digital securities. Enabling fractional ownership and global liquidity for traditionally illiquid assets.',
  'https://www.bing.com/copilotsearch?q=OPenworld+RWA+Tokenization',
  'https://openworld.dev',
  'private',
  ARRAY['RWA', 'Tokenization', 'Digital Securities', 'Blockchain', 'DeFi'],
  NULL,
  'Real World Asset Tokenization Platform',
  'RWA Tokenization',
  'Learn More',
  100,
  false
);