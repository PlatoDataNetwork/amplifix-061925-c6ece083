-- Create article_backups table to store snapshots of articles before bulk operations
CREATE TABLE IF NOT EXISTS public.article_backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_name TEXT NOT NULL,
  backup_description TEXT,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  post_id BIGINT,
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  author TEXT,
  image_url TEXT,
  vertical_slug TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Add index for faster lookups
CREATE INDEX idx_article_backups_backup_name ON public.article_backups(backup_name);
CREATE INDEX idx_article_backups_article_id ON public.article_backups(article_id);
CREATE INDEX idx_article_backups_created_at ON public.article_backups(created_at DESC);

-- Enable RLS
ALTER TABLE public.article_backups ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view all backups"
  ON public.article_backups
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create backups"
  ON public.article_backups
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete backups"
  ON public.article_backups
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add comment
COMMENT ON TABLE public.article_backups IS 'Stores snapshots of articles before bulk operations for recovery purposes';