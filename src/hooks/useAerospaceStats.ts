import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AerospaceStats {
  totalArticles: number;
  articlesWithExternalUrls: number;
  articlesNeedingBackfill: number;
  articlesWithoutUrls: number;
  aiProcessingJobs: {
    total: number;
    inProgress: number;
    completed: number;
    failed: number;
    progress: number;
  };
  latestImport: {
    status: string;
    importedCount: number;
    startedAt: string;
    completedAt: string | null;
  } | null;
}

export const useAerospaceStats = () => {
  const [stats, setStats] = useState<AerospaceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get article counts
      const { count: totalArticles } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("vertical_slug", "aerospace");

      const { count: articlesWithExternalUrls } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("vertical_slug", "aerospace")
        .not("external_url", "is", null)
        .not("external_url", "like", "%platodata%");

      const { count: articlesNeedingBackfill } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("vertical_slug", "aerospace")
        .like("external_url", "%platodata%");

      const { count: articlesWithoutUrls } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("vertical_slug", "aerospace")
        .is("external_url", null);

      // Get AI processing job stats
      const { data: aiJobs } = await supabase
        .from("ai_processing_jobs")
        .select("status, total_chunks, processed_chunks")
        .eq("vertical_slug", "aerospace");

      const aiStats = {
        total: aiJobs?.length || 0,
        inProgress: aiJobs?.filter((j) => j.status === "in_progress").length || 0,
        completed: aiJobs?.filter((j) => j.status === "completed").length || 0,
        failed: aiJobs?.filter((j) => j.status === "failed").length || 0,
        progress: 0,
      };

      if (aiJobs && aiJobs.length > 0) {
        const totalChunks = aiJobs.reduce((sum, job) => sum + job.total_chunks, 0);
        const processedChunks = aiJobs.reduce(
          (sum, job) => sum + (job.processed_chunks?.length || 0),
          0
        );
        aiStats.progress = totalChunks > 0 ? (processedChunks / totalChunks) * 100 : 0;
      }

      // Get latest import
      const { data: latestImport } = await supabase
        .from("import_history")
        .select("status, imported_count, started_at, completed_at")
        .eq("vertical_slug", "aerospace")
        .order("started_at", { ascending: false })
        .limit(1)
        .single();

      setStats({
        totalArticles: totalArticles || 0,
        articlesWithExternalUrls: articlesWithExternalUrls || 0,
        articlesNeedingBackfill: articlesNeedingBackfill || 0,
        articlesWithoutUrls: articlesWithoutUrls || 0,
        aiProcessingJobs: aiStats,
        latestImport: latestImport
          ? {
              status: latestImport.status,
              importedCount: latestImport.imported_count,
              startedAt: latestImport.started_at,
              completedAt: latestImport.completed_at,
            }
          : null,
      });
    } catch (err) {
      console.error("Error loading aerospace stats:", err);
      setError(err instanceof Error ? err.message : "Failed to load stats");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return { stats, isLoading, error, refresh: loadStats };
};
