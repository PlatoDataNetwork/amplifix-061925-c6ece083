import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ArticleStats {
  totalArticles: number;
  formattedArticles: number;
  backupCount: number;
  formattingSuccessRate: number;
  articlesWithContent: number;
  articlesWithoutContent: number;
}

export function useArticleStats() {
  const [stats, setStats] = useState<ArticleStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get total articles count
        const { count: totalArticles, error: totalError } = await supabase
          .from("articles")
          .select("*", { count: "exact", head: true });

        if (totalError) throw totalError;

        // Get formatted articles count (articles with <p> tags in content)
        const { data: articles, error: articlesError } = await supabase
          .from("articles")
          .select("content")
          .not("content", "is", null);

        if (articlesError) throw articlesError;

        const formattedArticles = articles?.filter(
          (article) => article.content?.includes("<p>")
        ).length || 0;

        // Get articles with content count
        const articlesWithContent = articles?.length || 0;

        // Get backup count
        const { count: backupCount, error: backupError } = await supabase
          .from("article_backups")
          .select("*", { count: "exact", head: true });

        if (backupError) throw backupError;

        // Calculate success rate
        const formattingSuccessRate = totalArticles
          ? Math.round((formattedArticles / totalArticles) * 100)
          : 0;

        setStats({
          totalArticles: totalArticles || 0,
          formattedArticles,
          backupCount: backupCount || 0,
          formattingSuccessRate,
          articlesWithContent,
          articlesWithoutContent: (totalArticles || 0) - articlesWithContent,
        });
      } catch (err) {
        console.error("Error fetching article stats:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading, error };
}
