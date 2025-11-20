import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RecentArticle {
  id: string;
  title: string;
  post_id: number | null;
  vertical_slug: string;
  published_at: string;
}

export function useRecentArticles(limit: number = 20) {
  const [articles, setArticles] = useState<RecentArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("articles")
          .select("id, title, post_id, vertical_slug, published_at")
          .not("content", "is", null)
          .order("published_at", { ascending: false })
          .limit(limit);

        if (fetchError) throw fetchError;

        setArticles(data || []);
      } catch (err) {
        console.error("Error fetching recent articles:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [limit]);

  return { articles, isLoading, error };
}
