-- Fix function search path for the update_translations_updated_at function
DROP FUNCTION IF EXISTS public.update_translations_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_translations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SET search_path = public;

-- Recreate the trigger
CREATE TRIGGER update_translations_timestamp
  BEFORE UPDATE ON public.translations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_translations_updated_at();