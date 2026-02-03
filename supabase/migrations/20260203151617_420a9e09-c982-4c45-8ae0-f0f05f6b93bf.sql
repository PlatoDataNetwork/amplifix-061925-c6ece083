-- Create enums for feed configuration options
CREATE TYPE public.feed_status AS ENUM ('active', 'paused', 'error');
CREATE TYPE public.feed_import_mode AS ENUM ('full_content', 'excerpt_with_link');
CREATE TYPE public.feed_publish_status AS ENUM ('publish', 'draft');

-- Create RSS feeds table
CREATE TABLE public.rss_feeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    feed_url TEXT NOT NULL,
    vertical_slug TEXT NOT NULL,
    status feed_status NOT NULL DEFAULT 'active',
    import_mode feed_import_mode NOT NULL DEFAULT 'full_content',
    publish_status feed_publish_status NOT NULL DEFAULT 'draft',
    auto_sync BOOLEAN NOT NULL DEFAULT false,
    sync_interval_hours INTEGER NOT NULL DEFAULT 24,
    last_synced_at TIMESTAMP WITH TIME ZONE,
    last_error TEXT,
    default_image_url TEXT,
    check_duplicate_title BOOLEAN NOT NULL DEFAULT true,
    check_duplicate_link BOOLEAN NOT NULL DEFAULT true,
    max_articles_per_sync INTEGER NOT NULL DEFAULT 0,
    strip_images BOOLEAN NOT NULL DEFAULT false,
    strip_inline_styles BOOLEAN NOT NULL DEFAULT true,
    default_author TEXT,
    source_link_text TEXT,
    source_link_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create feed sync logs table
CREATE TABLE public.feed_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feed_id UUID REFERENCES public.rss_feeds(id) ON DELETE CASCADE NOT NULL,
    article_id UUID REFERENCES public.articles(id) ON DELETE SET NULL,
    original_guid TEXT NOT NULL,
    original_title TEXT,
    original_url TEXT,
    status TEXT NOT NULL DEFAULT 'imported',
    error_message TEXT,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.rss_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_sync_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for rss_feeds
CREATE POLICY "Admins can view all feeds"
ON public.rss_feeds FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create feeds"
ON public.rss_feeds FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update feeds"
ON public.rss_feeds FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete feeds"
ON public.rss_feeds FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for feed_sync_logs
CREATE POLICY "Admins can view all sync logs"
ON public.feed_sync_logs FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create sync logs"
ON public.feed_sync_logs FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete sync logs"
ON public.feed_sync_logs FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Service role can insert sync logs (for edge functions)
CREATE POLICY "Service role can insert sync logs"
ON public.feed_sync_logs FOR INSERT
WITH CHECK (true);

-- Service role can update feeds (for edge functions)
CREATE POLICY "Service role can update feeds"
ON public.rss_feeds FOR UPDATE
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_rss_feeds_vertical ON public.rss_feeds(vertical_slug);
CREATE INDEX idx_rss_feeds_status ON public.rss_feeds(status);
CREATE INDEX idx_rss_feeds_auto_sync ON public.rss_feeds(auto_sync) WHERE auto_sync = true;
CREATE INDEX idx_feed_sync_logs_feed_id ON public.feed_sync_logs(feed_id);
CREATE INDEX idx_feed_sync_logs_synced_at ON public.feed_sync_logs(synced_at DESC);
CREATE INDEX idx_feed_sync_logs_original_guid ON public.feed_sync_logs(original_guid);

-- Create trigger for updated_at on rss_feeds
CREATE TRIGGER update_rss_feeds_updated_at
BEFORE UPDATE ON public.rss_feeds
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();