import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePlatoVerticals } from "@/hooks/usePlatoVerticals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowUpDown, Search, Database, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DuplicateMonitor } from "@/components/DuplicateMonitor";
import { AerospaceImport } from "@/components/admin/AerospaceImport";
import { AerospaceStatsDashboard } from "@/components/AerospaceStatsDashboard";
import { ImportHistoryTable } from "@/components/ImportHistoryTable";
import { AerospaceUrlBackfill } from "@/components/AerospaceUrlBackfill";

const ImportAdmin = () => {
  const navigate = useNavigate();
  const [importing, setImporting] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, any>>({});
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [totalArticles, setTotalArticles] = useState(0);
  const [sortBy, setSortBy] = useState<'name' | 'count'>('count');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTestVertical, setSelectedTestVertical] = useState<string>('');
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [liveImportResults, setLiveImportResults] = useState<Array<{
    vertical: string;
    count: number;
    status: 'importing' | 'success' | 'error';
    timestamp: Date;
  }>>([]);
  const [currentVertical, setCurrentVertical] = useState<string>('');
  const [runningTotal, setRunningTotal] = useState(0);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [sessionArticlesImported, setSessionArticlesImported] = useState(0);
  const [importStartTime, setImportStartTime] = useState<Date | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
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
  const [aiProcessingJobId, setAiProcessingJobId] = useState<string | null>(null);
  const [totalAiChunks, setTotalAiChunks] = useState<number>(0);
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
  const [testingImport, setTestingImport] = useState(false);
  const [autoRestartEnabled, setAutoRestartEnabled] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
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
  const [arvrStats, setArvrStats] = useState<{
    total: number;
    aiProcessed: number;
    remaining: number;
    jobId: string | null;
    status: string | null;
    progressPercent: number;
    loading: boolean;
  }>({
    total: 0,
    aiProcessed: 0,
    remaining: 0,
    jobId: null,
    status: null,
    progressPercent: 0,
    loading: false
  });
  const { verticals, isLoading: verticalsLoading } = usePlatoVerticals();
  
  // Load AR/VR article counts and AI job stats
  const loadArvrStats = async () => {
    setArvrStats(prev => ({ ...prev, loading: true }));
    
    try {
      // Get total AR/VR articles
      const { count: total, error: totalError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', 'ar-vr')
        .not('content', 'is', null);

      if (totalError) throw totalError;

      // Get AI-processed count
      const { count: processed, error: processedError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', 'ar-vr')
        .not('content', 'is', null)
        .eq('metadata->>ai_processed', 'true');

      if (processedError) throw processedError;

      // Get latest AI job
      const { data: job, error: jobError } = await supabase
        .from('ai_processing_jobs')
        .select('*')
        .eq('vertical_slug', 'ar-vr')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (jobError) throw jobError;

      let progressPercent = 0;
      if (job && job.total_chunks > 0) {
        const processedChunks = Array.from(new Set(job.processed_chunks || [])).length;
        progressPercent = Math.round((processedChunks / job.total_chunks) * 100);
      }

      setArvrStats({
        total: total || 0,
        aiProcessed: processed || 0,
        remaining: (total || 0) - (processed || 0),
        jobId: job?.id || null,
        status: job?.status || null,
        progressPercent,
        loading: false
      });
    } catch (error) {
      console.error('Error loading AR/VR stats:', error);
      setArvrStats(prev => ({ ...prev, loading: false }));
    }
  };

  // Start AR/VR AI processing
  const handleStartArvrAiProcessing = async () => {
    try {
      toast.info('Starting AR/VR AI processing...');
      setImporting('ar-vr-ai');
      
      const { data, error } = await supabase.functions.invoke('start-ai-processing', {
        body: { verticalSlug: 'ar-vr' }
      });
      
      if (error) throw error;
      
      toast.success('AR/VR AI processing started!', {
        description: `Processing ${data.totalArticles} articles in ${data.totalChunks} chunks`,
        duration: 5000
      });
      
      // Refresh stats
      await loadArvrStats();
    } catch (error) {
      toast.error('Failed to start AR/VR AI processing', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setImporting(null);
    }
  };

  const handleResumeArvrAiProcessing = async () => {
    try {
      toast.info('Resuming AR/VR AI processing...');
      setImporting('ar-vr-ai');
      
      // Get the current job
      const { data: jobs, error: jobError } = await supabase
        .from('ai_processing_jobs')
        .select('*')
        .eq('vertical_slug', 'ar-vr')
        .order('started_at', { ascending: false })
        .limit(1);

      if (jobError) throw jobError;

      if (!jobs || jobs.length === 0) {
        toast.info('No existing job found, starting fresh...');
        await handleStartArvrAiProcessing();
        return;
      }

      const job = jobs[0];

      // Process remaining unprocessed articles in small batches starting from the beginning
      // We ignore chunk indexes here because the dataset of unprocessed articles keeps shrinking.
      let safetyCounter = 0;
      const MAX_BATCHES = 200; // hard safety limit

      while (safetyCounter < MAX_BATCHES) {
        safetyCounter++;

        const { data, error } = await supabase.functions.invoke('format-all-articles', {
          body: {
            // Use default chunkIndex = 0 inside the function
            chunkSize: 50,
            verticalSlug: 'ar-vr',
            jobId: job.id
          }
        });

        if (error) {
          console.error('Error invoking format-all-articles for AR/VR:', error);
          break;
        }

        // When there are no more articles to process, the function returns processed: 0
        if (!data || (typeof data.processed === 'number' && data.processed === 0)) {
          break;
        }

        // Refresh stats between batches so the UI updates progressively
        await loadArvrStats();

        // Small delay between batches to avoid overwhelming the system / AI gateway
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      // Try to mark the job as completed (ignore errors, since RLS might block this for non-service roles)
      await supabase
        .from('ai_processing_jobs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', job.id);

      await loadArvrStats();

      toast.success('AR/VR AI processing resume cycle finished.', {
        description: 'If remaining is still > 0, some articles may have failed individual processing.',
        duration: 6000,
      });
    } catch (error) {
      console.error('Failed to resume AR/VR AI processing:', error);
      toast.error('Failed to resume AR/VR AI processing', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setImporting(null);
    }
  };

  // Load aerospace article counts - FOR AEROSPACE VERTICAL
  const loadAerospaceArticleCounts = async () => {
    try {
      // Get total aerospace articles
      const { count: total, error: totalError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', 'aerospace')
        .not('content', 'is', null);

      if (totalError) throw totalError;

      // Get AI-processed count
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
      
      // Check if progress is stalled (no change in 10 minutes) and auto-restart
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

  
  // Derived import rate (articles per second)
  const importRate =
    sessionDuration > 0
      ? Math.round(sessionArticlesImported / sessionDuration)
      : 0;

  // Load AI processing job stats on mount and refresh
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
        // Deduplicate and clamp processed chunk indexes so we never exceed totalChunks
        const validProcessed = rawProcessed.filter((i) => i >= 0 && i < totalChunks);
        const processedCount = Array.from(new Set(validProcessed)).length;
        const failedCount = (job.failed_chunks || []).length;
        const rawProgressPercent = totalChunks > 0 ? Math.round((processedCount / totalChunks) * 100) : 0;
        const progressPercent = Math.max(0, Math.min(100, rawProgressPercent));
        
        // Calculate time estimates
        const startTime = new Date(job.started_at);
        const now = new Date();
        const elapsedMinutes = (now.getTime() - startTime.getTime()) / 1000 / 60;
        const articlesProcessed = processedCount * 50; // 50 articles per chunk
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
        
        setAiProcessingJobId(job.id);
        setTotalAiChunks(totalChunks);
        setLastAiStatsUpdate(new Date());
      } else {
        setAiJobStats(null);
      }
    } catch (error) {
      console.error('Error loading AI job stats:', error);
    }
  };

  // Load aerospace stats - FOR AEROSPACE VERTICAL
  const loadAerospaceStats = async () => {
    setAerospaceStats(prev => ({ ...prev, loading: true }));
    
    try {
      // Get total aerospace articles in DB
      const { count: totalInDb } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', 'aerospace');
      
      // Get count of aerospace articles missing URLs or with Plato URLs
      const { count: missingUrls } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', 'aerospace')
        .or('external_url.is.null,external_url.ilike.%platodata.ai%');
      
      // Try to estimate total from Plato AI (first page to check if we can get count)
      let platoTotal: number | null = null;
      try {
        const { data: feedData } = await supabase.functions.invoke('fetch-aerospace-feed', {
          body: { page: 1 }
        });
        
        // If the response has pagination info, calculate total
        if (feedData?.count) {
          platoTotal = feedData.count;
        } else if (feedData?.results && Array.isArray(feedData.results)) {
          // If no count but we have results, we can at least show we have data
          platoTotal = feedData.results.length; // This is just page 1, actual total is unknown
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
      toast.info('Resetting aerospace AI processing...');
      setImporting('reset-aerospace-ai');
      
      const { data, error } = await supabase.functions.invoke('reset-aerospace-ai');
      
      if (error) throw error;
      
      toast.success('Aerospace AI processing reset and restarted!', {
        description: `Job ID: ${data.jobId} | ${data.totalChunks} chunks to process`,
        duration: 5000
      });
      
      // Refresh stats
      await loadAiJobStats();
      await loadAerospaceArticleCounts();
    } catch (error) {
      toast.error('Failed to reset aerospace AI processing', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setImporting(null);
    }
  };


  // Load aerospace stats on mount and set up auto-refresh
  useEffect(() => {
    loadAiJobStats();
    loadAerospaceStats();
    loadAerospaceArticleCounts();
    loadArvrStats();
    
    const interval = setInterval(() => {
      loadAiJobStats();
      loadAerospaceArticleCounts();
      loadArvrStats();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Real-time updates for aerospace articles
  useEffect(() => {
    const channel = supabase
      .channel('aerospace-articles-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'articles',
          filter: 'vertical_slug=eq.aerospace'
        },
        () => {
          // Reload counts when any aerospace article is updated
          loadAerospaceArticleCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Real-time updates for AR/VR articles
  useEffect(() => {
    const channel = supabase
      .channel('arvr-articles-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'articles',
          filter: 'vertical_slug=eq.ar-vr'
        },
        () => {
          loadArvrStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Session timer
  useEffect(() => {
    if (!importStartTime) return;

    const interval = setInterval(() => {
      setSessionDuration(
        Math.floor((Date.now() - importStartTime.getTime()) / 1000)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [importStartTime]);
  
  // Real-time subscription for article inserts (updates totals + last updated time)
  useEffect(() => {
    loadMetrics();

    // Set up real-time subscription for article changes
    console.log("Setting up real-time subscription for articles...");
    const channel = supabase
      .channel("article-imports", {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "articles",
        },
        (payload) => {
          console.log("🔴 Real-time: New article inserted!", payload);
          setLastUpdateTime(new Date());
          
          // Increment session counter for every article insert
          setSessionArticlesImported(prev => {
            const newCount = prev + 1;
            console.log("📈 Session counter updated:", newCount);
            return newCount;
          });
          
          // Auto-start timer if not already started
          setImportStartTime(prev => {
            if (!prev) {
              console.log("⏱️ Starting session timer");
              return new Date();
            }
            return prev;
          });
          
          // Refresh metrics when articles are inserted
          loadMetrics();
        }
      )
      .subscribe((status) => {
        console.log("Real-time subscription status:", status);
        if (status === "SUBSCRIBED") {
          setRealtimeConnected(true);
          console.log("✅ Real-time updates active for articles");
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          setRealtimeConnected(false);
          console.log("❌ Real-time subscription error:", status);
        }
      });

    return () => {
      console.log("Cleaning up real-time subscription");
      supabase.removeChannel(channel);
      setRealtimeConnected(false);
    };
  }, []);
  
  // Real-time subscription for aerospace import history (drives live stats even when rows are skipped)
  useEffect(() => {
    console.log('Setting up real-time subscription for aerospace import_history...');
    const historyChannel = supabase
      .channel('aerospace-import-history')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'import_history',
        },
        (payload: any) => {
          const row = payload.new;
          if (!row || row.vertical_slug !== 'aerospace') return;

          const meta = row.metadata || {};
          const totalProcessed = row.total_processed ?? 0;

          setAerospaceImportTotals({
            imported: row.imported_count ?? 0,
            skipped: row.skipped_count ?? 0,
            totalProcessed,
            lastPage: meta.lastProcessedPage ?? meta.currentPage ?? null,
            status: row.status ?? 'unknown',
          });

          // Keep the big "Articles This Session" number in sync with aerospace processing
          setSessionArticlesImported(totalProcessed);
        }
      )
      .subscribe((status) => {
        console.log('Aerospace import_history realtime status:', status);
      });

    return () => {
      console.log('Cleaning up aerospace import_history subscription');
      supabase.removeChannel(historyChannel);
    };
  }, []);
  const loadMetrics = async () => {
    try {
      // Get total articles count
      const { count: total } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });
      
      setTotalArticles(total || 0);
      
      // Get article counts per vertical using the database function
      const { data: verticalCounts, error } = await supabase
        .rpc('get_vertical_article_counts');
      
      if (error) {
        console.error('Error fetching vertical counts:', error);
      } else if (verticalCounts) {
        const counts: Record<string, number> = {};
        verticalCounts.forEach((item: { vertical_slug: string; article_count: number }) => {
          counts[item.vertical_slug] = item.article_count;
        });
        setMetrics(counts);
        console.log('Loaded metrics:', counts);
      }

      // Load latest aerospace import summary to drive live stats
      const { data: latestAero, error: aeroError } = await supabase
        .from('import_history')
        .select('imported_count, skipped_count, total_processed, status, metadata')
        .eq('vertical_slug', 'aerospace')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (aeroError) {
        console.error('Error fetching aerospace import summary:', aeroError);
      } else if (latestAero) {
        const anyAero = latestAero as any;
        const meta = anyAero.metadata || {};
        const totalProcessed = anyAero.total_processed ?? 0;
        setAerospaceImportTotals({
          imported: anyAero.imported_count ?? 0,
          skipped: anyAero.skipped_count ?? 0,
          totalProcessed,
          lastPage: meta.lastProcessedPage ?? meta.currentPage ?? null,
          status: anyAero.status ?? 'unknown',
        });
        // Use total processed to keep the session articles number moving with imports
        setSessionArticlesImported(totalProcessed);
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  // Prepare verticals with their article counts
  const verticalsWithCounts = verticals.map(v => ({
    ...v,
    articleCount: metrics[v.slug] || 0
  }));

  // Filter by search query
  const filteredVerticals = verticalsWithCounts.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort verticals
  const sortedVerticals = [...filteredVerticals].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortOrder === 'asc'
        ? a.articleCount - b.articleCount
        : b.articleCount - a.articleCount;
    }
  });

  const toggleSort = (column: 'name' | 'count') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const importAndProcessAll = async () => {
    setImporting('all-verticals');
    setProgressStatus('Initializing...');
    setProgressPercent(0);
    setLiveImportResults([]);
    setRunningTotal(0);
    setCurrentVertical('');
    
    // Only reset stats if this is a fresh start (no import time set)
    if (!importStartTime) {
      setSessionArticlesImported(0);
      setImportStartTime(new Date());
      setSessionDuration(0);
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Authentication required');
        return;
      }

      toast.info('Starting import of all verticals...', {
        description: 'Importing one vertical at a time'
      });

      // Get all verticals that have articles to import
      const allVerticals = [
        'aerospace', 'artificial-intelligence', 'ar-vr', 'autism', 'automotive',
        'aviation', 'big-data', 'biotech', 'cannabis', 'carbon', 'cleantech',
        'clinical-trials', 'code', 'crowdfunding', 'blockchain', 'cyber-security',
        'defense', 'ecommerce', 'edtech', 'energy', 'esg', 'esports', 'finance',
        'financefeeds', 'fintech', 'forex', 'gaming', 'hydrogen', 'iot',
        'medical-devices', 'music', 'nano-technology', 'nfts', 'patents',
        'payments', 'private-equity', 'psychedelics', 'quantum', 'real-estate',
        'saas', 'semiconductor', 'seo', 'solar', 'spacs', 'startups',
        'stem-cell', 'supply-chain', 'trading', 'venture-capital', 'waste-management'
      ];

      let totalImported = 0;
      let completed = 0;

      for (const verticalSlug of allVerticals) {
        try {
          // Mark vertical as currently importing
          setCurrentVertical(verticalSlug);
          setProgressStatus(`Importing ${verticalSlug}... (${completed + 1}/${allVerticals.length})`);
          setProgressPercent(Math.floor((completed / allVerticals.length) * 100));
          
          // Add to live results as "importing"
          setLiveImportResults(prev => [...prev, {
            vertical: verticalSlug,
            count: 0,
            status: 'importing',
            timestamp: new Date()
          }]);

          const { data, error } = await supabase.functions.invoke('import-articles', {
            body: { 
              vertical: verticalSlug
            },
            headers: {
              Authorization: `Bearer ${session.access_token}`
            }
          });

          if (error) {
            console.error(`Error importing ${verticalSlug}:`, error);
            // Update to error status
            setLiveImportResults(prev => prev.map(item => 
              item.vertical === verticalSlug 
                ? { ...item, status: 'error' as const, timestamp: new Date() }
                : item
            ));
            toast.error(`Failed to import ${verticalSlug}`);
          } else if (data) {
            const importedCount = data.insertedArticles || 0;
            totalImported += importedCount;
            
            // Update running total in real-time
            setRunningTotal(totalImported);

            // Update session stats
            setSessionArticlesImported(prev => prev + importedCount);
            
            // Update to success with count
            setLiveImportResults(prev => prev.map(item => 
              item.vertical === verticalSlug 
                ? { ...item, count: importedCount, status: 'success' as const, timestamp: new Date() }
                : item
            ));
            
            console.log(`Imported ${importedCount} articles from ${verticalSlug}`);
          }

          completed++;
        } catch (error) {
          console.error(`Exception importing ${verticalSlug}:`, error);
          // Update to error status
          setLiveImportResults(prev => prev.map(item => 
            item.vertical === verticalSlug 
              ? { ...item, status: 'error' as const, timestamp: new Date() }
              : item
          ));
        }

        // Small delay between imports to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      setCurrentVertical('');

      setProgressPercent(100);
      setProgressStatus(`Completed! Imported ${totalImported} total articles`);
      
      // Store results for display
      setResults(prev => ({
        ...prev,
        'all-verticals': {
          totalImported,
          totalProcessed: totalImported,
          completedVerticals: completed
        }
      }));
      
      toast.success('All verticals imported!', {
        description: `Successfully imported ${totalImported} articles from ${completed} verticals`
      });
      
      await loadMetrics();

    } catch (error) {
      console.error('Error importing all verticals:', error);
      toast.error('Failed to import articles', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      setProgressStatus('Error occurred');
      setProgressPercent(0);
    } finally {
      setTimeout(() => {
        setImporting(null);
        setProgressStatus('');
        setProgressPercent(0);
        setCurrentVertical('');
        // Don't reset session stats - keep them running
      }, 5000);
    }
  };

  const resetSessionStats = () => {
    setSessionArticlesImported(0);
    setImportStartTime(new Date());
    setSessionDuration(0);
  };

  const importVertical = async (vertical: string, verticalSlug: string) => {
    setImporting(vertical);

    if (!importStartTime) {
      setImportStartTime(new Date());
      setSessionDuration(0);
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('import-articles', {
        body: { vertical: verticalSlug }
      });

      if (error) throw error;

      setResults(prev => ({ ...prev, [vertical]: data }));

      const importedCount = data?.insertedArticles || 0;
      if (importedCount > 0) {
        setSessionArticlesImported(prev => prev + importedCount);
      }

      toast.success(`${vertical} import completed!`, {
        description: `Imported ${importedCount} articles`
      });
      await loadMetrics(); // Refresh metrics after import
    } catch (error) {
      console.error(`Error importing ${vertical}:`, error);
      toast.error(`Failed to import ${vertical}`, {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setImporting(null);
    }
  };

  const testImportVertical = async (limit: number = 5) => {
    if (!selectedTestVertical) {
      toast.error('Please select a vertical to test');
      return;
    }
    
    setImporting('vertical-test');

    if (!importStartTime) {
      setImportStartTime(new Date());
      setSessionDuration(0);
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('import-articles', {
        body: { 
          vertical: selectedTestVertical,
          limit: limit
        }
      });

      if (error) throw error;

      // Fetch the recently imported articles to display
      const { data: recentArticles } = await supabase
        .from('articles')
        .select('id, title, post_id, external_url')
        .eq('vertical_slug', selectedTestVertical)
        .order('created_at', { ascending: false })
        .limit(limit);

      const importedCount = data?.insertedArticles || 0;
      if (importedCount > 0) {
        setSessionArticlesImported(prev => prev + importedCount);
      }

      setResults(prev => ({ 
        ...prev, 
        'vertical-test': {
          ...data,
          articles: recentArticles || []
        }
      }));
      
      toast.success(`${selectedTestVertical} test import completed!`, {
        description: `Imported ${importedCount} articles`
      });
      await loadMetrics();
    } catch (error) {
      console.error(`Error testing ${selectedTestVertical} import:`, error);
      toast.error(`Failed to test ${selectedTestVertical} import`, {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setImporting(null);
    }
  };

  const importAerospaceFast = async () => {
    setImporting('aerospace-fast');
    setProgressStatus('Starting FAST import (no AI)...');
    setProgressPercent(0);
    setAerospaceProgress(null);

    if (!importStartTime) {
      setImportStartTime(new Date());
      setSessionDuration(0);
    }

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

      const progressChannel = supabase
        .channel(`aerospace-fast-${user.id}`)
        .on('broadcast', { event: 'import-progress' }, (payload) => {
          console.log('📡 Progress update:', payload);
          setAerospaceProgress(payload.payload);
          
          if (payload.payload.phase === 'processing') {
            const rawPercent = 20 + (payload.payload.currentPage / 10);
            const clampedPercent = Math.max(0, Math.min(99, Math.round(rawPercent)));
            setProgressPercent(clampedPercent);
            setProgressStatus(payload.payload.message);
          } else if (payload.payload.phase === 'complete') {
            setProgressPercent(100);
            setProgressStatus('Fast import complete!');
            
            // Update session stats when complete
            const imported = payload.payload.imported || 0;
            if (imported > 0) {
              setSessionArticlesImported(prev => prev + imported);
            }
            
            // Auto-close after completion
            setTimeout(() => {
              setImporting(null);
              supabase.removeChannel(progressChannel);
            }, 3000);
          } else if (payload.payload.phase === 'error') {
            setProgressStatus(`Error: ${payload.payload.message}`);
            setTimeout(() => {
              setImporting(null);
              supabase.removeChannel(progressChannel);
            }, 5000);
          }
        })
        .subscribe();

      toast.info('Starting FAST Aerospace import in background...', {
        description: 'All 9,240 articles will be imported without timing out. Check Import History below for progress.'
      });

      setProgressPercent(10);
      setProgressStatus('Launching background import...');

      const { data, error } = await supabase.functions.invoke('import-aerospace-fast', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      // Note: Channel stays open to receive background updates
      // It will auto-close when phase === 'complete' or 'error'

      await loadMetrics();
    } catch (error) {
      console.error('Error importing Aerospace:', error);
      toast.error('Failed to start Aerospace import', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      setProgressStatus('Error occurred');
      setImporting(null);
    }
  };


  const clearAllAerospaceData = async () => {
    if (!confirm('⚠️ WARNING: This will delete ALL Aerospace data.\n\n✅ BACKUP WILL BE CREATED FIRST\n\nDeleting:\n- All aerospace articles\n- Import history\n- AI processing jobs\n\n❌ BACKUPS WILL BE PRESERVED\n\nContinue?')) {
      return;
    }
    
    try {
      setIsClearing(true);
      const backupName = `pre-clear-aerospace-${new Date().toISOString()}`;
      
      toast.info('Step 1/3: Counting articles...', {
        description: 'Checking how many aerospace articles to backup'
      });
      
      // Get count first
      const { count: totalCount, error: countError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', 'aerospace');
      
      if (countError) throw countError;
      
      if (!totalCount || totalCount === 0) {
        toast.info('No aerospace articles found to backup');
        setIsClearing(false);
        return;
      }
      
      toast.info(`Step 2/3: Backing up ${totalCount.toLocaleString()} articles...`, {
        description: 'This may take a few minutes',
        duration: 5000
      });
      
      // STEP 1: Fetch ALL articles in batches
      const batchSize = 1000;
      let allArticles: any[] = [];
      
      for (let offset = 0; offset < totalCount; offset += batchSize) {
        const { data: batch, error: fetchError } = await supabase
          .from('articles')
          .select('*')
          .eq('vertical_slug', 'aerospace')
          .range(offset, offset + batchSize - 1);
        
        if (fetchError) throw fetchError;
        
        if (batch) {
          allArticles = allArticles.concat(batch);
          toast.info(`Backing up: ${allArticles.length.toLocaleString()} / ${totalCount.toLocaleString()}`, {
            duration: 1000,
            id: 'aerospace-backup-progress'
          });
        }
      }
      
      // STEP 2: Create backup
      if (allArticles.length > 0) {
        const backupRecords = allArticles.map(article => ({
          article_id: article.id,
          post_id: article.post_id,
          title: article.title,
          content: article.content,
          excerpt: article.excerpt,
          author: article.author,
          image_url: article.image_url,
          vertical_slug: article.vertical_slug,
          published_at: article.published_at,
          metadata: article.metadata,
          backup_name: backupName,
          backup_description: `Automatic safety backup of ${allArticles.length.toLocaleString()} aerospace articles before clearing data at ${new Date().toLocaleString()}`
        }));
        
        // Insert in chunks
        const insertChunkSize = 1000;
        for (let i = 0; i < backupRecords.length; i += insertChunkSize) {
          const chunk = backupRecords.slice(i, i + insertChunkSize);
          const { error: backupError } = await supabase
            .from('article_backups')
            .insert(chunk);
          
          if (backupError) throw backupError;
          
          toast.info(`Saving backup: ${Math.min(i + insertChunkSize, backupRecords.length).toLocaleString()} / ${backupRecords.length.toLocaleString()}`, {
            duration: 1000,
            id: 'aerospace-backup-insert'
          });
        }
        
        toast.success(`✅ Backup created: ${allArticles.length.toLocaleString()} articles saved`, {
          description: `Backup name: ${backupName}`,
          duration: 5000
        });
      }
      
      toast.info('Step 3/3: Clearing aerospace data...', {
        description: 'Deleting articles and metadata (backups preserved)'
      });
      
      // STEP 3: Delete aerospace articles using edge function (handles RLS)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to clear aerospace data');
      }

      const { data: clearResult, error: clearError } = await supabase.functions.invoke(
        'clear-aerospace-articles',
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        }
      );
      
      if (clearError) {
        console.error('Clear function error:', clearError);
        throw clearError;
      }
      
      if (!clearResult?.success) {
        throw new Error(clearResult?.error || 'Failed to clear aerospace data');
      }

      toast.success('All Aerospace data cleared successfully', {
        description: `✅ Backup preserved: ${backupName}\n✅ ${allArticles.length.toLocaleString()} articles can be restored\n✅ ${clearResult.deleted || 0} articles deleted`,
        duration: 10000
      });
      
      await loadMetrics();
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

  const clearAllAviationData = async () => {
    if (!confirm('⚠️ WARNING: This will delete ALL Aviation data.\n\n✅ BACKUP WILL BE CREATED FIRST\n\nDeleting:\n- All aviation articles\n- Import history\n- AI processing jobs\n\n❌ BACKUPS WILL BE PRESERVED\n\nContinue?')) {
      return;
    }
    
    try {
      setIsClearing(true);
      const backupName = `pre-clear-aviation-${new Date().toISOString()}`;
      
      toast.info('Step 1/3: Counting articles...', {
        description: 'Checking how many aviation articles to backup'
      });
      
      // Get count first
      const { count: totalCount, error: countError } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', 'aviation');
      
      if (countError) throw countError;
      
      if (!totalCount || totalCount === 0) {
        toast.info('No aviation articles found to backup');
        setIsClearing(false);
        return;
      }
      
      toast.info(`Step 2/3: Backing up ${totalCount.toLocaleString()} articles...`, {
        description: 'This may take a few minutes',
        duration: 5000
      });
      
      // STEP 1: Fetch ALL articles in batches
      const batchSize = 1000;
      let allArticles: any[] = [];
      
      for (let offset = 0; offset < totalCount; offset += batchSize) {
        const { data: batch, error: fetchError } = await supabase
          .from('articles')
          .select('*')
          .eq('vertical_slug', 'aviation')
          .range(offset, offset + batchSize - 1);
        
        if (fetchError) throw fetchError;
        
        if (batch) {
          allArticles = allArticles.concat(batch);
          toast.info(`Backing up: ${allArticles.length.toLocaleString()} / ${totalCount.toLocaleString()}`, {
            duration: 1000,
            id: 'aviation-backup-progress'
          });
        }
      }
      
      // STEP 2: Create backup
      if (allArticles.length > 0) {
        const backupRecords = allArticles.map(article => ({
          article_id: article.id,
          post_id: article.post_id,
          title: article.title,
          content: article.content,
          excerpt: article.excerpt,
          author: article.author,
          image_url: article.image_url,
          vertical_slug: article.vertical_slug,
          published_at: article.published_at,
          metadata: article.metadata,
          backup_name: backupName,
          backup_description: `Automatic safety backup of ${allArticles.length.toLocaleString()} aviation articles before clearing data at ${new Date().toLocaleString()}`
        }));
        
        // Insert in chunks
        const insertChunkSize = 1000;
        for (let i = 0; i < backupRecords.length; i += insertChunkSize) {
          const chunk = backupRecords.slice(i, i + insertChunkSize);
          const { error: backupError } = await supabase
            .from('article_backups')
            .insert(chunk);
          
          if (backupError) throw backupError;
          
          toast.info(`Saving backup: ${Math.min(i + insertChunkSize, backupRecords.length).toLocaleString()} / ${backupRecords.length.toLocaleString()}`, {
            duration: 1000,
            id: 'aviation-backup-insert'
          });
        }
        
        toast.success(`✅ Backup created: ${allArticles.length.toLocaleString()} articles saved`, {
          description: `Backup name: ${backupName}`,
          duration: 5000
        });
      }
      
      toast.info('Step 3/3: Clearing aviation data...', {
        description: 'Deleting articles and metadata (backups preserved)'
      });
      
      // STEP 3: Delete aviation articles (backups are preserved!)
      const { error: articlesError } = await supabase
        .from('articles')
        .delete()
        .eq('vertical_slug', 'aviation');
      
      if (articlesError) throw articlesError;

      // Delete aviation import history
      const { error: historyError } = await supabase
        .from('import_history')
        .delete()
        .eq('vertical_slug', 'aviation');
      
      if (historyError) throw historyError;

      // Delete aviation AI processing jobs
      const { error: jobsError } = await supabase
        .from('ai_processing_jobs')
        .delete()
        .eq('vertical_slug', 'aviation');
      
      if (jobsError) throw jobsError;

      toast.success('All Aviation data cleared successfully', {
        description: `✅ Backup preserved: ${backupName}\n✅ ${allArticles.length.toLocaleString()} articles can be restored`,
        duration: 10000
      });
      
      await loadMetrics();
    } catch (error) {
      console.error('Error clearing Aviation data:', error);
      toast.error('Failed to clear Aviation data', {
        description: error instanceof Error ? error.message : 'An error occurred'
      });
    } finally {
      setIsClearing(false);
    }
  };

  const importAerospaceWithAI = async () => {
    setImporting('aerospace-ai');
    setProgressStatus('Starting FULL FEED import (all pages)...');
    setProgressPercent(0);
    setAerospaceProgress(null);

    if (!importStartTime) {
      setImportStartTime(new Date());
      setSessionDuration(0);
    }

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

      // Subscribe to real-time progress updates
      const progressChannel = supabase
        .channel(`aerospace-import-${user.id}`)
        .on('broadcast', { event: 'import-progress' }, (payload) => {
          console.log('📡 Progress update:', payload);
          setAerospaceProgress(payload.payload);
          
          // Update progress bar based on phase
          if (payload.payload.phase === 'fetching') {
            setProgressPercent(20);
            setProgressStatus(`Fetching page ${payload.payload.currentPage}...`);
          } else if (payload.payload.phase === 'processing') {
            const percent = 20 + (payload.payload.percentComplete || 0) * 0.8;
            setProgressPercent(Math.round(percent));
            setProgressStatus(payload.payload.message);
          } else if (payload.payload.phase === 'complete') {
            setProgressPercent(100);
            setProgressStatus('Import complete!');
          }
        })
        .subscribe();

      toast.info('Starting FULL FEED Aerospace import with AI formatting and tagging (all pages)...');

      setProgressPercent(10);
      setProgressStatus('Connecting to import service...');

      const { data, error } = await supabase.functions.invoke('import-aerospace-with-ai', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      // Clean up channel
      await supabase.removeChannel(progressChannel);

      if (error) throw error;

      setProgressPercent(100);
      setProgressStatus('Aerospace FULL FEED import completed!');

      const importedCount = data?.imported || 0;
      if (importedCount > 0) {
        setSessionArticlesImported(prev => prev + importedCount);
      }

      setResults(prev => ({ 
        ...prev, 
        'aerospace-ai': data 
      }));

      toast.success('Aerospace FULL FEED import completed!', {
        description: `Scanned ${data?.totalPages || 0} pages • Imported ${data?.imported || 0} new articles • Formatted ${data?.formatted || 0} with AI • Tagged ${data?.tagged || 0} • Skipped ${data?.skipped || 0} existing`,
        duration: 10000
      });

      await loadMetrics();
    } catch (error) {
      console.error('Error importing Aerospace:', error);
      toast.error('Failed to import Aerospace articles', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      setProgressStatus('Error occurred');
    } finally {
      setTimeout(() => {
        setImporting(null);
        setProgressStatus('');
        setProgressPercent(0);
        setAerospaceProgress(null);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />
      
      <div className="pt-24 container mx-auto py-8 px-4">
          <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Article Import Admin</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    toast.info('Removing Zephyrnet source references...');
                    const { data, error } = await supabase.functions.invoke('remove-zephyrnet-source');
                    
                    if (error) throw error;
                    
                    toast.success('Zephyrnet sources removed successfully', {
                      description: `${data.articlesUpdated} articles updated`,
                      duration: 5000
                    });
                    
                    await loadMetrics();
                  } catch (error) {
                    toast.error('Failed to remove Zephyrnet sources', {
                      description: error instanceof Error ? error.message : 'Unknown error'
                    });
                  }
                }}
                disabled={importing !== null}
              >
                <Database className="h-4 w-4 mr-2" />
                Remove Zephyrnet Sources
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  const confirmed = window.confirm(
                    'Are you sure you want to delete ALL articles posted after January 1, 2025? This action cannot be undone.'
                  );
                  
                  if (!confirmed) return;
                  
                  try {
                    toast.info('Deleting articles after Jan 1, 2025...');
                    const { data, error } = await supabase.functions.invoke('delete-articles-after-date', {
                      body: { cutoffDate: '2025-01-01' }
                    });
                    
                    if (error) throw error;
                    
                    toast.success('Articles deleted successfully', {
                      description: `${data.deleted} articles removed`,
                      duration: 5000
                    });
                    
                    await loadMetrics();
                  } catch (error) {
                    toast.error('Failed to delete articles', {
                      description: error instanceof Error ? error.message : 'Unknown error'
                    });
                  }
                }}
                disabled={importing !== null}
              >
                <Database className="h-4 w-4 mr-2" />
                Delete Posts After Jan 1, 2025
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/admin/backfill')}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Backfill Dashboard
              </Button>
              {importing && (
                <Button
                  variant="destructive"
                  onClick={async () => {
                    try {
                      // Mark current imports as cancelled in database
                      const { error } = await supabase
                        .from('import_history')
                        .update({ 
                          cancelled: true,
                          status: 'cancelled',
                          completed_at: new Date().toISOString()
                        })
                        .eq('status', 'in_progress');

                      if (error) {
                        console.error('Error cancelling imports:', error);
                        toast.error('Failed to cancel imports');
                      } else {
                        toast.success('Import cancellation signal sent');
                      }

                      // Reset UI state
                      setImporting(null);
                      setProgressStatus('');
                      setProgressPercent(0);
                      setCurrentVertical('');
                      setAerospaceProgress(null);
                      setAiProcessingActive(false);
                      
                      // Reload metrics after a short delay
                      setTimeout(() => loadMetrics(), 2000);
                    } catch (err) {
                      console.error('Error in cancel handler:', err);
                      toast.error('Failed to cancel imports');
                    }
                  }}
                  className="gap-2"
                >
                  ⏹️ Cancel Import
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => navigate("/admin/articles/backups")}
                className="gap-2"
              >
                <Database className="h-4 w-4" />
                View Backups & Restore
              </Button>
              <Button 
                onClick={() => navigate('/admin/plato-import')}
                variant="default"
                className="flex items-center gap-2"
              >
                🚀 Plato Import
              </Button>
              <Button 
                onClick={() => navigate('/admin/users')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                User Management
              </Button>
            </div>
          </div>
          
          {/* Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                  <span>Total Articles</span>
                  {realtimeConnected && (
                    <span className="flex items-center gap-1 text-xs text-green-500">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Live
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalArticles.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all verticals
                  {lastUpdateTime && (
                    <span className="ml-2 text-green-500">
                      • Updated {lastUpdateTime.toLocaleTimeString()}
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Verticals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{verticals.length}</div>
                <p className="text-xs text-muted-foreground mt-1">In directory</p>
              </CardContent>
            </Card>

            <DuplicateMonitor autoRefresh={true} refreshInterval={60000} />
          </div>

          {/* Real-time Stats Banner - Always Visible */}
          <Card className="mb-8 border-green-500/50 bg-gradient-to-br from-green-500/10 to-blue-500/10 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-3">
                  <span className="text-3xl">📊</span>
                  Live Import Statistics
                  {realtimeConnected && (
                    <span className="text-sm font-normal text-green-500 flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
                      <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></span>
                      Real-time Active
                    </span>
                  )}
                </CardTitle>
                <Button
                  onClick={resetSessionStats}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Reset Stats
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-6 bg-background rounded-lg border-2 border-green-500/30 shadow-md transition-all hover:shadow-lg hover:border-green-500/50">
                  <p className="text-sm text-muted-foreground mb-3 flex items-center justify-center gap-2 font-medium">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></span>
                    Articles This Session
                  </p>
                  <p className="text-5xl font-bold text-green-500 tabular-nums tracking-tight animate-in fade-in duration-500">
                    {sessionArticlesImported.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-6 bg-background rounded-lg border-2 border-blue-500/30 shadow-md transition-all hover:shadow-lg hover:border-blue-500/50">
                  <p className="text-sm text-muted-foreground mb-3 font-medium">Import Rate</p>
                  <p className="text-5xl font-bold text-blue-500 tabular-nums tracking-tight">
                    {importRate}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">articles/sec</p>
                </div>
                <div className="text-center p-6 bg-background rounded-lg border-2 border-purple-500/30 shadow-md transition-all hover:shadow-lg hover:border-purple-500/50">
                  <p className="text-sm text-muted-foreground mb-3 font-medium">Session Duration</p>
                  <p className="text-5xl font-bold text-purple-500 tabular-nums tracking-tight">
                    {Math.floor(sessionDuration / 60)}:{String(sessionDuration % 60).padStart(2, '0')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">min:sec</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Import All & Process Section */}
          <Card className="mb-8 border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                🚀 Import All Verticals & Process with AI
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Import articles from all verticals and apply full AI processing (content formatting + 8 tag extraction) to every article
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={importAndProcessAll}
                  disabled={importing !== null}
                  className="w-full h-14 text-lg"
                  variant="default"
                >
                  {importing === 'all-verticals' ? 'Importing All Verticals...' : '🚀 Import All Verticals & Process with AI'}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  This will import articles from all available verticals
                </p>

                {importing === 'all-verticals' && (
                  <div className="space-y-4">
                    {/* Overall Progress */}
                    <div className="space-y-3 p-4 bg-background rounded-lg border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{progressStatus}</span>
                        <span className="text-sm text-muted-foreground">{progressPercent}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>

                    {/* Currently Importing */}
                    <div className="p-4 bg-background rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">Currently Importing</p>
                      <p className="text-lg font-bold text-blue-500">{currentVertical || 'Initializing...'}</p>
                    </div>

                    {/* Live Import Feed */}
                    {liveImportResults.length > 0 && (
                      <div className="p-4 bg-background rounded-lg border">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Live Import Feed
                        </h4>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {[...liveImportResults].reverse().map((result, idx) => (
                            <div 
                              key={`${result.vertical}-${idx}`}
                              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                                result.status === 'importing' 
                                  ? 'bg-blue-500/10 border border-blue-500/20' 
                                  : result.status === 'success'
                                  ? 'bg-green-500/10 border border-green-500/20'
                                  : 'bg-red-500/10 border border-red-500/20'
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className={`w-2 h-2 rounded-full ${
                                  result.status === 'importing'
                                    ? 'bg-blue-500 animate-pulse'
                                    : result.status === 'success'
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                                }`} />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{result.vertical}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {result.timestamp.toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                {result.status === 'importing' ? (
                                  <span className="text-sm text-blue-500 animate-pulse">Importing...</span>
                                ) : result.status === 'success' ? (
                                  <span className="text-sm font-bold text-green-500">
                                    +{result.count.toLocaleString()}
                                  </span>
                                ) : (
                                  <span className="text-sm text-red-500">Error</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {results['all-verticals'] && (
                  <div className="mt-4 p-4 bg-background rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Imported</p>
                        <p className="text-2xl font-bold text-green-500">{results['all-verticals'].totalImported}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">AI Processed</p>
                        <p className="text-2xl font-bold text-blue-500">{results['all-verticals'].totalProcessed}</p>
                      </div>
                    </div>
                    
                    {results['all-verticals'].verticalResults && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Import Results by Vertical:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                          {Object.entries(results['all-verticals'].verticalResults).map(([vertical, count]: [string, any]) => (
                            <div key={vertical} className="p-2 bg-muted rounded">
                              <span className="font-medium">{vertical}:</span> {count}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Generic Import Section - Now supports any vertical via input fields */}
          {/* <AerospaceImport /> component hidden - using AviationImport as the generic importer */}
          
          {/* AR/VR AI Processing Section */}
          <Card className="mb-8 border-blue-500/50 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                🥽 AR/VR AI Processing
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Process all AR/VR articles with AI to format content and extract tags
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-6 bg-background rounded-lg border-2 border-blue-500/30">
                    <p className="text-sm text-muted-foreground mb-2">Total Articles</p>
                    <p className="text-4xl font-bold text-blue-500">
                      {arvrStats.loading ? '...' : arvrStats.total.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-6 bg-background rounded-lg border-2 border-green-500/30">
                    <p className="text-sm text-muted-foreground mb-2">AI Processed</p>
                    <p className="text-4xl font-bold text-green-500">
                      {arvrStats.loading ? '...' : arvrStats.aiProcessed.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-6 bg-background rounded-lg border-2 border-orange-500/30">
                    <p className="text-sm text-muted-foreground mb-2">Remaining</p>
                    <p className="text-4xl font-bold text-orange-500">
                      {arvrStats.loading ? '...' : arvrStats.remaining.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Progress Bar (if processing) */}
                {arvrStats.status === 'in_progress' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Processing Progress</span>
                      <span className="text-sm text-muted-foreground">{arvrStats.progressPercent}%</span>
                    </div>
                    <Progress value={arvrStats.progressPercent} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Job ID: {arvrStats.jobId}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleStartArvrAiProcessing}
                    disabled={importing !== null || arvrStats.status === 'in_progress'}
                    className="flex-1 h-12"
                    size="lg"
                  >
                    {importing === 'ar-vr-ai' ? (
                      '⏳ Starting...'
                    ) : arvrStats.status === 'in_progress' ? (
                      '⚙️ Processing...'
                    ) : arvrStats.remaining === 0 ? (
                      '✅ All Processed'
                    ) : (
                      `🚀 Start Processing`
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleResumeArvrAiProcessing}
                    disabled={importing !== null}
                    variant="outline"
                    className="flex-1 h-12"
                    size="lg"
                  >
                    {importing === 'ar-vr-ai' ? (
                      '⏳ Resuming...'
                    ) : (
                      '🔄 Resume Processing'
                    )}
                  </Button>
                </div>

                {arvrStats.status === 'in_progress' && (
                  <p className="text-center text-sm text-muted-foreground">
                    Processing is running in the background. Stats update every 5 seconds.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Aerospace Statistics Dashboard */}
          <AerospaceStatsDashboard />
          
          {/* Aerospace Import Section */}
          <AerospaceImport
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
              if (!importStartTime) setImportStartTime(new Date());
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

          {/* Import History Table */}
          <ImportHistoryTable />

          {/* Aerospace URL Backfill */}
          <div className="mb-8">
            <AerospaceUrlBackfill />
          </div>

          {/* Cannabis Import Test Section */}
          <Card className="mb-8 border-green-500/50 bg-green-500/5">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                🌿 Cannabis Import Field Mapping Test
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Test the updated import function with Cannabis vertical (uses id→post_id, date→published_at field mapping)
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    📋 Current Status
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Vertical</p>
                      <p className="font-mono font-bold">cannabis</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Current Articles</p>
                      <p className="font-mono font-bold text-blue-500">
                        {metrics['cannabis']?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button
                    onClick={async () => {
                      setImporting('cannabis-test');
                      setTestingImport(true);
                      try {
                        // Check authentication first
                        const { data: { session } } = await supabase.auth.getSession();
                        if (!session) {
                          toast.error('Authentication required', {
                            description: 'Please sign in to test imports'
                          });
                          setImporting(null);
                          setTestingImport(false);
                          return;
                        }

                        const startCount = metrics['cannabis'] || 0;
                        
                        toast.info('Testing Cannabis import with 10 articles...', {
                          description: 'This will test the new field mapping (id→post_id, date→published_at)'
                        });
                        
                        console.log('Starting Cannabis import test...');
                        
                        const { data, error } = await supabase.functions.invoke('import-articles', {
                          body: { 
                            vertical: 'cannabis',
                            limit: 10,
                            customJsonUrl: 'https://platodata.ai/cannabis/json/'
                          }
                        });

                        console.log('Import response:', data, error);

                        if (error) {
                          console.error('Import error:', error);
                          throw error;
                        }

                        // Fetch the recently imported articles
                        const { data: recentArticles } = await supabase
                          .from('articles')
                          .select('id, title, post_id, external_url, published_at, author')
                          .eq('vertical_slug', 'cannabis')
                          .order('created_at', { ascending: false })
                          .limit(10);

                        const importedCount = data?.insertedArticles || 0;
                        
                        setResults(prev => ({ 
                          ...prev, 
                          'cannabis-test': {
                            ...data,
                            articles: recentArticles || [],
                            beforeCount: startCount,
                            afterCount: startCount + importedCount
                          }
                        }));
                        
                        await loadMetrics();
                        
                        if (importedCount > 0) {
                          toast.success('✅ Cannabis import successful!', {
                            description: `Imported ${importedCount} articles using field mapping`,
                            duration: 5000
                          });
                        } else {
                          toast.info('No new articles imported', {
                            description: 'Articles may already exist in the database'
                          });
                        }
                      } catch (error) {
                        console.error('Cannabis test error:', error);
                        toast.error('Failed to test Cannabis import', {
                          description: error instanceof Error ? error.message : 'Unknown error',
                          duration: 5000
                        });
                      } finally {
                        setImporting(null);
                        setTestingImport(false);
                      }
                    }}
                    disabled={importing !== null || testingImport}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {testingImport ? '🔄 Testing...' : '🧪 Test Import 10 Cannabis Articles'}
                  </Button>
                </div>

                {results['cannabis-test'] && (
                  <div className="mt-4 p-4 bg-muted rounded-lg space-y-3 border border-green-500/30">
                    <h4 className="font-semibold text-green-600 dark:text-green-400">Test Results</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Imported</p>
                        <p className="text-xl font-bold text-green-500">{results['cannabis-test'].insertedArticles}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Articles</p>
                        <p className="text-xl font-bold text-blue-500">{results['cannabis-test'].totalArticles}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Before</p>
                        <p className="text-xl font-bold">{results['cannabis-test'].beforeCount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">After</p>
                        <p className="text-xl font-bold">{results['cannabis-test'].afterCount?.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {results['cannabis-test'].articles && results['cannabis-test'].articles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Recently Imported Articles:</h4>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {results['cannabis-test'].articles.map((article: any, index: number) => (
                            <div key={article.id} className="p-3 bg-background rounded border border-border hover:border-green-500/50 transition-colors">
                              <div className="space-y-1">
                                <p className="text-sm font-medium">{index + 1}. {article.title}</p>
                                <div className="flex gap-4 text-xs text-muted-foreground">
                                  <span>Post ID: <span className="font-mono text-green-600 dark:text-green-400">{article.post_id}</span></span>
                                  <span>Author: {article.author}</span>
                                </div>
                                {article.published_at && (
                                  <p className="text-xs text-muted-foreground">
                                    Published: {new Date(article.published_at).toLocaleDateString()}
                                  </p>
                                )}
                                <div className="flex gap-2 mt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => navigate(`/intel/article/${article.id}`)}
                                    className="text-xs"
                                  >
                                    View Article
                                  </Button>
                                  {article.external_url && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => window.open(article.external_url, '_blank')}
                                      className="text-xs"
                                    >
                                      Source
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Test Import Single Vertical Section */}
          <Card className="mb-8 border-blue-500/50">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                🧪 Test Import Single Vertical
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Select any vertical to test import a limited number of articles
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Select Vertical</label>
                    <Select value={selectedTestVertical} onValueChange={setSelectedTestVertical}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a vertical to test..." />
                      </SelectTrigger>
                      <SelectContent>
                        {verticals.map((vertical) => (
                          <SelectItem key={vertical.slug} value={vertical.slug}>
                            {vertical.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button
                    onClick={() => testImportVertical(5)}
                    disabled={importing !== null || !selectedTestVertical}
                    className="flex-1"
                  >
                    {importing === 'vertical-test' ? 'Testing...' : 'Import 5 Test Articles'}
                  </Button>
                  <Button
                    onClick={() => testImportVertical(10)}
                    disabled={importing !== null || !selectedTestVertical}
                    variant="outline"
                    className="flex-1"
                  >
                    {importing === 'vertical-test' ? 'Testing...' : 'Import 10 Test Articles'}
                  </Button>
                  <Button
                    onClick={() => testImportVertical(25)}
                    disabled={importing !== null || !selectedTestVertical}
                    variant="outline"
                    className="flex-1"
                  >
                    {importing === 'vertical-test' ? 'Testing...' : 'Import 25 Test Articles'}
                  </Button>
                </div>

                {results['vertical-test'] && (
                  <div className="mt-4 p-4 bg-muted rounded-lg space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Imported</p>
                        <p className="text-xl font-bold text-green-500">{results['vertical-test'].insertedArticles}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Skipped</p>
                        <p className="text-xl font-bold text-yellow-500">{results['vertical-test'].skippedArticles}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Errors</p>
                        <p className="text-xl font-bold text-red-500">{results['vertical-test'].erroredArticles}</p>
                      </div>
                    </div>
                    
                    {results['vertical-test'].articles && results['vertical-test'].articles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Recently Imported Articles:</h4>
                        <div className="space-y-2">
                          {results['vertical-test'].articles.map((article: any, index: number) => (
                            <div key={article.id} className="p-3 bg-background rounded border border-border">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{index + 1}. {article.title}</p>
                                  <p className="text-xs text-muted-foreground">Post ID: {article.post_id}</p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate(`/intel/article/${article.id}`)}
                                >
                                  View
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* All Verticals Table */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-2xl">All Verticals Directory</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Showing {sortedVerticals.length} of {verticals.length} verticals
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search verticals by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              {verticalsLoading ? (
                <div className="text-center py-8">Loading verticals...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          onClick={() => toggleSort('name')}
                          className="flex items-center gap-1 px-0 hover:bg-transparent"
                        >
                          Vertical Name
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          onClick={() => toggleSort('count')}
                          className="flex items-center gap-1 px-0 hover:bg-transparent"
                        >
                          Article Count
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Indexed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedVerticals.map((vertical, index) => (
                      <TableRow key={vertical.slug}>
                        <TableCell className="font-medium text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">{vertical.name}</span>
                        </TableCell>
                        <TableCell>
                          <span className={`text-lg font-bold ${vertical.articleCount > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                            {vertical.articleCount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          {vertical.articleCount > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              ✓ Indexed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                              Not Indexed
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => importVertical(vertical.name, vertical.slug)}
                            disabled={importing !== null}
                            size="sm"
                            variant={vertical.articleCount === 0 ? "default" : "outline"}
                          >
                            {importing === vertical.name ? 'Importing...' : vertical.articleCount === 0 ? 'Import' : 'Re-import'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              {results && Object.keys(results).length > 0 && (
                <div className="mt-6 space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">Recent Import Results:</h3>
                  {Object.entries(results).map(([name, data]: [string, any]) => (
                    <div key={name} className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">
                        ✅ {name}: Imported {data.insertedArticles} articles ({(data.duration / 1000).toFixed(1)}s)
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Note:</h3>
            <p className="text-sm text-muted-foreground">
              Imports may take several minutes for large datasets. The function will process
              articles in batches and store them in the database. Once imported, articles will
              load instantly from the database instead of external APIs.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ImportAdmin;