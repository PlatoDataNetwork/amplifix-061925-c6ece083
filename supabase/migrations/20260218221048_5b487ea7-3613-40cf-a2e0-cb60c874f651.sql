
CREATE OR REPLACE FUNCTION public.assign_random_default_images(batch_size integer DEFAULT 5000, batch_offset integer DEFAULT 0)
 RETURNS TABLE(updated_count bigint, has_more boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_updated bigint;
  v_total bigint;
  v_image_count bigint;
BEGIN
  -- Get total image count
  SELECT COUNT(*) INTO v_image_count FROM default_featured_images;
  
  IF v_image_count = 0 THEN
    RETURN QUERY SELECT 0::bigint, false;
    RETURN;
  END IF;

  -- Update articles in batches with random images
  WITH image_pool AS (
    SELECT image_url, row_number() OVER () as rn
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
    SELECT ip.image_url 
    FROM image_pool ip
    WHERE ip.rn = (floor(random() * v_image_count) + 1)
  )
  FROM article_batch ab
  WHERE a.id = ab.id;

  GET DIAGNOSTICS v_updated = ROW_COUNT;

  SELECT COUNT(*) INTO v_total FROM articles;

  RETURN QUERY SELECT v_updated, (batch_offset + batch_size < v_total);
END;
$function$;
