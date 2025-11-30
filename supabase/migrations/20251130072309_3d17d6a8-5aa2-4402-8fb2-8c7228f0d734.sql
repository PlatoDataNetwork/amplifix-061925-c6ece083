-- Add index to speed up operations on article_backups by backup_name
CREATE INDEX IF NOT EXISTS idx_article_backups_backup_name
ON public.article_backups (backup_name);
