-- Add unique constraint to prevent duplicate articles based on vertical_slug and post_id
-- This will prevent the same article (post_id) from being imported multiple times in the same vertical

-- First, let's create a unique index that only applies when post_id is not null
-- This allows articles without post_id to exist (for manually created articles)
CREATE UNIQUE INDEX IF NOT EXISTS articles_vertical_post_unique 
ON public.articles (vertical_slug, post_id) 
WHERE post_id IS NOT NULL;

-- Add a comment to document the constraint
COMMENT ON INDEX articles_vertical_post_unique IS 'Ensures each article (post_id) can only appear once per vertical. Allows null post_id for manually created articles.';