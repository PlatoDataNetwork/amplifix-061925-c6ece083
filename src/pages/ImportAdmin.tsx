import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePlatoVerticals } from "@/hooks/usePlatoVerticals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowUpDown, Search } from "lucide-react";
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
import { ImportHistoryTable } from "@/components/ImportHistoryTable";
import { DuplicateMonitor } from "@/components/DuplicateMonitor";

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
  const [lastAiStatsUpdate, setLastAiStatsUpdate] = useState<Date | null>(null);
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
  const { verticals, isLoading: verticalsLoading } = usePlatoVerticals();
  
  // Load aerospace article counts
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

      setAerospaceArticleCounts({
        total: total || 0,
        aiProcessed: processed || 0,
        remaining: (total || 0) - (processed || 0)
      });
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

  // Load aerospace stats
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

  // Load AI job stats on mount and set up auto-refresh
  useEffect(() => {
    loadAiJobStats();
    loadAerospaceStats();
    loadAerospaceArticleCounts();
    
    const interval = setInterval(() => {
      loadAiJobStats();
      loadAerospaceArticleCounts();
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
            body: { vertical: verticalSlug },
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

            <DuplicateMonitor threshold={50} autoRefresh={true} refreshInterval={60000} />
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
                  size="lg"
                >
                  {importing === 'all-verticals' ? 'Processing...' : 'Import & Process All Articles'}
                </Button>

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

          {/* Aerospace Bulk Import with AI */}
          <Card className="mb-8 border-orange-500/50 bg-gradient-to-br from-orange-500/5 to-orange-500/10">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                ⚡ Aerospace FAST Import (No AI)
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Quick import of ALL 9,240 aerospace articles without AI processing. Import first, then process with AI later in batches.
              </p>
              <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                  🤖 Auto-Resume Enabled: Imports process 50 pages at a time and automatically continue every 2 minutes until complete. No manual intervention needed!
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={importAerospaceFast}
                    disabled={importing !== null}
                    className="flex-1 h-14 text-lg bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    {importing === 'aerospace-fast' ? 'Importing All Pages...' : 'Import ALL Aerospace (Fast, No AI)'}
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        toast.info("Triggering auto-resume for aerospace...");
                        const { data, error } = await supabase.functions.invoke('auto-resume-imports');
                        if (error) throw error;
                        const message =
                          (data as any)?.message ||
                          ((data as any)?.success ? 'Auto-resume started' : 'Checked for resumable imports');
                        toast.success(message);
                      } catch (error) {
                        console.error('Auto-resume error:', error);
                        toast.error('Failed to trigger auto-resume');
                      }
                    }}
                    variant="default"
                    className="h-14 px-6 bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    Continue Aerospace
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        toast.info("Checking for stuck imports...");
                        const { data, error } = await supabase.functions.invoke('fix-stuck-imports');
                        if (error) throw error;
                        toast.success(data.message);
                      } catch (error) {
                        console.error('Fix error:', error);
                        toast.error('Failed to fix stuck imports');
                      }
                    }}
                    variant="outline"
                    className="h-14 px-6"
                    size="lg"
                  >
                    Fix Stuck
                  </Button>
                </div>

                {importing === 'aerospace-fast' && aerospaceProgress && (
                  <div className="space-y-4">
                    <div className="space-y-3 p-4 bg-background rounded-lg border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{progressStatus}</span>
                        <span className="text-sm text-muted-foreground">{progressPercent}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>

                    <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30">
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="p-3 bg-background/80 rounded border">
                          <p className="text-xs text-muted-foreground mb-1">Current Page</p>
                          <p className="text-2xl font-bold text-blue-500">{aerospaceProgress.currentPage}</p>
                        </div>
                        <div className="p-3 bg-background/80 rounded border">
                          <p className="text-xs text-muted-foreground mb-1">Imported</p>
                          <p className="text-2xl font-bold text-green-500">{aerospaceProgress.imported || 0}</p>
                        </div>
                        <div className="p-3 bg-background/80 rounded border">
                          <p className="text-xs text-muted-foreground mb-1">Skipped</p>
                          <p className="text-2xl font-bold text-muted-foreground">{aerospaceProgress.skipped || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {results['aerospace-fast'] && (
                  <div className="p-4 bg-background rounded-lg space-y-3">
                    <h3 className="font-semibold text-lg">Fast Import Complete! 🎉</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Pages</p>
                        <p className="text-2xl font-bold">{results['aerospace-fast'].totalPages}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Imported</p>
                        <p className="text-2xl font-bold text-green-500">{results['aerospace-fast'].imported}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Skipped</p>
                        <p className="text-2xl font-bold text-muted-foreground">{results['aerospace-fast'].skipped}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Duration: {Math.round(results['aerospace-fast'].duration / 1000)}s
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Process Existing Aerospace Articles with AI */}
          <Card className="mb-8 border-purple-500/50 bg-gradient-to-br from-purple-500/5 to-purple-500/10">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                🤖 Process Existing Aerospace Articles with AI
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Apply AI-powered content formatting and tag extraction to aerospace articles. Now with 50 articles per chunk + 5 parallel chunks + auto-resume = 5-10x faster!
              </p>
              <div className="mt-3 p-4 bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg">
                <h4 className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">⚡ Performance Optimizations Active:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>✅ <strong>50 articles per chunk</strong> (5x larger batches)</li>
                  <li>✅ <strong>5 parallel chunks</strong> (5x simultaneous processing)</li>
                  <li>✅ <strong>Auto-resume enabled</strong> (no manual intervention needed)</li>
                  <li className="text-green-600 dark:text-green-400 font-bold mt-2">Combined: ~25x faster than original!</li>
                </ul>
              </div>
              
              {/* AI Processing Stats - Always Visible */}
              {aiJobStats && (
                <div className="mt-4 p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-300">📊 Current AI Processing Job</h4>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">LIVE</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {lastAiStatsUpdate && `Updated: ${lastAiStatsUpdate.toLocaleTimeString()}`}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={loadAiJobStats}
                        className="h-6 px-2 text-xs"
                      >
                        ↻ Refresh
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3">
                    Job started: {new Date(aiJobStats.startedAt || '').toLocaleString()}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="p-3 bg-background/80 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">Progress</p>
                      <p className="text-2xl font-bold text-purple-500">
                        {aerospaceArticleCounts && aerospaceArticleCounts.total > 0
                          ? Math.round((aerospaceArticleCounts.aiProcessed / aerospaceArticleCounts.total) * 100)
                          : aiJobStats.progressPercent}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {aerospaceArticleCounts && aerospaceArticleCounts.total > 0
                          ? `${aerospaceArticleCounts.aiProcessed.toLocaleString()}/${aerospaceArticleCounts.total.toLocaleString()} articles`
                          : `${aiJobStats.processedChunks}/${aiJobStats.totalChunks} chunks`}
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
                      <p className="text-xs text-muted-foreground">{aiJobStats.articlesPerMinute}/min</p>
                    </div>
                    
                    <div className="p-3 bg-background/80 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">Failed Chunks</p>
                      <p className="text-2xl font-bold text-red-500">{aiJobStats.failedChunks}</p>
                      <p className="text-xs text-muted-foreground">
                        {aiJobStats.failedChunks > 0 ? 'needs retry' : 'all good'}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-background/80 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">Time Remaining</p>
                      <p className="text-2xl font-bold text-blue-500">
                        {aiJobStats.estimatedTimeRemaining || 'Done'}
                      </p>
                      <p className="text-xs text-muted-foreground">estimated</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Overall Progress</span>
                      <span className="font-medium">
                        {aerospaceArticleCounts && aerospaceArticleCounts.total > 0
                          ? `${Math.round((aerospaceArticleCounts.aiProcessed / aerospaceArticleCounts.total) * 100)}%`
                          : `${aiJobStats.progressPercent}%`}
                      </span>
                    </div>
                    <Progress
                      value={aerospaceArticleCounts && aerospaceArticleCounts.total > 0
                        ? Math.round((aerospaceArticleCounts.aiProcessed / aerospaceArticleCounts.total) * 100)
                        : aiJobStats.progressPercent}
                      className="h-2"
                    />
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Single Article Reformatter */}
                <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
                  <h4 className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 mb-3">🔧 Reformat Single Article</h4>
                  <div className="flex gap-2">
                    <Input
                      id="single-article-id"
                      placeholder="Paste article ID here..."
                      className="flex-1"
                    />
                    <Button
                      onClick={async () => {
                        const input = document.getElementById('single-article-id') as HTMLInputElement;
                        const articleId = input?.value?.trim();
                        
                        if (!articleId) {
                          toast.error('Please enter an article ID');
                          return;
                        }

                        try {
                          toast.info('Reformatting article...');
                          const { data, error } = await supabase.functions.invoke('reformat-single-article', {
                            body: { articleId }
                          });

                          if (error) throw error;

                          toast.success('Article reformatted!', {
                            description: data.title
                          });
                          input.value = '';
                        } catch (error) {
                          console.error('Error reformatting:', error);
                          toast.error('Failed to reformat article', {
                            description: error instanceof Error ? error.message : 'Unknown error'
                          });
                        }
                      }}
                      variant="default"
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      Reformat
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Use this to fix formatting on specific articles. Article ID: <code className="bg-muted px-1 rounded">29db9154-72b2-46f1-851b-9eeae32af2f0</code>
                  </p>
                </div>

                {/* Backfill Aerospace Source URLs */}
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-3">🔗 Backfill Aerospace Source URLs</h4>
                  
                  {/* Stats Display */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-background/50 rounded-lg p-3 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Total in Database</p>
                      <p className="text-2xl font-bold text-foreground">
                        {aerospaceStats.loading ? '...' : aerospaceStats.totalInDb.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Needs Source URLs</p>
                      <p className="text-2xl font-bold text-orange-500">
                        {aerospaceStats.loading ? '...' : aerospaceStats.missingUrls.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {aerospaceStats.totalInDb > 0 && !aerospaceStats.loading
                          ? `${Math.round((aerospaceStats.missingUrls / aerospaceStats.totalInDb) * 100)}% need fixing`
                          : ''}
                      </p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Plato AI Total</p>
                      <p className="text-2xl font-bold text-blue-500">
                        {aerospaceStats.loading ? '...' : aerospaceStats.platoTotal ? aerospaceStats.platoTotal.toLocaleString() + '+' : 'Unknown'}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3">
                    Scrape actual source URLs (SpaceNews, Space.com, etc.) from Plato Data article pages. Removes Plato Data URLs and replaces with original sources. Processes 50 articles at a time with 1 second delay.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <Button
                      onClick={async () => {
                        try {
                          setImporting('backfill-test');
                          toast.info('Testing URL extraction on 1 article...', {
                            description: 'This will process just one article'
                          });

                          const { data, error } = await supabase.functions.invoke('backfill-aerospace-urls', {
                            body: { batchSize: 1, delayMs: 0 }
                          });

                          if (error) throw error;

                          if (data.updated > 0) {
                            toast.success(`✓ Test successful!`, {
                              description: `Found and updated source URL`,
                              duration: 5000
                            });
                          } else if (data.failed > 0) {
                            toast.error(`✗ Test failed`, {
                              description: `Could not find source URL in article HTML`,
                              duration: 5000
                            });
                          } else {
                            toast.info(`No articles to process`, {
                              description: data.message || 'All articles already have source URLs'
                            });
                          }

                          // Show detailed results
                          console.log('Test results:', data);
                        } catch (error) {
                          console.error('Error during test:', error);
                          toast.error('Test failed', {
                            description: error instanceof Error ? error.message : 'Unknown error'
                          });
                        } finally {
                          setImporting(null);
                        }
                      }}
                      disabled={importing === 'backfill-test'}
                      variant="outline"
                      className="bg-blue-600/10 border-blue-600 hover:bg-blue-600/20"
                    >
                      {importing === 'backfill-test' ? 'Testing...' : '🧪 Test (1 article)'}
                    </Button>
                    <Button
                    onClick={async () => {
                      if (!confirm('This will fetch and update source URLs for up to 50 aerospace articles. This may take a few minutes. Continue?')) {
                        return;
                      }

                      try {
                        setImporting('backfill-urls');
                        toast.info('Starting URL backfill...', {
                          description: 'This may take a few minutes'
                        });

                        const { data, error } = await supabase.functions.invoke('backfill-aerospace-urls', {
                          body: { batchSize: 50, delayMs: 1000 }
                        });

                        if (error) throw error;

                        toast.success(`Backfill complete!`, {
                          description: `Updated: ${data.updated}, Failed: ${data.failed}`
                        });

                        // Refresh metrics after backfill
                        await loadMetrics();
                        await loadAerospaceStats();
                      } catch (error) {
                        console.error('Error during backfill:', error);
                        toast.error('Backfill failed', {
                          description: error instanceof Error ? error.message : 'Unknown error'
                        });
                      } finally {
                        setImporting(null);
                      }
                    }}
                      disabled={importing === 'backfill-urls'}
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {importing === 'backfill-urls' ? 'Processing...' : '🚀 Run Backfill (50 articles)'}
                    </Button>
                  </div>
                </div>

                {/* Cleanup All Duplicates */}
                <div className="p-4 bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-lg">
                  <h4 className="text-sm font-semibold text-red-700 dark:text-red-300 mb-3">🧹 Clean Up Duplicate Articles (All Verticals)</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Remove duplicate articles across ALL verticals with the same title, keeping only the most recent version of each.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={async () => {
                        try {
                          setImporting('cleanup-preview');
                          toast.info('Analyzing duplicates...', {
                            description: 'This may take a moment'
                          });

                          const { data, error } = await supabase.functions.invoke('cleanup-aerospace-duplicates', {
                            body: { dryRun: true, verticalSlug: null }
                          });

                          if (error) throw error;

                          toast.success(`Found ${data.totalDuplicateArticles} duplicates`, {
                            description: `${data.duplicateTitles} titles have duplicates. Check console for details.`,
                            duration: 8000
                          });

                          console.log('🔍 Duplicate Preview:', data);
                        } catch (error) {
                          console.error('Error during preview:', error);
                          toast.error('Preview failed', {
                            description: error instanceof Error ? error.message : 'Unknown error'
                          });
                        } finally {
                          setImporting(null);
                        }
                      }}
                      disabled={importing === 'cleanup-preview'}
                      variant="outline"
                      className="border-orange-500 hover:bg-orange-500/10"
                    >
                      {importing === 'cleanup-preview' ? 'Analyzing...' : '🔍 Preview Duplicates'}
                    </Button>
                    <Button
                      onClick={async () => {
                        if (!confirm(`⚠️ WARNING: This will permanently delete duplicate articles!\n\nThis action cannot be undone. Are you absolutely sure?`)) {
                          return;
                        }

                        try {
                          setImporting('cleanup-delete');
                          toast.info('Deleting duplicates...', {
                            description: 'This may take several minutes'
                          });

                          const { data, error } = await supabase.functions.invoke('cleanup-aerospace-duplicates', {
                            body: { dryRun: false, verticalSlug: null }
                          });

                          if (error) throw error;

                          toast.success(`Deleted ${data.deletedCount} duplicates!`, {
                            description: `Cleaned up ${data.duplicateTitles} titles`,
                            duration: 8000
                          });

                          // Refresh metrics after cleanup
                          await loadMetrics();
                          await loadAerospaceStats();
                        } catch (error) {
                          console.error('Error during cleanup:', error);
                          toast.error('Cleanup failed', {
                            description: error instanceof Error ? error.message : 'Unknown error'
                          });
                        } finally {
                          setImporting(null);
                        }
                      }}
                      disabled={importing === 'cleanup-delete'}
                      variant="destructive"
                    >
                      {importing === 'cleanup-delete' ? 'Deleting...' : '🗑️ Delete Duplicates'}
                    </Button>
                  </div>
                </div>

                {/* AI Processing Job Controls - Always Visible */}
                <div className="p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg">
                  <h4 className="text-sm font-semibold text-red-700 dark:text-red-300 mb-3">⚠️ AI Processing Job Status</h4>
                  
                  {/* Aerospace Article Counts - Always Visible */}
                  <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-background/50 rounded-lg border border-border">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Total Articles</p>
                      <p className="text-2xl font-bold text-foreground">
                        {aerospaceArticleCounts ? aerospaceArticleCounts.total.toLocaleString() : '...'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">AI Processed</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {aerospaceArticleCounts ? aerospaceArticleCounts.aiProcessed.toLocaleString() : '...'}
                      </p>
                      {aerospaceArticleCounts && aerospaceArticleCounts.total > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {Math.round((aerospaceArticleCounts.aiProcessed / aerospaceArticleCounts.total) * 100)}%
                        </p>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {aerospaceArticleCounts ? aerospaceArticleCounts.remaining.toLocaleString() : '...'}
                      </p>
                      {aerospaceArticleCounts && aerospaceArticleCounts.total > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {Math.round((aerospaceArticleCounts.remaining / aerospaceArticleCounts.total) * 100)}%
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Current Job Info */}
                  {aiJobStats ? (
                    <p className="text-xs text-muted-foreground mb-3">
                      Status: <strong className={aiJobStats.status === 'completed' ? 'text-green-600' : aiJobStats.status === 'completed_with_errors' ? 'text-orange-600' : 'text-blue-600'}>{aiJobStats.status || 'in_progress'}</strong>
                      <br />
                      Started: <strong>{new Date(aiJobStats.startedAt).toLocaleString()}</strong>
                      <br />
                      Overall progress:{' '}
                      <strong>
                        {aerospaceArticleCounts && aerospaceArticleCounts.total > 0
                          ? `${aerospaceArticleCounts.aiProcessed.toLocaleString()} / ${aerospaceArticleCounts.total.toLocaleString()} articles (${Math.round((aerospaceArticleCounts.aiProcessed / aerospaceArticleCounts.total) * 100)}%)`
                          : `${aiJobStats.processedChunks} / ${aiJobStats.totalChunks} chunks (${aiJobStats.progressPercent}%)`}
                      </strong>
                      <br />
                      {aiJobStats.failedChunks > 0 && (
                        <>Failed chunks: <strong className="text-red-500">{aiJobStats.failedChunks}</strong><br /></>
                      )}
                      Articles processed:{' '}
                      <strong>
                        {aerospaceArticleCounts
                          ? aerospaceArticleCounts.aiProcessed.toLocaleString()
                          : aiJobStats.articlesProcessed.toLocaleString()}
                      </strong>
                      <br />
                      Rate:{' '}
                      <strong>
                        {aiJobStats.articlesPerMinute > 0
                          ? `${aiJobStats.articlesPerMinute} articles/min`
                          : 'calculating...'}
                      </strong>
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mb-3">
                      No active AI processing job found. Click "Smart Reset & Restart" to begin processing.
                    </p>
                  )}
                  <div className="flex gap-2">
                      <Button
                        onClick={async () => {
                          if (!confirm('This will reset the AI processing job. You will need to restart it manually. Continue?')) {
                            return;
                          }

                          try {
                            const { data: jobs } = await supabase
                              .from('ai_processing_jobs')
                              .select('id')
                              .eq('vertical_slug', 'aerospace')
                              .eq('status', 'in_progress')
                              .single();

                            if (!jobs) {
                              toast.error('No active job found');
                              return;
                            }

                            const { error } = await supabase
                              .from('ai_processing_jobs')
                              .update({ 
                                status: 'failed',
                                updated_at: new Date().toISOString()
                              })
                              .eq('id', jobs.id);
                            
                            if (error) throw error;
                            
                            toast.success('AI processing job reset successfully');
                            window.location.reload();
                          } catch (error) {
                            console.error('Error resetting job:', error);
                            toast.error('Failed to reset AI processing job');
                          }
                        }}
                        variant="destructive"
                        size="sm"
                      >
                        Reset Current Job
                      </Button>
                      <Button
                        onClick={async () => {
                          if (!confirm('🚀 This will safely reset and restart aerospace AI processing from scratch. Continue?')) {
                            return;
                          }

                          try {
                            toast.info('Resetting aerospace AI processing...');
                            setImporting('reset-aerospace-ai');
                            
                            const { data, error } = await supabase.functions.invoke('reset-aerospace-ai');
                            
                            if (error) throw error;
                            
                            toast.success('Aerospace AI processing reset and restarted!', {
                              description: `Job ID: ${data.jobId} | ${data.totalChunks} chunks to process`,
                              duration: 5000
                            });
                            
                            // Refresh the page to reload state
                            setTimeout(() => window.location.reload(), 2000);
                          } catch (error) {
                            console.error('Error resetting aerospace AI:', error);
                            toast.error('Failed to reset aerospace AI', {
                              description: error instanceof Error ? error.message : 'Unknown error'
                            });
                          } finally {
                            setImporting(null);
                          }
                        }}
                        variant="default"
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={importing === 'reset-aerospace-ai'}
                      >
                        🔄 {importing === 'reset-aerospace-ai' ? 'Resetting...' : 'Smart Reset & Restart'}
                      </Button>
                      <Button
                        onClick={async () => {
                          if (!confirm('⚠️ This will DELETE ALL AI processing jobs (current and past). This action cannot be undone. Continue?')) {
                            return;
                          }

                          try {
                            toast.info('Deleting all AI processing jobs...');
                            
                            const { data, error } = await supabase.functions.invoke('reset-ai-jobs');
                            
                            if (error) throw error;
                            
                            toast.success('All AI jobs reset!', {
                              description: data.message,
                              duration: 5000
                            });
                            
                            // Refresh the page to clear state
                            setTimeout(() => window.location.reload(), 1000);
                          } catch (error) {
                            console.error('Error resetting all jobs:', error);
                            toast.error('Failed to reset AI jobs', {
                              description: error instanceof Error ? error.message : 'Unknown error'
                            });
                          }
                        }}
                        variant="destructive"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        🗑️ Reset ALL Jobs
                      </Button>
                    </div>
                  </div>
                

                {/* Control Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={async () => {
                      if (aiProcessingActive) {
                        // Stop auto-resume
                        setAiProcessingActive(false);
                        toast.info('Auto-resume stopped. Processing will complete current chunks.');
                        return;
                      }

                      try {
                        setAiProcessingActive(true);
                        setImporting('process-aerospace-ai');
                        setProgressPercent(0);
                        setProgressStatus('Initializing...');

                        // Always reset any previous non-completed jobs so we start clean
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

                        // Get total count of aerospace articles
                        const { count } = await supabase
                          .from('articles')
                          .select('*', { count: 'exact', head: true })
                          .eq('vertical_slug', 'aerospace')
                          .not('content', 'is', null);

                        const totalArticles = count || 0;
                        const chunkSize = 50;
                        const totalChunks = Math.max(1, Math.ceil(totalArticles / chunkSize));

                        // Create a brand new processing job
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

                        toast.info('Starting AI processing from scratch', {
                          description: `${totalChunks} chunks × ${chunkSize} articles with 5× parallel processing`
                        });

                        setAiProcessingJobId(jobId);
                        setTotalAiChunks(totalChunks);

                        // Auto-resume loop
                        const processNextBatch = async () => {
                          const PARALLEL_CHUNKS = 5;
                          
                          // Get current state from database
                          const { data: currentJob } = await supabase
                            .from('ai_processing_jobs')
                            .select('processed_chunks, failed_chunks')
                            .eq('id', jobId)
                            .single();
                          
                          if (!currentJob) return false;
                          
                          const completed = currentJob.processed_chunks || [];
                          const failed = currentJob.failed_chunks || [];
                          
                          // Find next unprocessed chunks
                          const unprocessedChunks: number[] = [];
                          for (let i = 0; i < totalChunks && unprocessedChunks.length < PARALLEL_CHUNKS; i++) {
                            if (!completed.includes(i) && !failed.includes(i)) {
                              unprocessedChunks.push(i);
                            }
                          }

                          if (unprocessedChunks.length === 0) {
                            // All done!
                            await supabase
                              .from('ai_processing_jobs')
                              .update({
                                status: 'completed',
                                completed_at: new Date().toISOString()
                              })
                              .eq('id', jobId);

                            setProgressPercent(100);
                            setProgressStatus('Complete!');
                            toast.success(`AI processing complete!`, {
                              description: `Processed all ${totalArticles} articles!`
                            });
                            return false; // All done
                          }

                          // Mark chunks as in progress
                          setParallelChunksInProgress(new Set(unprocessedChunks));

                          // Process chunks in parallel
                          const promises = unprocessedChunks.map(async (chunkIndex) => {
                            try {
                              console.log(`🔄 Starting chunk ${chunkIndex + 1}/${totalChunks}...`);
                              const { data, error } = await supabase.functions.invoke('format-all-articles', {
                                body: { chunkIndex, chunkSize, verticalSlug: 'aerospace', jobId }
                              });

                              if (error || !data?.success) {
                                console.error(`❌ Chunk ${chunkIndex} failed:`, error || data);
                                return { chunkIndex, success: false };
                              }

                              console.log(`✅ Chunk ${chunkIndex + 1}/${totalChunks} complete`);
                              return { chunkIndex, success: true };
                            } catch (err) {
                              console.error(`❌ Chunk ${chunkIndex} error:`, err);
                              return { chunkIndex, success: false };
                            }
                          });

                          await Promise.all(promises);
                          setParallelChunksInProgress(new Set());

                          // Update progress
                          const { data: updatedJob } = await supabase
                            .from('ai_processing_jobs')
                            .select('processed_chunks, failed_chunks')
                            .eq('id', jobId)
                            .single();
                          
                          if (updatedJob) {
                            const rawProcessed = (updatedJob.processed_chunks || []) as number[];
                            // Deduplicate and clamp processed chunk indexes so we never exceed totalChunks
                            const validProcessed = rawProcessed.filter((i) => i >= 0 && i < totalChunks);
                            const doneCount = Array.from(new Set(validProcessed)).length;
                            const failCount = (updatedJob.failed_chunks || []).length;
                            const rawProgress = totalChunks > 0 ? Math.round((doneCount / totalChunks) * 100) : 0;
                            const clampedProgress = Math.max(0, Math.min(100, rawProgress));
                            setProgressPercent(clampedProgress);
                            setProgressStatus(`${doneCount}/${totalChunks} chunks done (${failCount} failed)`);
                            
                            // Refresh stats display
                            loadAiJobStats();
                          }

                          return true; // Continue
                        };

                        // Recursive auto-resume
                        const autoResume = async () => {
                          const shouldContinue = await processNextBatch();
                          
                          if (shouldContinue) {
                            // Continue with next batch
                            setTimeout(() => autoResume(), 1000);
                          } else {
                            // Done
                            setAiProcessingActive(false);
                            setTimeout(() => {
                              setImporting(null);
                              setProgressPercent(0);
                              setProgressStatus('');
                            }, 3000);
                          }
                        };

                        // Start auto-resume
                        autoResume();

                      } catch (error) {
                        console.error('Error processing aerospace articles:', error);
                        toast.error('Failed to process aerospace articles', {
                          description: error instanceof Error ? error.message : 'Unknown error'
                        });
                        setImporting(null);
                        setAiProcessingActive(false);
                      }
                    }}
                    disabled={importing === 'process-aerospace-ai' && !aiProcessingActive}
                    className={`flex-1 h-14 text-lg ${aiProcessingActive ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                    size="lg"
                  >
                    {aiProcessingActive ? '⏸ Stop Auto-Resume' : (importing === 'process-aerospace-ai' ? `${progressStatus}` : '🚀 Start Auto-Resume Processing')}
                  </Button>
                  
                  <Button
                    onClick={async () => {
                      await loadAiJobStats();
                      toast.success('Stats refreshed!');
                    }}
                    variant="outline"
                    className="h-14 px-6"
                    size="lg"
                  >
                    🔄 Refresh Stats
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
                    
                    {parallelChunksInProgress.size > 0 && (
                      <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30">
                        <h4 className="text-sm font-semibold mb-2">⚡ Processing in Parallel:</h4>
                        <div className="flex gap-2 flex-wrap">
                          {Array.from(parallelChunksInProgress).map(chunk => (
                            <div key={chunk} className="px-3 py-1 bg-blue-500/20 rounded-full text-sm border border-blue-500/30">
                              Chunk {chunk + 1}
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

          {/* Aerospace with AI (Original) */}
          <Card className="mb-8 border-orange-500/50 bg-gradient-to-br from-orange-500/5 to-orange-500/10">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                🚀 Aerospace FULL FEED Import with AI
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Import ALL aerospace articles from platodata.ai/aerospace with AI formatting and tag extraction. Automatically loops through all pages until the end of the feed.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={importAerospaceWithAI}
                  disabled={importing !== null}
                  className="w-full h-14 text-lg bg-orange-600 hover:bg-orange-700"
                  size="lg"
                >
                  {importing === 'aerospace-ai' ? 'Importing Full Feed (All Pages)...' : 'Import Full Aerospace Feed with AI'}
                </Button>

                {importing === 'aerospace-ai' && (
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-3 p-4 bg-background rounded-lg border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{progressStatus}</span>
                        <span className="text-sm text-muted-foreground">{progressPercent}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>

                    {/* Real-time Progress Stats */}
                    {aerospaceProgress && (
                      <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30 animate-fade-in">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></span>
                          <h4 className="font-semibold text-sm">Live Progress</h4>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {aerospaceProgress.phase === 'fetching' && (
                            <>
                              <div className="p-3 bg-background/80 rounded border">
                                <p className="text-xs text-muted-foreground mb-1">Current Page</p>
                                <p className="text-2xl font-bold text-blue-500 tabular-nums">
                                  {aerospaceProgress.currentPage}
                                </p>
                              </div>
                              <div className="p-3 bg-background/80 rounded border">
                                <p className="text-xs text-muted-foreground mb-1">Articles Collected</p>
                                <p className="text-2xl font-bold text-green-500 tabular-nums">
                                  {aerospaceProgress.articlesCollected}
                                </p>
                              </div>
                            </>
                          )}
                          
                          {aerospaceProgress.phase === 'processing' && (
                            <>
                              <div className="p-3 bg-background/80 rounded border">
                                <p className="text-xs text-muted-foreground mb-1">Processing</p>
                                <p className="text-xl font-bold text-blue-500 tabular-nums">
                                  {aerospaceProgress.articlesProcessed}/{aerospaceProgress.articlesCollected}
                                </p>
                              </div>
                              <div className="p-3 bg-background/80 rounded border">
                                <p className="text-xs text-muted-foreground mb-1">Imported</p>
                                <p className="text-xl font-bold text-green-500 tabular-nums">
                                  {aerospaceProgress.imported}
                                </p>
                              </div>
                              <div className="p-3 bg-background/80 rounded border">
                                <p className="text-xs text-muted-foreground mb-1">Skipped</p>
                                <p className="text-xl font-bold text-yellow-500 tabular-nums">
                                  {aerospaceProgress.skipped}
                                </p>
                              </div>
                              <div className="p-3 bg-background/80 rounded border">
                                <p className="text-xs text-muted-foreground mb-1">Total Pages</p>
                                <p className="text-xl font-bold text-purple-500 tabular-nums">
                                  {aerospaceProgress.totalPages}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                        
                        <div className="mt-3 p-2 bg-background/60 rounded border border-primary/20">
                          <p className="text-xs text-center text-muted-foreground">
                            {aerospaceProgress.message}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {results['aerospace-ai'] && (
                  <div className="mt-4 p-4 bg-background rounded-lg space-y-3">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Imported</p>
                        <p className="text-2xl font-bold text-green-500">{results['aerospace-ai'].imported}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Formatted</p>
                        <p className="text-2xl font-bold text-blue-500">{results['aerospace-ai'].formatted}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Tagged</p>
                        <p className="text-2xl font-bold text-purple-500">{results['aerospace-ai'].tagged}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Skipped</p>
                        <p className="text-xl font-medium">{results['aerospace-ai'].skipped}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Errors</p>
                        <p className="text-xl font-medium text-red-500">{results['aerospace-ai'].errors}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="text-xl font-medium">{(results['aerospace-ai'].duration / 1000).toFixed(1)}s</p>
                      </div>
                    </div>
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


          {/* Import History Table */}
          <ImportHistoryTable />

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