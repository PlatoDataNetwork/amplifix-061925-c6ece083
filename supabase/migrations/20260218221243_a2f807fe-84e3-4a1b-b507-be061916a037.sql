
CREATE OR REPLACE FUNCTION public.assign_random_default_images(batch_size integer DEFAULT 500, batch_offset integer DEFAULT 0)
 RETURNS TABLE(updated_count bigint, has_more boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_updated bigint;
  v_total bigint;
  v_image_count bigint;
  v_image_urls text[];
BEGIN
  -- Get images into an array for fast random access
  SELECT array_agg(image_url) INTO v_image_urls FROM default_featured_images;
  v_image_count := coalesce(array_length(v_image_urls, 1), 0);
  
  IF v_image_count = 0 THEN
    RETURN QUERY SELECT 0::bigint, false;
    RETURN;
  END IF;

  -- Update articles in batches using array indexing
  UPDATE articles a
  SET image_url = v_image_urls[1 + floor(random() * v_image_count)::int]
  FROM (
    SELECT id
    FROM articles
    ORDER BY published_at DESC
    LIMIT batch_size
    OFFSET batch_offset
  ) ab
  WHERE a.id = ab.id;

  GET DIAGNOSTICS v_updated = ROW_COUNT;

  SELECT COUNT(*) INTO v_total FROM articles;

  RETURN QUERY SELECT v_updated, (batch_offset + batch_size < v_total);
END;
$function$;
