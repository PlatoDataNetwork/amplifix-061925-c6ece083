-- Enable realtime updates for articles table
ALTER TABLE public.articles REPLICA IDENTITY FULL;

-- Add articles table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;