-- Update OpenWorld: remove AmplifiX link (null search_url), change button to View Showcase, link to showcase page
UPDATE public.showcase_companies
SET 
  search_url = NULL,
  button_text = 'View Showcase',
  link = '/showcase/openworld'
WHERE company_name = 'OpenWorld';