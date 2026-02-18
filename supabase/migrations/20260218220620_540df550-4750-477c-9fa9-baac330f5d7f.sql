
CREATE OR REPLACE FUNCTION public.assign_random_default_images(batch_size integer DEFAULT 5000, batch_offset integer DEFAULT 0)
RETURNS TABLE(updated_count bigint, has_more boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_updated bigint;
  v_total bigint;
BEGIN
  -- Update articles in batches with random images from default_featured_images
  WITH image_pool AS (
    SELECT image_url, row_number() OVER () as rn, count(*) OVER () as total_images
    FROM default_featured_images
  ),
  article_batch AS (
    SELECT id
    FROM articles
    ORDER BY published_at DESC
    LIMIT batch_size
    OFFSET batch_offset
  )
  UPDATE articles a
  SET image_url = (
    SELECT image_url 
    FROM image_pool 
    WHERE rn = (floor(random() * (SELECT total_images FROM image_pool LIMIT 1)) + 1)
  )
  FROM article_batch ab
  WHERE a.id = ab.id;

  GET DIAGNOSTICS v_updated = ROW_COUNT;

  -- Check if there are more articles
  SELECT COUNT(*) INTO v_total FROM articles;

  RETURN QUERY SELECT v_updated, (batch_offset + batch_size < v_total);
END;
$$;
