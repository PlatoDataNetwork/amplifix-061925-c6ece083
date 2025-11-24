import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface AviationImportProps {
  importing: string | null;
  isClearing: boolean;
  aviationProgress: {
    phase: string;
    currentPage: number;
    totalPages: number;
    articlesCollected: number;
    articlesProcessed?: number;
    imported?: number;
    skipped?: number;
    errors?: number;
    percentComplete?: number;
    message: string;
  } | null;
  aviationImportTotals: {
    imported: number;
    skipped: number;
    totalProcessed: number;
    lastPage: number | null;
    status: string;
  } | null;
  aviationArticleCounts: {
    total: number;
    aiProcessed: number;
    remaining: number;
  } | null;
  aviationStats: {
    totalInDb: number;
    missingUrls: number;
    platoTotal: number | null;
    loading: boolean;
  };
  aiJobStats: {
    totalChunks: number;
    processedChunks: number;
    failedChunks: number;
    progressPercent: number;
    startedAt: string | null;
    estimatedTimeRemaining: string | null;
    articlesProcessed: number;
    articlesPerMinute: number;
    status?: string;
  } | null;
  lastAiStatsUpdate: Date | null;
  lastCountsUpdate: Date | null;
  autoRestartEnabled: boolean;
  aiProcessingActive: boolean;
  parallelChunksInProgress: Set<number>;
  progressPercent: number;
  progressStatus: string;
  totalAiChunks: number;
  onImportStart: () => void;
  onSetImporting: (value: string | null) => void;
  onSetIsClearing: (value: boolean) => void;
  onSetAiProcessingActive: (value: boolean) => void;
  onSetProgressPercent: (value: number) => void;
  onSetProgressStatus: (value: string) => void;
  onSetAutoRestartEnabled: (value: boolean) => void;
  onLoadMetrics: () => Promise<void>;
  onLoadAviationArticleCounts: () => Promise<void>;
  onLoadAviationStats: () => Promise<void>;
  onLoadAiJobStats: () => Promise<void>;
  onClearAllAviationData: () => Promise<void>;
  onHandleResetAviationAI: () => Promise<void>;
}

export const AviationImport = ({
  importing,
  isClearing,
  aviationProgress,
  aviationImportTotals,
  aviationArticleCounts,
  aviationStats,
  aiJobStats,
  lastAiStatsUpdate,
  lastCountsUpdate,
  autoRestartEnabled,
  aiProcessingActive,
  parallelChunksInProgress,
  progressPercent,
  progressStatus,
  totalAiChunks,
  onImportStart,
  onSetImporting,
  onSetIsClearing,
  onSetAiProcessingActive,
  onSetProgressPercent,
  onSetProgressStatus,
  onSetAutoRestartEnabled,
  onLoadMetrics,
  onLoadAviationArticleCounts,
  onLoadAviationStats,
  onLoadAiJobStats,
  onClearAllAviationData,
  onHandleResetAviationAI,
}: AviationImportProps) => {
  const [aiProcessingJobId, setAiProcessingJobId] = useState<string | null>(null);
  const [duplicatesCount, setDuplicatesCount] = useState<number>(0);
  const [cleaningDuplicates, setCleaningDuplicates] = useState(false);
  const [customJsonUrl, setCustomJsonUrl] = useState<string>('https://platodata.ai/aviation/json/');
  const [customVertical, setCustomVertical] = useState<string>('aviation');

  // Fetch duplicates count
  const loadDuplicatesCount = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('post_id')
        .eq('vertical_slug', 'aviation')
        .not('post_id', 'is', null);

      if (error) throw error;

      // Count duplicates by post_id
      const postIdCounts = new Map<number, number>();
      data?.forEach(article => {
        const count = postIdCounts.get(article.post_id!) || 0;
        postIdCounts.set(article.post_id!, count + 1);
      });

      // Count total duplicates (extra copies beyond the first)
      let totalDuplicates = 0;
      postIdCounts.forEach(count => {
        if (count > 1) {
          totalDuplicates += (count - 1);
        }
      });

      setDuplicatesCount(totalDuplicates);
    } catch (error) {
      console.error('Error loading duplicates count:', error);
    }
  };

  // Clean duplicates
  const cleanDuplicates = async () => {
    setCleaningDuplicates(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Authentication required');
        return;
      }

      toast.info('Cleaning aviation duplicates...');

      const { data, error } = await supabase.functions.invoke('cleanup-aviation-duplicates', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      toast.success('Duplicates cleaned!', {
        description: `Removed ${data.duplicatesRemoved} duplicate articles (found ${data.duplicatesFound} total)`
      });

      // Reload metrics
      await loadDuplicatesCount();
      await onLoadAviationArticleCounts();
      await onLoadMetrics();
    } catch (error) {
      console.error('Error cleaning duplicates:', error);
      toast.error('Failed to clean duplicates', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setCleaningDuplicates(false);
    }
  };

  // Load duplicates on mount and when article counts change
  useEffect(() => {
    loadDuplicatesCount();
  }, [aviationArticleCounts]);

  const importAviationFast = async () => {
    if (!customJsonUrl.trim() || !customVertical.trim()) {
      toast.error('Please provide both JSON URL and vertical slug');
      return;
    }

    onSetImporting('aviation-fast');
    onSetProgressStatus(`Starting ${customVertical} FAST import (no AI)...`);
    onSetProgressPercent(0);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Authentication required');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('User not found');
        return;
      }

      toast.info(`Starting ${customVertical} FAST import in background...`, {
        description: 'All articles will be imported without timing out. Check Import History below for progress.'
      });

      onSetProgressPercent(10);
      onSetProgressStatus(`Launching ${customVertical} background import...`);

      const { data, error } = await supabase.functions.invoke('import-aviation-fast', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        },
        body: {
          jsonUrl: customJsonUrl,
          verticalSlug: customVertical
        }
      });

      if (error) throw error;

      toast.success(`${customVertical} import started!`, {
        description: 'Check Import History table for progress'
      });

      await onLoadMetrics();
    } catch (error) {
      console.error('Error importing:', error);
      toast.error(`Failed to start ${customVertical} import`, {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      onSetProgressStatus('Error occurred');
      onSetImporting(null);
    }
  };

  const startAviationAIProcessing = async () => {
    if (aiProcessingActive) {
      onSetAiProcessingActive(false);
      toast.info('Auto-resume stopped. Processing will complete current chunks.');
      return;
    }

    try {
      onSetAiProcessingActive(true);
      onSetImporting('process-aviation-ai');
      onSetProgressPercent(0);
      onSetProgressStatus('Initializing Aviation AI processing...');

      const { error: resetError } = await supabase
        .from('ai_processing_jobs')
        .update({ 
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('vertical_slug', 'aviation')
        .neq('status', 'completed');

      if (resetError) {
        console.error('Error resetting previous AI jobs:', resetError);
        throw resetError;
      }

      const { count } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', 'aviation')
        .not('content', 'is', null);

      const totalArticles = count || 0;
      const chunkSize = 50;
      const totalChunks = Math.max(1, Math.ceil(totalArticles / chunkSize));

      const { data: newJob, error: createError } = await supabase
        .from('ai_processing_jobs')
        .insert({
          vertical_slug: 'aviation',
          total_chunks: totalChunks,
          status: 'in_progress'
        })
        .select()
        .single();

      if (createError || !newJob) {
        throw createError || new Error('Failed to create AI processing job');
      }

      const jobId = newJob.id as string;

      toast.info('Starting Aviation AI processing from scratch', {
        description: `${totalChunks} chunks × ${chunkSize} articles with 5× parallel processing`
      });

      setAiProcessingJobId(jobId);

      // Auto-resume loop
      const processNextBatch = async (): Promise<boolean> => {
        const PARALLEL_CHUNKS = 5;
        
        const { data: currentJob } = await supabase
          .from('ai_processing_jobs')
          .select('processed_chunks, failed_chunks')
          .eq('id', jobId)
          .single();
        
        if (!currentJob) return false;
        
        const completed = currentJob.processed_chunks || [];
        const failed = currentJob.failed_chunks || [];
        
        const unprocessedChunks: number[] = [];
        for (let i = 0; i < totalChunks && unprocessedChunks.length < PARALLEL_CHUNKS; i++) {
          if (!completed.includes(i) && !failed.includes(i)) {
            unprocessedChunks.push(i);
          }
        }

        if (unprocessedChunks.length === 0) {
          await supabase
            .from('ai_processing_jobs')
            .update({
              status: 'completed',
              completed_at: new Date().toISOString()
            })
            .eq('id', jobId);

          onSetProgressPercent(100);
          onSetProgressStatus('Complete!');
          toast.success(`Aviation AI processing complete!`, {
            description: `Processed all ${totalArticles} articles!`
          });
          return false;
        }

        const promises = unprocessedChunks.map(async (chunkIndex) => {
          try {
            console.log(`🔄 Starting Aviation chunk ${chunkIndex + 1}/${totalChunks}...`);
            const { data, error } = await supabase.functions.invoke('format-all-articles', {
              body: { chunkIndex, chunkSize, verticalSlug: 'aviation', jobId }
            });

            if (error || !data?.success) {
              console.error(`❌ Aviation chunk ${chunkIndex} failed:`, error || data);
              return { chunkIndex, success: false };
            }

            console.log(`✅ Aviation chunk ${chunkIndex + 1}/${totalChunks} complete`);
            return { chunkIndex, success: true };
          } catch (err) {
            console.error(`❌ Aviation chunk ${chunkIndex} error:`, err);
            return { chunkIndex, success: false };
          }
        });

        await Promise.all(promises);

        const { data: updatedJob } = await supabase
          .from('ai_processing_jobs')
          .select('processed_chunks, failed_chunks')
          .eq('id', jobId)
          .single();
        
        if (updatedJob) {
          const rawProcessed = (updatedJob.processed_chunks || []) as number[];
          const validProcessed = rawProcessed.filter((i) => i >= 0 && i < totalChunks);
          const doneCount = Array.from(new Set(validProcessed)).length;
          const failCount = (updatedJob.failed_chunks || []).length;
          const rawProgress = totalChunks > 0 ? Math.round((doneCount / totalChunks) * 100) : 0;
          const clampedProgress = Math.max(0, Math.min(100, rawProgress));
          onSetProgressPercent(clampedProgress);
          onSetProgressStatus(`${doneCount}/${totalChunks} chunks done (${failCount} failed)`);
          
          onLoadAiJobStats();
        }

        return true;
      };

      const autoResume = async () => {
        const shouldContinue = await processNextBatch();
        
        if (shouldContinue) {
          setTimeout(() => autoResume(), 1000);
        } else {
          onSetAiProcessingActive(false);
          setTimeout(() => {
            onSetImporting(null);
            onSetProgressPercent(0);
            onSetProgressStatus('');
          }, 3000);
        }
      };

      autoResume();

    } catch (error) {
      console.error('Error processing aviation articles:', error);
      toast.error('Failed to process aviation articles', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      onSetImporting(null);
      onSetAiProcessingActive(false);
    }
  };

  return (
    <>
      {/* Fast Import Card */}
      <Card className="mb-8 border-blue-500/50 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              🚀 Fast Import (No AI)
            </CardTitle>
            <div className="flex gap-6">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Articles in DB</p>
                <p className="text-3xl font-bold">{aviationArticleCounts?.total.toLocaleString() || '0'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Duplicates</p>
                <p className="text-3xl font-bold text-orange-500">{duplicatesCount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">JSON Feed URL</label>
              <input
                type="text"
                value={customJsonUrl}
                onChange={(e) => setCustomJsonUrl(e.target.value)}
                placeholder="https://platodata.ai/aviation/json/"
                className="w-full px-3 py-2 border rounded-md bg-background"
                disabled={importing !== null}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Vertical Slug</label>
              <input
                type="text"
                value={customVertical}
                onChange={(e) => setCustomVertical(e.target.value)}
                placeholder="aviation"
                className="w-full px-3 py-2 border rounded-md bg-background"
                disabled={importing !== null}
              />
            </div>

            <Button
              onClick={importAviationFast}
              disabled={importing !== null || !customJsonUrl.trim() || !customVertical.trim()}
              className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {importing === 'aviation-fast' ? `Importing ${customVertical}...` : 'Start Fast Import (No AI)'}
            </Button>

            {importing === 'aviation-fast' && aviationProgress && (
              <div className="space-y-4">
                <div className="space-y-3 p-4 bg-background rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{aviationProgress.message}</span>
                    <span className="text-sm text-muted-foreground">
                      Page {aviationProgress.currentPage} / {aviationProgress.totalPages}
                    </span>
                  </div>
                  <Progress 
                    value={aviationProgress.percentComplete || 0} 
                    className="h-2" 
                  />
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <p className="text-muted-foreground">Collected</p>
                      <p className="font-bold">{aviationProgress.articlesCollected}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Imported</p>
                      <p className="font-bold text-green-600">{aviationProgress.imported || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Skipped</p>
                      <p className="font-bold text-yellow-600">{aviationProgress.skipped || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Errors</p>
                      <p className="font-bold text-red-600">{aviationProgress.errors || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {aviationImportTotals && (
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/30">
                <h4 className="text-sm font-semibold text-green-700 dark:text-green-300 mb-3">
                  📊 Latest Aviation Import Session
                </h4>
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-background/80 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className="text-sm font-bold capitalize">{aviationImportTotals.status}</p>
                  </div>
                  <div className="p-3 bg-background/80 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">Imported</p>
                    <p className="text-sm font-bold text-green-600">{aviationImportTotals.imported.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-background/80 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">Skipped</p>
                    <p className="text-sm font-bold text-yellow-600">{aviationImportTotals.skipped.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-background/80 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">Total Processed</p>
                    <p className="text-sm font-bold">{aviationImportTotals.totalProcessed.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Processing Card */}
      <Card className="mb-8 border-purple-500/50 bg-gradient-to-br from-purple-500/5 to-purple-500/10">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            🤖 Process Existing Aviation Articles with AI
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Apply AI-powered content formatting and tag extraction to aviation articles.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              onClick={startAviationAIProcessing}
              disabled={importing !== null && importing !== 'process-aviation-ai'}
              className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              {aiProcessingActive ? '⏸️ Stop Processing' : '🚀 Start AI Processing'}
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={cleanDuplicates}
                disabled={cleaningDuplicates || importing !== null || duplicatesCount === 0}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                {cleaningDuplicates ? 'Cleaning...' : `🧹 Clean ${duplicatesCount} Duplicates`}
              </Button>
              
              <Button
                onClick={onClearAllAviationData}
                disabled={isClearing || importing !== null}
                variant="destructive"
                className="flex-1"
                size="lg"
              >
                {isClearing ? 'Clearing...' : '🗑️ Clear All Aviation Data'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
