import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { usePlatoVerticals } from '@/hooks/usePlatoVerticals';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Database, Zap, Download, Play, CheckCircle2, AlertCircle, Activity, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface VerticalStats {
  slug: string;
  name: string;
  beforeCount: number;
  currentCount: number;
  importing: boolean;
  aiProcessing: boolean;
  importComplete: boolean;
  aiComplete: boolean;
  importProgress?: {
    totalProcessed: number;
    importedCount: number;
    skippedCount: number;
    errorCount: number;
    currentPage: number;
  };
  duplicateOnlyMode?: boolean;
  lastImportedCount?: number;
  noChangeCounter?: number;
  stalled?: boolean;
  stalledPolls?: number;
  lastProgressSignature?: string;
}

interface GlobalStats {
  totalArticlesBefore: number;
  totalArticlesCurrent: number;
  verticalsImported: number;
  verticalsAIProcessed: number;
}

interface FeedHealth {
  slug: string;
  name: string;
  feedUrl: string;
  status: "online" | "offline" | "error";
  responseTime: number | null;
  httpStatus: number | null;
  error?: string;
  timestamp: string;
}

interface FeedHealthResponse {
  summary: {
    total: number;
    online: number;
    offline: number;
    error: number;
    checkDuration: number;
  };
  feeds: FeedHealth[];
  timestamp: string;
}

export default function BulkImportAdmin() {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminCheck();
  const { verticals, isLoading: verticalsLoading } = usePlatoVerticals();
  const [verticalStats, setVerticalStats] = useState<VerticalStats[]>([]);
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalArticlesBefore: 0,
    totalArticlesCurrent: 0,
    verticalsImported: 0,
    verticalsAIProcessed: 0
  });
  const [initializing, setInitializing] = useState(true);
  const [activeImportSlug, setActiveImportSlug] = useState<string | null>(null);
  const [feedHealth, setFeedHealth] = useState<FeedHealthResponse | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [showHealthDashboard, setShowHealthDashboard] = useState(false);
  const [cleaningCannabis, setCleaningCannabis] = useState(false);
  const [cannabisCleanupResult, setCannabisCleanupResult] = useState<{
    deletedCount: number;
    reformattedCount: number;
    skippedCount: number;
  } | null>(null);
  const [cannabisCleanupProgress, setCannabisCleanupProgress] = useState<{
    processed: number;
    total: number;
    reformatted: number;
    skipped: number;
    percent: number;
    message: string;
  } | null>(null);
  const [cannabisCleanupCheckpoint, setCannabisCleanupCheckpoint] = useState<{
    processed: number;
    batchIndex: number;
  } | null>(null);
  const [loadingCannabisCheckpoint, setLoadingCannabisCheckpoint] = useState(false);
  const [cannabisManualStartPage, setCannabisManualStartPage] = useState<number>(1);

  // Initialize stats on load
  useEffect(() => {
    if (verticals.length > 0 && initializing) {
      initializeStats();
    }
  }, [verticals]);

  // Auto-refresh feed health every 5 minutes if dashboard is visible
  useEffect(() => {
    if (!showHealthDashboard) return;
    
    checkFeedHealth(); // Initial check
    const interval = setInterval(() => {
      checkFeedHealth();
    }, 300000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [showHealthDashboard]);

  // Load cannabis cleanup resume checkpoint on mount
  useEffect(() => {
    loadCannabisCleanupCheckpoint();
  }, []);


  // Poll import_history for the active import to show realtime stats
  useEffect(() => {
    if (!activeImportSlug) return;

    const interval = setInterval(async () => {
      const { data, error } = await supabase
        .from('import_history')
        .select('total_processed, imported_count, skipped_count, error_count, status, started_at, metadata')
        .eq('vertical_slug', activeImportSlug)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching import progress:', error);
        return;
      }

      if (!data) return;

      setVerticalStats(prev =>
        prev.map(s => {
          if (s.slug !== activeImportSlug) return s;

          const isImporting = data.status === 'in_progress';
          const isCompleted = data.status === 'completed';

          const prevProgress = s.importProgress;
          const prevSignature = s.lastProgressSignature ?? '';
          const currentSignature = `${data.total_processed ?? 0}|${data.imported_count ?? 0}|${data.skipped_count ?? 0}|${data.error_count ?? 0}`;

          const hasAnyProgress = currentSignature !== prevSignature;
          const stalledPolls = hasAnyProgress ? 0 : (s.stalledPolls ?? 0) + 1;
          const stalled = stalledPolls >= 5; // ~15 seconds with no progress

          const previousImported = prevProgress?.importedCount ?? (data.imported_count ?? 0);
          const previousTotal = prevProgress?.totalProcessed ?? (data.total_processed ?? 0);

          const isDuplicateProgress =
            (data.imported_count ?? 0) === previousImported &&
            (data.total_processed ?? 0) > previousTotal;

          const noChangeCounter = isDuplicateProgress ? (s.noChangeCounter ?? 0) + 1 : 0;
          const duplicateOnlyMode = isDuplicateProgress && noChangeCounter >= 3;

          const meta = (data.metadata as any) || {};
          const lastProcessedPageRaw = meta?.lastProcessedPage;
          const lastProcessedPage = typeof lastProcessedPageRaw === 'number'
            ? lastProcessedPageRaw
            : lastProcessedPageRaw
              ? parseInt(String(lastProcessedPageRaw), 10) || null
              : null;

          const fallbackPage = Math.max(1, Math.ceil((data.total_processed ?? 0) / 10));
          const currentPage = lastProcessedPage ?? fallbackPage;

          return {
            ...s,
            // Keep importing=true while status is in_progress so the card can
            // clearly show a "stalled" state and keep the Fix Stuck button enabled.
            importing: isImporting,
            importComplete: isCompleted,
            importProgress: {
              totalProcessed: data.total_processed ?? 0,
              importedCount: data.imported_count ?? 0,
              skippedCount: data.skipped_count ?? 0,
              errorCount: data.error_count ?? 0,
              currentPage,
            },
            duplicateOnlyMode,
            lastImportedCount: data.imported_count ?? 0,
            noChangeCounter,
            stalled,
            stalledPolls,
            lastProgressSignature: currentSignature,
          };
        }),
      );

      if (['completed', 'failed', 'cancelled'].includes(data.status)) {
        setActiveImportSlug(null);
        updateCurrentCounts();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeImportSlug]);

  const initializeStats = async () => {
    setInitializing(true);
    
    // Sort verticals alphabetically
    const sortedVerticals = [...verticals].sort((a, b) => 
      a.name.localeCompare(b.name)
    );

    // Get current article counts for all verticals
    const statsPromises = sortedVerticals.map(async (v) => {
      const { count } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', v.slug);

      return {
        slug: v.slug,
        name: v.name,
        beforeCount: count || 0,
        currentCount: count || 0,
        importing: false,
        aiProcessing: false,
        importComplete: false,
        aiComplete: false
      };
    });

    const stats = await Promise.all(statsPromises);
    setVerticalStats(stats);

    const totalBefore = stats.reduce((sum, s) => sum + s.beforeCount, 0);
    setGlobalStats({
      totalArticlesBefore: totalBefore,
      totalArticlesCurrent: totalBefore,
      verticalsImported: 0,
      verticalsAIProcessed: 0
    });

    setInitializing(false);
  };

  const updateCurrentCounts = async () => {
    const updatedStats = await Promise.all(
      verticalStats.map(async (stat) => {
        const { count } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('vertical_slug', stat.slug);

        return {
          ...stat,
          currentCount: count || 0
        };
      })
    );

    setVerticalStats(updatedStats);

    const totalCurrent = updatedStats.reduce((sum, s) => sum + s.currentCount, 0);
    const imported = updatedStats.filter(s => s.importComplete).length;
    const aiProcessed = updatedStats.filter(s => s.aiComplete).length;

    setGlobalStats(prev => ({
      ...prev,
      totalArticlesCurrent: totalCurrent,
      verticalsImported: imported,
      verticalsAIProcessed: aiProcessed
    }));
  };

  const loadCannabisCleanupCheckpoint = async () => {
    try {
      setLoadingCannabisCheckpoint(true);
      const { data, error } = await supabase
        .from('import_history')
        .select('metadata')
        .eq('vertical_slug', 'cannabis')
        .eq('metadata->>operation', 'cleanup')
        .eq('status', 'in_progress')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading cannabis cleanup checkpoint:', error);
        setCannabisCleanupCheckpoint(null);
        return;
      }

      if (!data || !data.metadata) {
        setCannabisCleanupCheckpoint(null);
        return;
      }

      const metadata = data.metadata as any;
      const processedIds = Array.isArray(metadata.processedIds) ? metadata.processedIds : [];
      const processed = processedIds.length;
      const batchIndex = typeof metadata.lastBatchIndex === 'number' ? metadata.lastBatchIndex : 0;

      setCannabisCleanupCheckpoint({ processed, batchIndex });
    } catch (err) {
      console.error('Unexpected error loading cannabis cleanup checkpoint:', err);
      setCannabisCleanupCheckpoint(null);
    } finally {
      setLoadingCannabisCheckpoint(false);
    }
  };

  const handleImport = async (slug: string, resumeImportId?: string, manualStartPage?: number) => {
    setVerticalStats(prev =>
      prev.map(s =>
        s.slug === slug
          ? {
              ...s,
              importing: true,
              importComplete: false,
              importProgress: undefined,
              duplicateOnlyMode: false,
              lastImportedCount: 0,
              noChangeCounter: 0,
              stalled: false,
              stalledPolls: 0,
              lastProgressSignature: undefined,
            }
          : s,
      ),
    );

    // Track this slug as the active import for realtime polling
    setActiveImportSlug(slug);

    try {
      // Ensure we have a valid session before making the call
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Authentication required. Please log in again.');
      }

      toast.info(resumeImportId ? `Resuming import for ${slug}...` : manualStartPage && manualStartPage > 1 ? `Starting fast import for ${slug} from page ${manualStartPage}...` : `Starting fast import for ${slug}...`);

      const { data, error } = await supabase.functions.invoke(`import-${slug}-fast`, {
        body: { resumeImportId, manualStartPage },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        // Handle specific auth errors
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          throw new Error('Session expired. Please refresh the page and log in again.');
        }
        throw error;
      }

      // If the import returns but completed with errors, check the status
      if (data.importHistoryId) {
        setTimeout(async () => {
          const { data: historyCheck } = await supabase
            .from('import_history')
            .select('status, error_count, metadata')
            .eq('id', data.importHistoryId)
            .single();

          if (historyCheck?.status === 'failed') {
            const errorMsg = (historyCheck.metadata as any)?.errorMessage || 'Import failed';
            toast.error(`Import failed for ${slug}`, {
              description: errorMsg,
              duration: 8000
            });
            setVerticalStats(prev =>
              prev.map(s => s.slug === slug ? { ...s, importing: false, stalled: false } : s)
            );
            setActiveImportSlug(null);
          }
        }, 1500);
      }

      toast.success(resumeImportId ? `Import resumed for ${slug}!` : `Import started for ${slug}!`, {
        description: data.message,
        duration: 5000
      });
    } catch (error: any) {
      console.error(`Import error for ${slug}:`, error);
      toast.error(`Import failed for ${slug}`, {
        description: error.message || 'Unknown error'
      });
      
      setVerticalStats(prev =>
        prev.map(s => s.slug === slug ? { ...s, importing: false } : s)
      );
      
      setActiveImportSlug(null);
    }
  };

  const getLatestImportHistory = async (slug: string) => {
    const { data, error } = await supabase
      .from('import_history')
      .select('*')
      .eq('vertical_slug', slug)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching import history:', error);
      return null;
    }

    return data;
  };

  const handleFixStuck = async (slug: string) => {
    try {
      // Hard-stop: mark *all* in-progress imports for this vertical as cancelled/failed
      const { data: inProgress, error: fetchError } = await supabase
        .from('import_history')
        .select('*')
        .eq('vertical_slug', slug)
        .eq('status', 'in_progress');

      if (fetchError) {
        console.error('Error fetching in-progress imports:', fetchError);
        toast.error('Failed to check stuck imports', { description: fetchError.message });
        return;
      }

      if (!inProgress || inProgress.length === 0) {
        // No stuck imports in DB, but UI might be stuck - just clear the UI state
        toast.info(`No running imports found - clearing UI state for ${slug}`);
      } else {
        const nowIso = new Date().toISOString();
        
        // Update each in-progress import individually to preserve its metadata
        for (const row of inProgress) {
          await supabase
            .from('import_history')
            .update({
              status: 'failed',
              cancelled: true,
              completed_at: row.completed_at ?? nowIso,
              metadata: {
                ...(row.metadata as any ?? {}),
                failureReason: 'Import manually cancelled from Bulk Import Admin',
              },
            })
            .eq('id', row.id);
        }

        toast.success(`Stopped ${inProgress.length} running import(s) for ${slug}`, {
          description: 'Background tasks will wind down shortly.',
        });
      }

      // Always clear UI state for this vertical, regardless of DB state
      setActiveImportSlug(null);
      setVerticalStats(prev =>
        prev.map(s =>
          s.slug === slug
            ? {
                ...s,
                importing: false,
                importComplete: false,
                importProgress: undefined,
                duplicateOnlyMode: false,
                stalled: false,
                stalledPolls: 0,
                lastProgressSignature: undefined,
              }
            : s,
        ),
      );
    } catch (error: any) {
      console.error('Error fixing stuck import:', error);
      toast.error('Failed to fix stuck import', {
        description: error.message || 'Unknown error',
      });
    }
  };

  const checkFeedHealth = async () => {
    setCheckingHealth(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Authentication required. Please log in again.');
      }

      const { data, error } = await supabase.functions.invoke('check-feed-health', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          throw new Error('Session expired. Please refresh the page and log in again.');
        }
        throw error;
      }

      setFeedHealth(data);
      toast.success('Feed health check complete', {
        description: `${data.summary.online} online, ${data.summary.offline + data.summary.error} unavailable`,
        duration: 3000
      });
    } catch (error: any) {
      console.error('Feed health check error:', error);
      toast.error('Failed to check feed health', {
        description: error.message || 'Unknown error'
      });
    } finally {
      setCheckingHealth(false);
    }
  };

  const handleClearCannabisArticles = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to DELETE ALL cannabis articles and import history? This action cannot be undone!'
    );

    if (!confirmed) return;

    try {
      toast.info('Deleting all cannabis articles...', {
        description: 'This may take a moment',
        duration: 3000
      });

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Authentication required');
      }

      const { data, error } = await supabase.functions.invoke('clear-cannabis-articles', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      toast.success('Cannabis articles cleared!', {
        description: `Deleted ${data.deletedCount} articles`,
        duration: 5000
      });

      // Refresh the stats
      await updateCurrentCounts();
    } catch (error: any) {
      console.error('Clear cannabis articles error:', error);
      toast.error('Failed to clear cannabis articles', {
        description: error.message || 'Unknown error'
      });
    }
  };

  const handleCleanCannabisArticles = async () => {
    setCleaningCannabis(true);
    setCannabisCleanupResult(null);
    setCannabisCleanupProgress(null);
    
    try {
      toast.info('Starting Cannabis articles cleanup...', {
        description: 'This will delete garbage articles and reformat articles without headers',
        duration: 5000
      });

      // Stream the cleanup progress
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cleanup-cannabis-articles`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        }
      );

      if (!response.ok || !response.body) {
        throw new Error('Failed to start cleanup stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        // Process line-by-line
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          
          try {
            const parsed = JSON.parse(jsonStr);
            
            if (parsed.type === 'progress') {
              setCannabisCleanupProgress({
                processed: parsed.processed,
                total: parsed.total,
                reformatted: parsed.reformatted,
                skipped: parsed.skipped,
                percent: parsed.percent,
                message: parsed.message
              });
            } else if (parsed.type === 'complete') {
              setCannabisCleanupResult({
                deletedCount: parsed.deletedCount || 0,
                reformattedCount: parsed.reformattedCount || 0,
                skippedCount: parsed.skippedCount || 0
              });

              toast.success('Cannabis articles cleanup complete!', {
                description: parsed.message,
                duration: 8000
              });

              // Refresh the cannabis article count
              updateCurrentCounts();
            } else if (parsed.type === 'error') {
              throw new Error(parsed.error || 'Cleanup failed');
            }
          } catch (parseError) {
            console.error('Error parsing progress:', parseError);
          }
        }
      }
    } catch (error: any) {
      console.error('Cannabis cleanup error:', error);
      toast.error('Cannabis cleanup failed', {
        description: error.message || 'Unknown error',
        duration: 8000
      });
    } finally {
      setCleaningCannabis(false);
      setCannabisCleanupProgress(null);
      loadCannabisCleanupCheckpoint();
    }
  };

  const handleAIProcessing = async (slug: string) => {
    setVerticalStats(prev =>
      prev.map(s => s.slug === slug ? { ...s, aiProcessing: true } : s)
    );

    try {
      // Ensure we have a valid session before making the call
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Authentication required. Please log in again.');
      }

      toast.info(`Starting AI processing for ${slug}...`);

      const { data, error } = await supabase.functions.invoke('start-ai-processing', {
        body: { 
          verticalSlug: slug,
          fastMode: false,
          skipTags: false
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        // Handle specific auth errors
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          throw new Error('Session expired. Please refresh the page and log in again.');
        }
        throw error;
      }

      toast.success(`AI processing started for ${slug}!`, {
        description: `Processing ${data.articlesToProcess || 0} articles`,
        duration: 5000
      });

      setVerticalStats(prev =>
        prev.map(s => s.slug === slug 
          ? { ...s, aiProcessing: false, aiComplete: true } 
          : s
        )
      );
    } catch (error: any) {
      console.error(`AI processing error for ${slug}:`, error);
      toast.error(`AI processing failed for ${slug}`, {
        description: error.message || 'Unknown error'
      });
      
      setVerticalStats(prev =>
        prev.map(s => s.slug === slug ? { ...s, aiProcessing: false } : s)
      );
    }
  };

  if (loading || verticalsLoading || initializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const progressPercent = globalStats.totalArticlesBefore > 0
    ? ((globalStats.totalArticlesCurrent - globalStats.totalArticlesBefore) / globalStats.totalArticlesBefore) * 100
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Bulk Import Dashboard</h1>
          <p className="text-muted-foreground">
            Import and process all verticals from Platodata.ai
          </p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Database className="h-4 w-4" />
                Articles Before
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{globalStats.totalArticlesBefore.toLocaleString()}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Download className="h-4 w-4" />
                Articles Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {globalStats.totalArticlesCurrent.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                +{(globalStats.totalArticlesCurrent - globalStats.totalArticlesBefore).toLocaleString()} imported
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Imported
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {globalStats.verticalsImported}/{verticalStats.length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="h-4 w-4" />
                AI Processed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">
                {globalStats.verticalsAIProcessed}/{verticalStats.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cannabis Cleanup Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  <CardTitle className="text-lg">Cannabis Articles Cleanup</CardTitle>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {loadingCannabisCheckpoint
                    ? 'Checking for existing cleanup job...'
                    : cannabisCleanupCheckpoint
                      ? `Resume checkpoint: batch ${cannabisCleanupCheckpoint.batchIndex + 1} (~${cannabisCleanupCheckpoint.processed.toLocaleString()} articles processed)`
                      : 'No in-progress cleanup job detected. Next run will start from the beginning.'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCleanCannabisArticles}
                  disabled={cleaningCannabis}
                  variant="destructive"
                  size="sm"
                >
                  {cleaningCannabis ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cleaning...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clean Cannabis Articles
                    </>
                  )}
                </Button>
                {cleaningCannabis && (
                  <Button
                    onClick={async () => {
                      try {
                        await supabase.functions.invoke('cleanup-cannabis-articles', {
                          body: { action: 'cancel' }
                        });
                        setCleaningCannabis(false);
                        toast.success("Cleanup cancelled");
                        loadCannabisCleanupCheckpoint();
                      } catch (error) {
                        console.error('Error cancelling cleanup:', error);
                        toast.error("Failed to cancel cleanup");
                      }
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Stop Cleanup
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          {(cannabisCleanupProgress || cannabisCleanupResult) && (
            <CardContent>
              {cannabisCleanupProgress && cleaningCannabis && (
                <div className="mb-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{cannabisCleanupProgress.message}</span>
                    <span className="text-muted-foreground">{cannabisCleanupProgress.percent}%</span>
                  </div>
                  <Progress value={cannabisCleanupProgress.percent} className="h-2" />
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Processed:</span>
                      <p className="font-semibold tabular-nums">{cannabisCleanupProgress.processed.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total:</span>
                      <p className="font-semibold tabular-nums">{cannabisCleanupProgress.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-blue-600">Reformatted:</span>
                      <p className="font-semibold text-blue-600 tabular-nums">{cannabisCleanupProgress.reformatted.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-green-600">Skipped:</span>
                      <p className="font-semibold text-green-600 tabular-nums">{cannabisCleanupProgress.skipped.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {cannabisCleanupResult && !cleaningCannabis && (
                <div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-red-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{cannabisCleanupResult.deletedCount}</p>
                      <p className="text-xs text-muted-foreground">Garbage Deleted</p>
                    </div>
                    <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{cannabisCleanupResult.reformattedCount}</p>
                      <p className="text-xs text-muted-foreground">Reformatted</p>
                    </div>
                    <div className="text-center p-3 bg-green-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{cannabisCleanupResult.skippedCount}</p>
                      <p className="text-xs text-muted-foreground">Already Good</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    Cleanup removes empty articles and adds headers to articles missing them
                  </p>
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Feed Health Dashboard */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                <CardTitle className="text-lg">Feed Health Status</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowHealthDashboard(!showHealthDashboard)}
                  variant="outline"
                  size="sm"
                >
                  {showHealthDashboard ? 'Hide' : 'Show'} Health Dashboard
                </Button>
                <Button
                  onClick={checkFeedHealth}
                  disabled={checkingHealth}
                  variant="default"
                  size="sm"
                >
                  {checkingHealth ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Check All Feeds
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          {showHealthDashboard && feedHealth && (
            <CardContent>
              {/* Summary */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">{feedHealth.summary.total}</p>
                  <p className="text-xs text-muted-foreground">Total Feeds</p>
                </div>
                <div className="text-center p-3 bg-green-500/10 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{feedHealth.summary.online}</p>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
                <div className="text-center p-3 bg-red-500/10 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{feedHealth.summary.offline}</p>
                  <p className="text-xs text-muted-foreground">Offline</p>
                </div>
                <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{feedHealth.summary.error}</p>
                  <p className="text-xs text-muted-foreground">Error</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-4">
                Last checked: {new Date(feedHealth.timestamp).toLocaleString()} • 
                Check duration: {(feedHealth.summary.checkDuration / 1000).toFixed(1)}s
              </p>

              {/* Feed List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {feedHealth.feeds.map((feed) => (
                  <div
                    key={feed.slug}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      feed.status === 'online'
                        ? 'bg-green-500/5 border-green-500/20'
                        : feed.status === 'offline'
                        ? 'bg-red-500/5 border-red-500/20'
                        : 'bg-yellow-500/5 border-yellow-500/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          feed.status === 'online'
                            ? 'bg-green-500'
                            : feed.status === 'offline'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        } animate-pulse`}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{feed.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-md">
                          {feed.feedUrl}
                        </p>
                        {feed.error && (
                          <p className="text-xs text-red-600 mt-1">{feed.error}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {feed.httpStatus && (
                        <Badge variant={feed.status === 'online' ? 'default' : 'destructive'}>
                          {feed.httpStatus}
                        </Badge>
                      )}
                      {feed.responseTime !== null && (
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {feed.responseTime}ms
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Progress Bar */}
        {progressPercent > 0 && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Overall Progress</span>
                  <span className="text-muted-foreground">{progressPercent.toFixed(1)}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verticals Grid */}
        <div className="grid grid-cols-1 gap-4">
          {verticalStats.map((stat) => (
            <Card key={stat.slug}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{stat.name}</CardTitle>
                    {stat.importComplete && (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Imported
                      </Badge>
                    )}
                    {stat.aiComplete && (
                      <Badge variant="secondary" className="gap-1">
                        <Zap className="h-3 w-3" />
                        AI Done
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Before: <span className="font-semibold">{stat.beforeCount.toLocaleString()}</span>
                    </span>
                    <span className="text-sm text-muted-foreground">→</span>
                    <span className="text-sm font-semibold text-green-600">
                      Now: {stat.currentCount.toLocaleString()}
                    </span>
                    {stat.currentCount > stat.beforeCount && (
                      <Badge variant="outline" className="text-xs">
                        +{(stat.currentCount - stat.beforeCount).toLocaleString()}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Import Progress Details - Show if progress exists */}
                {stat.importProgress && (
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Import Progress</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          Page {stat.importProgress.currentPage}
                          {stat.importing && !stat.stalled && (
                            <span
                              className="ml-1 inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"
                              title="Live updates active"
                            />
                          )}
                        </span>
                        {stat.importing && (
                          <Loader2
                            className={`h-3 w-3 ${stat.stalled
                              ? 'text-destructive animate-pulse'
                              : stat.duplicateOnlyMode
                                ? 'text-blue-600 animate-spin'
                                : 'text-primary animate-spin'
                            }`}
                          />
                        )}
                      </div>
                    </div>
                    
                    {/* Live update timestamp */}
                    {stat.importing && !stat.stalled && (
                      <div className="text-[10px] text-muted-foreground/70 italic flex items-center gap-1">
                        <span className="inline-block w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                        Live • Updates every 3s • {new Date().toLocaleTimeString()}
                      </div>
                    )}
                    
                    {/* Duplicate-only mode alert */}
                    {stat.duplicateOnlyMode && stat.importing && !stat.stalled && (
                      <div className="flex items-center gap-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs">
                        <AlertCircle className="h-3 w-3 text-blue-600 flex-shrink-0" />
                        <span className="text-blue-600 font-medium">
                          Processing duplicates - will continue to find new articles (don't stop!)
                        </span>
                      </div>
                    )}

                    {/* Stalled import alert */}
                    {stat.stalled && stat.importing && (
                      <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs">
                        <AlertCircle className="h-3 w-3 text-destructive flex-shrink-0" />
                        <span className="text-destructive font-medium">
                          No progress for ~{(stat.stalledPolls ?? 0) * 3}s – import may be stalled. You can use "Fix Stuck" to stop this run.
                        </span>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Processed:</span>
                        <p className="font-semibold tabular-nums">{stat.importProgress.totalProcessed.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-green-600">Imported:</span>
                        <p className="font-semibold text-green-600 tabular-nums">{stat.importProgress.importedCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-yellow-600">Skipped:</span>
                        <p className="font-semibold text-yellow-600 tabular-nums">{stat.importProgress.skippedCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-red-600">Errors:</span>
                        <p className="font-semibold text-red-600 tabular-nums">{stat.importProgress.errorCount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cannabis manual start page input */}
                {stat.slug === 'cannabis' && !stat.importing && !stat.importComplete && (
                  <div className="mb-3 flex items-center gap-2">
                    <label htmlFor="cannabis-start-page" className="text-sm text-muted-foreground whitespace-nowrap">
                      Start from page:
                    </label>
                    <input
                      id="cannabis-start-page"
                      type="number"
                      min="1"
                      value={cannabisManualStartPage}
                      onChange={(e) => setCannabisManualStartPage(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-24 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="1"
                    />
                    <span className="text-xs text-muted-foreground">(default: auto-resume or 1)</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleImport(stat.slug, undefined, stat.slug === 'cannabis' ? cannabisManualStartPage : undefined)}
                    disabled={stat.importing || stat.importComplete}
                    variant="default"
                    size="sm"
                    className="flex-1"
                  >
                    {stat.importing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : stat.importComplete ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Import Complete
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Start Import
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={async () => {
                      const history = await getLatestImportHistory(stat.slug);
                      if (history?.id) {
                        // Immediately show the latest known progress on this card
                        setVerticalStats(prev =>
                          prev.map(s =>
                            s.slug === stat.slug
                              ? (() => {
                                  const meta = (history.metadata as any) || {};
                                  const lastProcessedPageRaw = meta?.lastProcessedPage;
                                  const lastProcessedPage = typeof lastProcessedPageRaw === 'number'
                                    ? lastProcessedPageRaw
                                    : lastProcessedPageRaw
                                      ? parseInt(String(lastProcessedPageRaw), 10) || null
                                      : null;

                                  const fallbackPage = Math.max(1, Math.ceil((history.total_processed ?? 0) / 10));
                                  const currentPage = lastProcessedPage ?? fallbackPage;

                                  return {
                                    ...s,
                                    importing: history.status === 'in_progress',
                                    importComplete: history.status === 'completed',
                                    importProgress: {
                                      totalProcessed: history.total_processed ?? 0,
                                      importedCount: history.imported_count ?? 0,
                                      skippedCount: history.skipped_count ?? 0,
                                      errorCount: history.error_count ?? 0,
                                      currentPage,
                                    },
                                    duplicateOnlyMode: false,
                                    lastImportedCount: history.imported_count ?? 0,
                                    noChangeCounter: 0,
                                  };
                                })()
                              : s,
                          ),
                        );

                        setActiveImportSlug(stat.slug);
                        toast.info(`Tracking latest import for ${stat.slug}...`);
                      } else {
                        toast.error('No import history found to resume');
                      }
                    }}
                    disabled={stat.importing}
                    variant="outline"
                    size="sm"
                  >
                    Resume
                  </Button>

                  <Button
                    onClick={() => handleFixStuck(stat.slug)}
                    disabled={!stat.importing}
                    variant="destructive"
                    size="sm"
                    title={stat.duplicateOnlyMode ? "Import is finding duplicates but making progress - let it continue to reach new articles" : "Stop stuck import"}
                  >
                    Fix Stuck
                  </Button>

                  <Button
                    onClick={() => handleAIProcessing(stat.slug)}
                    disabled={!stat.importComplete || stat.aiProcessing || stat.aiComplete}
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                  >
                    {stat.aiProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : stat.aiComplete ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        AI Complete
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start AI Processing
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
