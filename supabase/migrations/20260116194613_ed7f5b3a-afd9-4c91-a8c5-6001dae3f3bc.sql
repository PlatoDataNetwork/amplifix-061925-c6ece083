-- Add back AmplifiX button for OpenWorld with specific search URL
UPDATE public.showcase_companies
SET search_url = 'https://www.bing.com/copilotsearch?q=OpenWorld+RWA+Tokenization'
WHERE company_name = 'OpenWorld';