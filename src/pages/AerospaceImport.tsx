import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { AerospaceImport as AerospaceImportComponent } from "@/components/admin/AerospaceImport";
import { AerospaceStatsDashboard } from "@/components/AerospaceStatsDashboard";
import { ImportHistoryTable } from "@/components/ImportHistoryTable";
import { AerospaceUrlBackfill } from "@/components/AerospaceUrlBackfill";
import { useAdminCheck } from "@/hooks/useAdminCheck";

const AerospaceImport = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: isCheckingAdmin } = useAdminCheck();
  const [importing, setImporting] = useState<string | null>(null);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [isClearing, setIsClearing] = useState(false);
  
  const [aerospaceProgress, setAerospaceProgress] = useState<{
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
  } | null>(null);
  
  const [aerospaceImportTotals, setAerospaceImportTotals] = useState<{
    imported: number;
    skipped: number;
    totalProcessed: number;
    lastPage: number | null;
    status: string;
  } | null>(null);
  
  const [aiProcessingActive, setAiProcessingActive] = useState(false);
  const [parallelChunksInProgress, setParallelChunksInProgress] = useState<Set<number>>(new Set());
  const [totalAiChunks, setTotalAiChunks] = useState<number>(0);
  const [autoRestartEnabled, setAutoRestartEnabled] = useState(true);
  
  const [aiJobStats, setAiJobStats] = useState<{
    totalChunks: number;
    processedChunks: number;
    failedChunks: number;
    progressPercent: number;
    startedAt: string | null;
    estimatedTimeRemaining: string | null;
    articlesProcessed: number;
    articlesPerMinute: number;
    status?: string;
  } | null>(null);
  
  const [aerospaceArticleCounts, setAerospaceArticleCounts] = useState<{
    total: number;
    aiProcessed: number;
    remaining: number;
  } | null>(null);
  
  const [lastCountsUpdate, setLastCountsUpdate] = useState<Date | null>(null);
  const [lastAiStatsUpdate, setLastAiStatsUpdate] = useState<Date | null>(null);
  const [lastAiProgress, setLastAiProgress] = useState<number>(0);
  
  const [aerospaceStats, setAerospaceStats] = useState<{
    totalInDb: number;
    missingUrls: number;
    platoTotal: number | null;
    loading: boolean;
  }>({
    totalInDb: 0,
    missingUrls: 0,
    platoTotal: null,
    loading: false
  });

  // Redirect if not admin
  useEffect(() => {
    if (!isCheckingAdmin && !isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, isCheckingAdmin, navigate]);

  // Load aerospace article counts
  const loadAerospaceArticleCounts = async () => {
    try {
      const { count: total, error: totalError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', 'aerospace')
        .not('content', 'is', null);

      if (totalError) throw totalError;

      const { count: processed, error: processedError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', 'aerospace')
        .not('content', 'is', null)
        .eq('metadata->>ai_processed', 'true');

      if (processedError) throw processedError;

      const currentProgress = processed || 0;
      setAerospaceArticleCounts({
        total: total || 0,
        aiProcessed: currentProgress,
        remaining: (total || 0) - currentProgress
      });
      setLastCountsUpdate(new Date());
      
      if (autoRestartEnabled && lastAiProgress === currentProgress && currentProgress < (total || 0)) {
        const timeSinceLastUpdate = lastCountsUpdate ? (new Date().getTime() - lastCountsUpdate.getTime()) / 1000 / 60 : 0;
        if (timeSinceLastUpdate > 10) {
          console.log('🔄 Aerospace AI processing stalled, auto-restarting...');
          toast.info('Aerospace AI processing stalled, restarting automatically...');
          await handleResetAerospaceAI();
        }
      }
      setLastAiProgress(currentProgress);
    } catch (error) {
      console.error('Error loading aerospace article counts:', error);
    }
  };

  // Load AI job stats
  const loadAiJobStats = async () => {
    try {
      const { data: job, error } = await supabase
        .from('ai_processing_jobs')
        .select('*')
        .eq('vertical_slug', 'aerospace')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading AI job stats:', error);
        return;
      }

      if (job) {
        const totalChunks = job.total_chunks || 0;
        const rawProcessed = (job.processed_chunks || []) as number[];
        const validProcessed = rawProcessed.filter((i) => i >= 0 && i < totalChunks);
        const processedCount = Array.from(new Set(validProcessed)).length;
        const failedCount = (job.failed_chunks || []).length;
        const rawProgressPercent = totalChunks > 0 ? Math.round((processedCount / totalChunks) * 100) : 0;
        const progressPercent = Math.max(0, Math.min(100, rawProgressPercent));
        
        const startTime = new Date(job.started_at);
        const now = new Date();
        const elapsedMinutes = (now.getTime() - startTime.getTime()) / 1000 / 60;
        const articlesProcessed = processedCount * 50;
        const articlesPerMinute = elapsedMinutes > 0 ? Math.round(articlesProcessed / elapsedMinutes) : 0;
        
        const remainingChunks = totalChunks - processedCount - failedCount;
        const remainingArticles = remainingChunks * 50;
        const estimatedMinutesRemaining = articlesPerMinute > 0 ? Math.round(remainingArticles / articlesPerMinute) : 0;
        const estimatedTimeRemaining = estimatedMinutesRemaining > 60 
          ? `${Math.floor(estimatedMinutesRemaining / 60)}h ${estimatedMinutesRemaining % 60}m`
          : `${estimatedMinutesRemaining}m`;

        setAiJobStats({
          totalChunks,
          processedChunks: processedCount,
          failedChunks: failedCount,
          progressPercent,
          startedAt: job.started_at,
          estimatedTimeRemaining: remainingChunks > 0 ? estimatedTimeRemaining : null,
          articlesProcessed,
          articlesPerMinute,
          status: job.status
        });
        
        setTotalAiChunks(totalChunks);
        setLastAiStatsUpdate(new Date());
      } else {
        setAiJobStats(null);
      }
    } catch (error) {
      console.error('Error loading AI job stats:', error);
    }
  };

  // Load aerospace stats
  const loadAerospaceStats = async () => {
    setAerospaceStats(prev => ({ ...prev, loading: true }));
    
    try {
      const { count: totalInDb } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', 'aerospace');
      
      const { count: missingUrls } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', 'aerospace')
        .or('external_url.is.null,external_url.ilike.%platodata.ai%');
      
      let platoTotal: number | null = null;
      try {
        const { data: feedData } = await supabase.functions.invoke('fetch-aerospace-feed', {
          body: { page: 1 }
        });
        
        if (feedData?.count) {
          platoTotal = feedData.count;
        } else if (feedData?.results && Array.isArray(feedData.results)) {
          platoTotal = feedData.results.length;
        }
      } catch (e) {
        console.error('Could not fetch Plato AI feed stats:', e);
      }
      
      setAerospaceStats({
        totalInDb: totalInDb || 0,
        missingUrls: missingUrls || 0,
        platoTotal,
        loading: false
      });
    } catch (error) {
      console.error('Error loading aerospace stats:', error);
      setAerospaceStats(prev => ({ ...prev, loading: false }));
    }
  };

  // Handle aerospace AI processing reset
  const handleResetAerospaceAI = async () => {
    try {
      toast.info('Resetting Aerospace AI processing jobs...');
      
      const { error } = await supabase.functions.invoke('reset-aerospace-ai', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) throw error;

      toast.success('Aerospace AI processing reset successfully');
      await loadAiJobStats();
      await loadAerospaceArticleCounts();
    } catch (error) {
      console.error('Error resetting Aerospace AI:', error);
      toast.error('Failed to reset Aerospace AI processing');
    }
  };

  // Clear all aerospace data
  const clearAllAerospaceData = async () => {
    if (!confirm('⚠️ Are you sure you want to clear ALL Aerospace data? This will:\n\n✅ Create a backup first\n❌ Delete all aerospace articles\n❌ Reset all aerospace import history\n\nThis action requires confirmation.')) {
      return;
    }

    setIsClearing(true);
    try {
      toast.info('Creating backup before clearing...');
      
      const { data: allArticles, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .eq('vertical_slug', 'aerospace');

      if (fetchError) throw fetchError;

      const backupName = `aerospace_full_backup_${new Date().toISOString().split('T')[0]}`;
      const { data: { user } } = await supabase.auth.getUser();
      
      if (allArticles && allArticles.length > 0) {
        const backupData = allArticles.map(article => ({
          article_id: article.id,
          title: article.title,
          content: article.content,
          excerpt: article.excerpt,
          author: article.author,
          image_url: article.image_url,
          published_at: article.published_at,
          vertical_slug: article.vertical_slug,
          post_id: article.post_id,
          metadata: article.metadata,
          backup_name: backupName,
          backup_description: 'Full backup before clearing all aerospace data',
          created_by: user?.id
        }));

        const { error: backupError } = await supabase
          .from('article_backups')
          .insert(backupData);

        if (backupError) throw backupError;
      }

      toast.info('Backup created. Now clearing aerospace data...');

      const session = await supabase.auth.getSession();
      const { data: clearResult, error: clearError } = await supabase.functions.invoke('clear-aerospace-articles', {
        headers: {
          Authorization: `Bearer ${session.data.session?.access_token}`
        }
      });

      if (clearError) throw clearError;

      toast.success('All Aerospace data cleared successfully', {
        description: `✅ Backup preserved: ${backupName}\n✅ ${allArticles?.length || 0} articles can be restored`,
        duration: 10000
      });
      
      await loadAerospaceArticleCounts();
      await loadAerospaceStats();
    } catch (error) {
      console.error('Error clearing Aerospace data:', error);
      toast.error('Failed to clear Aerospace data', {
        description: error instanceof Error ? error.message : 'An error occurred'
      });
    } finally {
      setIsClearing(false);
    }
  };

  // Import aerospace with AI
  const importAerospaceWithAI = async () => {
    toast.info('Coming soon: Import with AI formatting');
  };

  const loadMetrics = async () => {
    // Placeholder for loading metrics
  };

  // Load stats on mount and set up auto-refresh
  useEffect(() => {
    loadAiJobStats();
    loadAerospaceStats();
    loadAerospaceArticleCounts();
    
    const interval = setInterval(() => {
      loadAiJobStats();
      loadAerospaceArticleCounts();
    }, 15000); // Changed from 5s to 15s to reduce flashing

    return () => clearInterval(interval);
  }, []);

  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">🚀 Aerospace Import & Processing</h1>
            <p className="text-muted-foreground">
              Dedicated dashboard for managing Aerospace vertical imports, AI processing, and source link backfill
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{aerospaceArticleCounts?.total.toLocaleString() || '0'}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">AI Processed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-500">
                  {aerospaceArticleCounts?.aiProcessed.toLocaleString() || '0'}
                </p>
                {aerospaceArticleCounts && aerospaceArticleCounts.total > 0 && (
                  <Progress 
                    value={(aerospaceArticleCounts.aiProcessed / aerospaceArticleCounts.total) * 100} 
                    className="mt-2 h-2"
                  />
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Missing Source Links</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-yellow-500">
                  {aerospaceStats.missingUrls.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Aerospace Statistics Dashboard */}
          <AerospaceStatsDashboard />
          
          {/* Aerospace Import Component */}
          <AerospaceImportComponent
            importing={importing}
            isClearing={isClearing}
            aerospaceProgress={aerospaceProgress}
            aerospaceImportTotals={aerospaceImportTotals}
            aerospaceArticleCounts={aerospaceArticleCounts}
            aerospaceStats={aerospaceStats}
            aiJobStats={aiJobStats}
            lastAiStatsUpdate={lastAiStatsUpdate}
            lastCountsUpdate={lastCountsUpdate}
            autoRestartEnabled={autoRestartEnabled}
            aiProcessingActive={aiProcessingActive}
            parallelChunksInProgress={parallelChunksInProgress}
            progressPercent={progressPercent}
            progressStatus={progressStatus}
            totalAiChunks={totalAiChunks}
            onImportStart={() => {
              setImporting('aerospace-fast');
              setProgressStatus('Starting Aerospace import...');
              setProgressPercent(0);
            }}
            onSetImporting={setImporting}
            onSetIsClearing={setIsClearing}
            onSetAiProcessingActive={setAiProcessingActive}
            onSetProgressPercent={setProgressPercent}
            onSetProgressStatus={setProgressStatus}
            onSetAutoRestartEnabled={setAutoRestartEnabled}
            onLoadMetrics={loadMetrics}
            onLoadAerospaceArticleCounts={loadAerospaceArticleCounts}
            onLoadAerospaceStats={loadAerospaceStats}
            onLoadAiJobStats={loadAiJobStats}
            onClearAllAerospaceData={clearAllAerospaceData}
            onHandleResetAerospaceAI={handleResetAerospaceAI}
            onImportAerospaceWithAI={importAerospaceWithAI}
          />

          {/* Aerospace URL Backfill */}
          <div className="mb-8">
            <AerospaceUrlBackfill />
          </div>

          {/* Import History - Filtered for Aerospace */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Import History (Aerospace Only)</CardTitle>
              <p className="text-sm text-muted-foreground">
                View all aerospace import sessions and their status
              </p>
            </CardHeader>
            <CardContent>
              <ImportHistoryTable />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AerospaceImport;
