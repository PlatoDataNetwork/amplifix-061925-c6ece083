INSERT INTO showcase_companies (
  company_name,
  ticker,
  subtitle,
  description,
  button_text,
  link,
  website,
  search_url,
  tags,
  type,
  main_sector,
  display_order,
  disabled
) VALUES (
  'DJ Central',
  NULL,
  'Listen. Watch. Dance. Enjoy.',
  'Australian Record Label and global Dance, House and Club music TV show, syndicated to over 8 countries. Featuring today''s artists leading the way in Electronic Dance Music (EDM).',
  'View Showcase',
  '/showcase/dj-central',
  'https://djcentral.tv',
  'https://www.bing.com/copilotsearch?q=DJ+Central+TV+EDM',
  ARRAY['EDM', 'TV Network', 'Record Label'],
  'private',
  'Media',
  20,
  false
);