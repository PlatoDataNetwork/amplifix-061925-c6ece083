-- Revoke EXECUTE on admin-only SECURITY DEFINER functions from anon and authenticated roles
REVOKE EXECUTE ON FUNCTION public.get_backup_summary() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.assign_random_default_images(integer, integer) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.should_cancel_import(text, timestamp with time zone) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_article_verticals() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_vertical_article_counts() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_user_roles(uuid) FROM anon;

-- Revoke SELECT from anon on admin-only tables to remove them from the public GraphQL schema.
-- RLS already blocks reads but removing the grant prevents schema discovery via GraphQL/PostgREST.
REVOKE SELECT ON TABLE public.article_backups FROM anon;
REVOKE SELECT ON TABLE public.backup_jobs FROM anon;
REVOKE SELECT ON TABLE public.import_history FROM anon;
REVOKE SELECT ON TABLE public.import_logs FROM anon;
REVOKE SELECT ON TABLE public.import_schedules FROM anon;
REVOKE SELECT ON TABLE public.feed_sync_logs FROM anon;
REVOKE SELECT ON TABLE public.rss_feeds FROM anon;
REVOKE SELECT ON TABLE public.ai_processing_jobs FROM anon;
REVOKE SELECT ON TABLE public.ai_credit_usage FROM anon;
REVOKE SELECT ON TABLE public.crm_notes FROM anon;
REVOKE SELECT ON TABLE public.site_settings FROM anon;
REVOKE SELECT ON TABLE public.user_roles FROM anon;
REVOKE SELECT ON TABLE public.newsletter_subscribers FROM anon;
REVOKE SELECT ON TABLE public.user_profiles FROM anon;