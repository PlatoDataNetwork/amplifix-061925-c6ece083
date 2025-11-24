import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Loader2, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface AerospaceImportProps {
  importing: string | null;
  isClearing: boolean;
  aerospaceProgress: {
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
  aerospaceImportTotals: {
    imported: number;
    skipped: number;
    totalProcessed: number;
    lastPage: number | null;
    status: string;
  } | null;
  aerospaceArticleCounts: {
    total: number;
    aiProcessed: number;
    remaining: number;
  } | null;
  aerospaceStats: {
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
  onLoadAerospaceArticleCounts: () => Promise<void>;
  onLoadAerospaceStats: () => Promise<void>;
  onLoadAiJobStats: () => Promise<void>;
  onClearAllAerospaceData: () => Promise<void>;
  onHandleResetAerospaceAI: () => Promise<void>;
  onImportAerospaceWithAI: () => Promise<void>;
}

// This component handles AEROSPACE import and AI processing (NOT Aviation)
export const AerospaceImport = ({
  importing,
  isClearing,
  aerospaceProgress,
  aerospaceImportTotals,
  aerospaceArticleCounts,
  aerospaceStats,
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
  onLoadAerospaceArticleCounts,
  onLoadAerospaceStats,
  onLoadAiJobStats,
  onClearAllAerospaceData,
  onHandleResetAerospaceAI,
  onImportAerospaceWithAI,
}: AerospaceImportProps) => {
  const [aiProcessingJobId, setAiProcessingJobId] = useState<string | null>(null);
  const [setParallelChunksInProgress] = useState<(value: Set<number>) => void>(() => () => {});

  const importAerospaceFast = async () => {
    onSetImporting('aerospace-fast');
    onSetProgressStatus('Starting Aerospace FAST import (no AI)...');
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

      toast.info('Starting FAST Aerospace import in background...', {
        description: 'All articles will be imported without timing out. Check Import History below for progress.'
      });

      onSetProgressPercent(10);
      onSetProgressStatus('Launching Aerospace background import...');

      const { data, error } = await supabase.functions.invoke('import-aerospace-fast', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      await onLoadMetrics();
    } catch (error) {
      console.error('Error importing Aerospace:', error);
      toast.error('Failed to start Aerospace import', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      onSetProgressStatus('Error occurred');
      onSetImporting(null);
    }
  };

  const startAerospaceAIProcessing = async () => {
    if (aiProcessingActive) {
      onSetAiProcessingActive(false);
      toast.info('Auto-resume stopped. Processing will complete current chunks.');
      return;
    }

    try {
      onSetAiProcessingActive(true);
      onSetImporting('process-aerospace-ai');
      onSetProgressPercent(0);
      onSetProgressStatus('Initializing Aerospace AI processing...');

      const { error: resetError } = await supabase
        .from('ai_processing_jobs')
        .update({ 
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('vertical_slug', 'aerospace')
        .neq('status', 'completed');

      if (resetError) {
        console.error('Error resetting previous AI jobs:', resetError);
        throw resetError;
      }

      const { count } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', 'aerospace')
        .not('content', 'is', null);

      const totalArticles = count || 0;
      const chunkSize = 50;
      const totalChunks = Math.max(1, Math.ceil(totalArticles / chunkSize));

      const { data: newJob, error: createError } = await supabase
        .from('ai_processing_jobs')
        .insert({
          vertical_slug: 'aerospace',
          total_chunks: totalChunks,
          status: 'in_progress'
        })
        .select()
        .single();

      if (createError || !newJob) {
        throw createError || new Error('Failed to create AI processing job');
      }

      const jobId = newJob.id as string;

      toast.info('Starting Aerospace AI processing from scratch', {
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
          toast.success(`Aerospace AI processing complete!`, {
            description: `Processed all ${totalArticles} articles!`
          });
          return false;
        }

        const promises = unprocessedChunks.map(async (chunkIndex) => {
          try {
            console.log(`🔄 Starting Aerospace chunk ${chunkIndex + 1}/${totalChunks}...`);
            const { data, error } = await supabase.functions.invoke('format-all-articles', {
              body: { chunkIndex, chunkSize, verticalSlug: 'aerospace', jobId }
            });

            if (error || !data?.success) {
              console.error(`❌ Aerospace chunk ${chunkIndex} failed:`, error || data);
              return { chunkIndex, success: false };
            }

            console.log(`✅ Aerospace chunk ${chunkIndex + 1}/${totalChunks} complete`);
            return { chunkIndex, success: true };
          } catch (err) {
            console.error(`❌ Chunk ${chunkIndex} error:`, err);
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
      console.error('Error processing aerospace articles:', error);
      toast.error('Failed to process aerospace articles', {
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
              🚀 Aerospace Fast Import (No AI)
            </CardTitle>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Articles in DB</p>
              <p className="text-3xl font-bold">{aerospaceArticleCounts?.total.toLocaleString() || '0'}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={importAerospaceFast}
                disabled={importing !== null}
                className="flex-1 h-14 text-lg bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {importing === 'aerospace-fast' ? 'Importing...' : 'Fast Import (No AI)'}
              </Button>
              <Button
                onClick={onImportAerospaceWithAI}
                disabled={importing !== null}
                className="flex-1 h-14 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                {importing === 'aerospace-ai' ? 'Importing with AI...' : '🤖 Import with AI + Formatting'}
              </Button>
            </div>

            {importing === 'aerospace-fast' && aerospaceProgress && (
              <div className="space-y-4">
                <div className="space-y-3 p-4 bg-background rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{aerospaceProgress.message}</span>
                    <span className="text-sm text-muted-foreground">
                      Page {aerospaceProgress.currentPage} / {aerospaceProgress.totalPages}
                    </span>
                  </div>
                  <Progress 
                    value={aerospaceProgress.percentComplete || 0} 
                    className="h-2" 
                  />
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <p className="text-muted-foreground">Collected</p>
                      <p className="font-bold">{aerospaceProgress.articlesCollected}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Imported</p>
                      <p className="font-bold text-green-600">{aerospaceProgress.imported || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Skipped</p>
                      <p className="font-bold text-yellow-600">{aerospaceProgress.skipped || 0}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Errors</p>
                      <p className="font-bold text-red-600">{aerospaceProgress.errors || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {aerospaceImportTotals && (
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/30">
                <h4 className="text-sm font-semibold text-green-700 dark:text-green-300 mb-3">
                  📊 Latest Aerospace Import Session
                </h4>
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-background/80 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <p className="text-sm font-bold capitalize">{aerospaceImportTotals.status}</p>
                  </div>
                  <div className="p-3 bg-background/80 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">Imported</p>
                    <p className="text-sm font-bold text-green-600">{aerospaceImportTotals.imported.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-background/80 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">Skipped</p>
                    <p className="text-sm font-bold text-yellow-600">{aerospaceImportTotals.skipped.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-background/80 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">Total Processed</p>
                    <p className="text-sm font-bold">{aerospaceImportTotals.totalProcessed.toLocaleString()}</p>
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
            🤖 Process Existing Aerospace Articles with AI
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Apply AI-powered content formatting and tag extraction to aerospace articles.
          </p>
          
          {aiJobStats && (
            <div className="mt-4 p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-300">📊 Current AI Processing Job</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onLoadAiJobStats}
                  className="h-6 px-2 text-xs"
                >
                  ↻ Refresh
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div className="p-3 bg-background/80 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">Progress</p>
                  <p className="text-2xl font-bold text-purple-500">
                    {aerospaceArticleCounts && aerospaceArticleCounts.total > 0
                      ? Math.round((aerospaceArticleCounts.aiProcessed / aerospaceArticleCounts.total) * 100)
                      : aiJobStats.progressPercent}%
                  </p>
                </div>
                
                <div className="p-3 bg-background/80 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">Articles Processed</p>
                  <p className="text-2xl font-bold text-green-500">
                    {(aerospaceArticleCounts
                      ? aerospaceArticleCounts.aiProcessed
                      : aiJobStats.articlesProcessed
                    ).toLocaleString()}
                  </p>
                </div>
                
                <div className="p-3 bg-background/80 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">Failed Chunks</p>
                  <p className="text-2xl font-bold text-red-500">{aiJobStats.failedChunks}</p>
                </div>
                
                <div className="p-3 bg-background/80 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">Time Remaining</p>
                  <p className="text-2xl font-bold text-blue-500">
                    {aiJobStats.estimatedTimeRemaining || 'Done'}
                  </p>
                </div>
              </div>
              
              <Progress
                value={aerospaceArticleCounts && aerospaceArticleCounts.total > 0
                  ? Math.round((aerospaceArticleCounts.aiProcessed / aerospaceArticleCounts.total) * 100)
                  : aiJobStats.progressPercent}
                className="h-2"
              />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
               <Button
                onClick={startAerospaceAIProcessing}
                disabled={importing === 'process-aerospace-ai' && !aiProcessingActive}
                className={`flex-1 h-14 text-lg ${aiProcessingActive ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                size="lg"
              >
                {aiProcessingActive ? '⏸ Stop Auto-Resume' : (importing === 'process-aerospace-ai' ? `${progressStatus}` : '🚀 Start Auto-Resume Processing')}
              </Button>
              
              <Button
                onClick={onLoadAiJobStats}
                variant="outline"
                className="h-14 px-6"
                size="lg"
              >
                🔄 Refresh Stats
              </Button>
              
              <Button
                onClick={onClearAllAerospaceData}
                disabled={isClearing || !aerospaceArticleCounts?.total}
                variant="destructive"
                className="h-14 px-6"
                size="lg"
              >
                {isClearing ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Clearing...
                  </>
                ) : (
                  <>
                    🗑️ Clear All Aerospace Data
                  </>
                )}
              </Button>
            </div>

            {importing === 'process-aerospace-ai' && (
              <div className="space-y-4">
                <div className="space-y-3 p-4 bg-background rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{progressStatus}</span>
                    <span className="text-sm text-muted-foreground">{progressPercent}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
