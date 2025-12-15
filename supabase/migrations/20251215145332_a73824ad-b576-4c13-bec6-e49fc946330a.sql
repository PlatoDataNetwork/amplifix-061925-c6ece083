-- Create article_translations table for storing pre-translated article content
CREATE TABLE public.article_translations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  language_code text NOT NULL,
  translated_title text NOT NULL,
  translated_excerpt text,
  translated_content text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(article_id, language_code)
);

-- Create index for fast lookups
CREATE INDEX idx_article_translations_article_lang ON public.article_translations(article_id, language_code);
CREATE INDEX idx_article_translations_language ON public.article_translations(language_code);

-- Enable RLS
ALTER TABLE public.article_translations ENABLE ROW LEVEL SECURITY;

-- Public read access for translations
CREATE POLICY "Article translations are viewable by everyone"
ON public.article_translations
FOR SELECT
USING (true);

-- Admin write access
CREATE POLICY "Admins can insert article translations"
ON public.article_translations
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update article translations"
ON public.article_translations
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete article translations"
ON public.article_translations
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_article_translations_updated_at
BEFORE UPDATE ON public.article_translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();