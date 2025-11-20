import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Article {
  id: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  author: string | null;
  vertical_slug: string;
  published_at: string;
}

interface Backup {
  id: string;
  article_id: string;
  backup_name: string;
  title: string;
  content: string | null;
  created_at: string;
}

export function useArticleComparison(articleId: string | null) {
  const [article, setArticle] = useState<Article | null>(null);
  const [backup, setBackup] = useState<Backup | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!articleId) {
      setArticle(null);
      setBackup(null);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch current article
        const { data: articleData, error: articleError } = await supabase
          .from("articles")
          .select("id, title, content, excerpt, author, vertical_slug, published_at")
          .eq("id", articleId)
          .maybeSingle();

        if (articleError) throw articleError;

        if (!articleData) {
          setError("Article not found with the provided ID");
          setArticle(null);
          setBackup(null);
          return;
        }

        // Fetch most recent backup
        const { data: backupData, error: backupError } = await supabase
          .from("article_backups")
          .select("id, article_id, backup_name, title, content, created_at")
          .eq("article_id", articleId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (backupError) throw backupError;

        setArticle(articleData);
        setBackup(backupData || null);
      } catch (err) {
        console.error("Error fetching article comparison:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [articleId]);

  return { article, backup, isLoading, error };
}
