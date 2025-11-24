-- Create storage bucket for showcase videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'showcase-videos',
  'showcase-videos',
  true,
  209715200,  -- 200MB limit
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
);

-- Create RLS policies for showcase-videos bucket
CREATE POLICY "Public can view showcase videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'showcase-videos');

CREATE POLICY "Admins can upload showcase videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'showcase-videos' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update showcase videos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'showcase-videos' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete showcase videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'showcase-videos' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Add video_url column to showcase_companies
ALTER TABLE showcase_companies 
ADD COLUMN video_url text;