import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface VerticalStats {
  totalArticles: number;
  aiProcessed: number;
  remaining: number;
  duplicates: number;
  missingUrls: number;
  lastImport: string | null;
  lastFeedSize: number | null;
  importJobStatus: string | null;
  importProgress: number;
  importImported: number;
  importSkipped: number;
  importErrors: number;
  aiJobId: string | null;
  aiJobStatus: string | null;
  aiProgress: number;
  loading: boolean;
}

export const useVerticalOperations = (verticalSlug: string) => {
  const [stats, setStats] = useState<VerticalStats>({
    totalArticles: 0,
    aiProcessed: 0,
    remaining: 0,
    duplicates: 0,
    missingUrls: 0,
    lastImport: null,
    lastFeedSize: null,
    importJobStatus: null,
    importProgress: 0,
    importImported: 0,
    importSkipped: 0,
    importErrors: 0,
    aiJobId: null,
    aiJobStatus: null,
    aiProgress: 0,
    loading: true
  });
  const [processing, setProcessing] = useState(false);
  const [jsonUrl, setJsonUrl] = useState('');

  const loadStats = useCallback(async () => {
    try {
      // Total articles
      const { count: total } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', verticalSlug)
        .not('content', 'is', null);

      // AI processed
      const { count: processed } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', verticalSlug)
        .eq('metadata->>ai_processed', 'true');

      // Missing URLs
      const { count: missing } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', verticalSlug)
        .or('external_url.is.null,external_url.eq.');

      // Last completed import (with feed size)
      const { data: lastCompletedImport } = await supabase
        .from('import_history')
        .select('completed_at, metadata')
        .eq('vertical_slug', verticalSlug)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const lastFeedSize = lastCompletedImport?.metadata 
        ? (lastCompletedImport.metadata as any)?.total_from_feed as number | null
        : null;

      // Active import job (for progress)
      const { data: activeImport } = await supabase
        .from('import_history')
        .select('id, status, imported_count, skipped_count, error_count, total_processed, metadata')
        .eq('vertical_slug', verticalSlug)
        .neq('status', 'completed')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      let importJobStatus: string | null = null;
      let importProgress = 0;
      let importImported = 0;
      let importSkipped = 0;
      let importErrors = 0;

      if (activeImport) {
        importJobStatus = activeImport.status;
        importImported = activeImport.imported_count || 0;
        importSkipped = activeImport.skipped_count || 0;
        importErrors = activeImport.error_count || 0;

        const totalFromFeed =
          (activeImport.metadata as any)?.total_from_feed as number | undefined;
        const totalProcessed = activeImport.total_processed || 0;
        const denominator =
          (totalFromFeed && totalFromFeed > 0 ? totalFromFeed : totalProcessed) || 1;

        importProgress = Math.round((totalProcessed / denominator) * 100);
      }

      // AI job - only track actively in-progress jobs
      let job: any = null;

      const { data: inProgressJob } = await supabase
        .from('ai_processing_jobs')
        .select('*')
        .eq('vertical_slug', verticalSlug)
        .eq('status', 'in_progress')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (inProgressJob) {
        job = inProgressJob;
      }

      let aiProgress = 0;
      if (job && job.total_chunks > 0) {
        const processedChunks = Array.from(new Set(job.processed_chunks || [])).length;
        aiProgress = Math.round((processedChunks / job.total_chunks) * 100);
      }

      setStats(prev => ({
        totalArticles: total || 0,
        aiProcessed: processed || 0,
        remaining: (total || 0) - (processed || 0),
        duplicates: 0,
        missingUrls: missing || 0,
        lastImport: lastCompletedImport?.completed_at || null,
        lastFeedSize,
        importJobStatus,
        importProgress,
        importImported,
        importSkipped,
        importErrors,
        aiJobId: job?.id || null,
        aiJobStatus: job?.status || null,
        aiProgress,
        loading: false
      }));
    } catch (error) {
      console.error(`Error loading ${verticalSlug} stats:`, error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  }, [verticalSlug]);

  const startFastImport = async () => {
    try {
      setProcessing(true);
      
      if (!jsonUrl || !jsonUrl.trim()) {
        toast.error('Please enter a JSON URL');
        return;
      }

      toast.info(`Starting ${verticalSlug} import...`);

      const functionName = `import-${verticalSlug}-fast`;
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { jsonUrl }
      });

      if (error) throw error;

      toast.success(`${verticalSlug} import started!`, {
        description: data?.message || 'Import running in background',
        duration: 5000
      });

      setJsonUrl('');
      await loadStats();
    } catch (error) {
      toast.error(`Failed to start ${verticalSlug} import`, {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setProcessing(false);
    }
  };

  const startAIProcessing = async (fastMode = false, skipTags = false) => {
    try {
      setProcessing(true);
      const mode = fastMode ? ' (Fast Mode)' : '';
      toast.info(`Starting ${verticalSlug} AI processing${mode}...`);

      const { data, error } = await supabase.functions.invoke('start-ai-processing', {
        body: { verticalSlug, fastMode, skipTags }
      });

      if (error) throw error;

      // Check if job is already running
      if (data && !data.success) {
        toast.warning(`AI processing already running for ${verticalSlug}`, {
          description: data.progress || 'Please wait for the current job to complete',
          duration: 5000
        });
        await loadStats();
        return;
      }

      toast.success(`${verticalSlug} AI processing started${mode}!`, {
        description: `Processing ${data.totalArticles} articles`,
        duration: 5000
      });

      await loadStats();
    } catch (error) {
      toast.error(`Failed to start ${verticalSlug} AI processing`, {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setProcessing(false);
    }
  };

  const cleanupDuplicates = async () => {
    try {
      setProcessing(true);
      toast.info(`Checking ${verticalSlug} duplicates...`);

      const functionName = `cleanup-${verticalSlug}-duplicates`;
      const { data, error } = await supabase.functions.invoke(functionName);

      if (error) {
        if (error.message?.includes('not found') || error.message?.includes('404')) {
          toast.warning(`Duplicate cleanup not available for ${verticalSlug}`);
          return;
        }
        throw error;
      }

      toast.success(`Duplicate cleanup complete!`, {
        description: data?.message || 'Duplicates removed',
        duration: 5000
      });

      await loadStats();
    } catch (error) {
      toast.error(`Failed to cleanup ${verticalSlug} duplicates`, {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setProcessing(false);
    }
  };

  const backfillUrls = async () => {
    try {
      setProcessing(true);
      toast.info(`Starting ${verticalSlug} URL backfill...`);

      const functionName = `backfill-${verticalSlug}-urls`;
      const { data, error } = await supabase.functions.invoke(functionName);

      if (error) {
        if (error.message?.includes('not found') || error.message?.includes('404')) {
          toast.warning(`URL backfill not available for ${verticalSlug}`);
          return;
        }
        throw error;
      }

      toast.success(`URL backfill complete!`, {
        description: data?.message || 'URLs updated',
        duration: 5000
      });

      await loadStats();
    } catch (error) {
      toast.error(`Failed to backfill ${verticalSlug} URLs`, {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setProcessing(false);
    }
  };

  const clearImportHistory = async () => {
    try {
      setProcessing(true);
      toast.info(`Clearing ${verticalSlug} import history...`);

      const { error } = await supabase
        .from('import_history')
        .delete()
        .eq('vertical_slug', verticalSlug);

      if (error) throw error;

      toast.success('Import history cleared!');
      await loadStats();
    } catch (error) {
      toast.error(`Failed to clear ${verticalSlug} import history`, {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setProcessing(false);
    }
  };

  const clearAllArticles = async () => {
    try {
      setProcessing(true);
      toast.info(`Clearing all ${verticalSlug} articles...`);

      const functionName = `clear-${verticalSlug}-articles`;
      const { data, error } = await supabase.functions.invoke(functionName);

      if (error) {
        if (error.message?.includes('not found') || error.message?.includes('404')) {
          toast.warning(`Clear function not available for ${verticalSlug}`);
          return;
        }
        throw error;
      }

      toast.success(`All ${verticalSlug} articles cleared!`, {
        description: data?.message || 'Articles deleted',
        duration: 5000
      });

      await loadStats();
    } catch (error) {
      toast.error(`Failed to clear ${verticalSlug} articles`, {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setProcessing(false);
    }
  };

  const addSourceAttribution = async () => {
    try {
      setProcessing(true);
      toast.info(`Adding source attribution to ${verticalSlug} articles...`);

      const { data, error } = await supabase.functions.invoke('add-source-attribution', {
        body: { verticalSlug }
      });

      if (error) throw error;

      toast.success('Source attribution completed!', {
        description: `Updated: ${data?.updated || 0} | Skipped: ${data?.skipped || 0} | Total: ${data?.total || 0}`,
        duration: 5000
      });

      await loadStats();
    } catch (error) {
      toast.error(`Failed to add source attribution`, {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setProcessing(false);
    }
  };

  const removeSourceAttribution = async () => {
    try {
      setProcessing(true);
      toast.info(`Removing source attribution from ${verticalSlug} articles...`);

      const { data, error } = await supabase.functions.invoke('remove-source-attribution', {
        body: { verticalSlug }
      });

      if (error) throw error;

      toast.success('Source attribution removed!', {
        description: data?.message || `Cleaned ${data?.removed || 0} articles`,
        duration: 5000
      });

      await loadStats();
    } catch (error) {
      toast.error(`Failed to remove source attribution`, {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setProcessing(false);
    }
  };

  const resetAIProcessing = async () => {
    try {
      setProcessing(true);
      toast.info(`Resetting AI processing for ${verticalSlug} articles...`);

      const { data, error } = await supabase.functions.invoke('reset-vertical-ai', {
        body: { verticalSlug }
      });

      if (error) throw error;

      toast.success('AI processing reset complete!', {
        description: `Reset ${data?.count || 0} articles for reprocessing`,
        duration: 5000
      });

      await loadStats();
    } catch (error) {
      toast.error(`Failed to reset AI processing`, {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setProcessing(false);
    }
  };

  const resetAndRestartAI = async (fastMode = false, skipTags = false) => {
    try {
      setProcessing(true);
      const mode = fastMode ? ' (Fast Mode)' : '';
      toast.info(`Completing stuck jobs and starting fresh AI processing for ${verticalSlug}${mode}...`);

      const { data, error } = await supabase.functions.invoke('reset-and-restart-ai', {
        body: { verticalSlug, fastMode, skipTags }
      });

      if (error) throw error;

      toast.success(`Reset and restart complete${mode}!`, {
        description: data?.message || `Processing ${data?.articlesToProcess || 0} articles`,
        duration: 5000
      });

      await loadStats();
    } catch (error) {
      toast.error(`Failed to reset and restart AI processing`, {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setProcessing(false);
    }
  };

  return {
    stats,
    processing,
    jsonUrl,
    setJsonUrl,
    loadStats,
    startFastImport,
    startAIProcessing,
    cleanupDuplicates,
    backfillUrls,
    clearImportHistory,
    clearAllArticles,
    addSourceAttribution,
    removeSourceAttribution,
    resetAIProcessing,
    resetAndRestartAI
  };
};
