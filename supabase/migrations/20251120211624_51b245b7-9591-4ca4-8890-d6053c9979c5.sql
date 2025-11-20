-- Create table to store translations
CREATE TABLE IF NOT EXISTS public.translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language_code TEXT NOT NULL,
  namespace TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(language_code, namespace)
);

-- Enable RLS (but make it public readable)
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read translations
CREATE POLICY "Translations are publicly readable"
  ON public.translations
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert/update translations
CREATE POLICY "Authenticated users can manage translations"
  ON public.translations
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_translations_lang_namespace 
  ON public.translations(language_code, namespace);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_translations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_translations_timestamp
  BEFORE UPDATE ON public.translations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_translations_updated_at();