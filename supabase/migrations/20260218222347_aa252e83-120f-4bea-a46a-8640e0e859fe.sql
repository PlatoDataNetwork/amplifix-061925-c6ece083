
-- Create a trigger function to auto-assign post_id on article insert
CREATE OR REPLACE FUNCTION public.assign_next_post_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.post_id IS NULL THEN
    SELECT COALESCE(MAX(post_id), 0) + 1 INTO NEW.post_id FROM articles;
  END IF;
  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER trg_assign_post_id
  BEFORE INSERT ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_next_post_id();
