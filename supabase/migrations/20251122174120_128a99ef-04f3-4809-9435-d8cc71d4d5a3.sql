-- Add admin role for amjad@platodata.io and fahad@platodata.io
INSERT INTO public.user_roles (user_id, role) 
VALUES 
  ('a70d1394-de8b-4c2f-8a8a-d75128c42596', 'admin'),
  ('ea826684-f2ec-49d2-bc06-847e987be0e6', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;