-- Create article_backups table
CREATE TABLE IF NOT EXISTS public.article_backups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  backup_name TEXT NOT NULL,
  backup_description TEXT,
  article_id UUID NOT NULL,
  post_id BIGINT,
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  author TEXT,
  image_url TEXT,
  vertical_slug TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Create index on backup_name for faster queries
CREATE INDEX IF NOT EXISTS idx_article_backups_backup_name ON public.article_backups(backup_name);

-- Create index on article_id for reference
CREATE INDEX IF NOT EXISTS idx_article_backups_article_id ON public.article_backups(article_id);

-- Enable Row Level Security
ALTER TABLE public.article_backups ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admins only
CREATE POLICY "Admins can view all backups"
  ON public.article_backups
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create backups"
  ON public.article_backups
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete backups"
  ON public.article_backups
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add comment
COMMENT ON TABLE public.article_backups IS 'Stores article backups for restore functionality';