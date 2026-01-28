-- Insert Bioxytran into showcase_companies
INSERT INTO public.showcase_companies (
  company_name,
  subtitle,
  description,
  tags,
  type,
  link,
  website,
  search_url,
  main_sector,
  button_text,
  disabled
) VALUES (
  'Bioxytran',
  'OTCMKTS:BIXT',
  'Clinical stage pharmaceutical company developing platform technologies in Glycovirology, Hypoxia and Degenerative Diseases to eliminate viruses and prolong lifespan using carbohydrate drug design.',
  ARRAY['Biotech', 'Pharma', 'Glycovirology'],
  'stock',
  '/showcase/bioxytran',
  'https://www.bioxytraninc.com/',
  'https://www.bing.com/copilotsearch?q=BIOXYTRAN+BIXT=DAVID+PRATT+PHD',
  'BIOTECH',
  'View Showcase',
  false
);