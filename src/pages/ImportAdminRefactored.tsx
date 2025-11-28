import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { usePlatoVerticals } from '@/hooks/usePlatoVerticals';
import { useVerticalOperations } from '@/hooks/useVerticalOperations';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Download, Zap, Database, Activity, TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface GlobalStats {
  totalArticles: number;
  aiProcessed: number;
  remaining: number;
}

export default function ImportAdminRefactored() {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminCheck();
  const { verticals, isLoading: verticalsLoading } = usePlatoVerticals();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalArticles: 0,
    aiProcessed: 0,
    remaining: 0
  });
  const [activeJobs, setActiveJobs] = useState<number>(0);
  const [realtimeStatus, setRealtimeStatus] = useState<string>('Monitoring...');

  // Timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading || verticalsLoading) {
        setLoadingTimeout(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [loading, verticalsLoading]);

  // Redirect if not admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  // Load global stats
  const loadGlobalStats = async () => {
    try {
      const { count: totalArticles } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });

      const { count: aiProcessed } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('metadata->>ai_processed', 'true');

      const { count: activeJobsCount } = await supabase
        .from('ai_processing_jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'in_progress');

      setGlobalStats({
        totalArticles: totalArticles || 0,
        aiProcessed: aiProcessed || 0,
        remaining: (totalArticles || 0) - (aiProcessed || 0)
      });

      setActiveJobs(activeJobsCount || 0);
    } catch (error) {
      console.error('Error loading global stats:', error);
    }
  };

  useEffect(() => {
    if (!loading && !verticalsLoading) {
      loadGlobalStats();
    }
  }, [loading, verticalsLoading]);

  // Realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('import-monitoring')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_processing_jobs'
        },
        (payload: any) => {
          const verticalSlug = payload.new?.vertical_slug || payload.old?.vertical_slug;
          if (verticalSlug) {
            setRealtimeStatus(`AI Job update: ${verticalSlug}`);
            loadGlobalStats();
            setTimeout(() => setRealtimeStatus('Monitoring...'), 3000);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'articles'
        },
        (payload: any) => {
          setRealtimeStatus('New article imported');
          loadGlobalStats();
          setTimeout(() => setRealtimeStatus('Monitoring...'), 2000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto refresh stats every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadGlobalStats();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  if ((loading || verticalsLoading) && !loadingTimeout) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (loadingTimeout) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Loading timeout. Please refresh the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Import & AI Processing Dashboard</h1>
              <p className="text-muted-foreground">
                Fast import articles and process them with AI
              </p>
            </div>
            <Badge 
              variant={realtimeStatus === 'Monitoring...' ? 'outline' : 'default'}
              className="gap-2"
            >
              <Activity className={`h-3 w-3 ${realtimeStatus !== 'Monitoring...' ? 'animate-pulse' : ''}`} />
              {realtimeStatus}
            </Badge>
          </div>

          {/* Global Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Total Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{globalStats.totalArticles.toLocaleString()}</p>
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
                <p className="text-3xl font-bold text-green-600">{globalStats.aiProcessed.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {globalStats.totalArticles > 0 
                    ? ((globalStats.aiProcessed / globalStats.totalArticles) * 100).toFixed(1) 
                    : 0}% complete
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Remaining
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600">{globalStats.remaining.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Active Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{activeJobs}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Verticals List */}
        <div className="space-y-4">
          {verticals.map((vertical) => (
            <VerticalCard 
              key={vertical.slug} 
              slug={vertical.slug} 
              name={vertical.name}
              defaultUrl={vertical.url}
              onStatsChange={loadGlobalStats}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface VerticalCardProps {
  slug: string;
  name: string;
  defaultUrl: string;
  onStatsChange: () => void;
}

function VerticalCard({ slug, name, defaultUrl, onStatsChange }: VerticalCardProps) {
  const {
    stats,
    processing,
    jsonUrl,
    setJsonUrl,
    startFastImport,
    startAIProcessing,
    loadStats
  } = useVerticalOperations(slug);

  useEffect(() => {
    setJsonUrl(defaultUrl);
  }, [defaultUrl, setJsonUrl]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleFastImport = async () => {
    await startFastImport();
    onStatsChange();
    setTimeout(() => loadStats(), 1000);
  };

  const handleAIProcessing = async (fastMode: boolean) => {
    await startAIProcessing(fastMode, false);
    onStatsChange();
    setTimeout(() => loadStats(), 1000);
  };

  return (
    <Card>
      <CardHeader className="bg-muted/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{name}</CardTitle>
          {stats.aiJobStatus === 'in_progress' && (
            <Badge variant="default" className="gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              AI Processing...
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Total Articles</p>
            <p className="text-2xl font-bold">{stats.totalArticles.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">AI Processed</p>
            <p className="text-2xl font-bold text-green-600">{stats.aiProcessed.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Remaining</p>
            <p className="text-2xl font-bold text-orange-600">{stats.remaining.toLocaleString()}</p>
          </div>
        </div>

        {/* AI Progress */}
        {stats.aiJobStatus === 'in_progress' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">AI Processing Progress</span>
              <span className="font-medium">{stats.aiProgress}%</span>
            </div>
            <Progress value={stats.aiProgress} className="h-2" />
          </div>
        )}

        {/* JSON URL Input */}
        <div>
          <label htmlFor={`url-${slug}`} className="block text-sm font-medium mb-2">
            JSON Feed URL
          </label>
          <Input
            id={`url-${slug}`}
            type="url"
            placeholder="https://dashboard.platodata.io/json/..."
            value={jsonUrl}
            onChange={(e) => setJsonUrl(e.target.value)}
            disabled={processing || stats.loading}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleFastImport}
            disabled={!jsonUrl.trim() || processing || stats.loading}
            variant="default"
            className="flex-1"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Fast Import
              </>
            )}
          </Button>
          
          <Button
            onClick={() => handleAIProcessing(false)}
            disabled={stats.remaining === 0 || processing || stats.aiJobStatus === 'in_progress'}
            variant="secondary"
            className="flex-1"
          >
            <Zap className="mr-2 h-4 w-4" />
            AI Process ({stats.remaining})
          </Button>

          <Button
            onClick={() => loadStats()}
            disabled={stats.loading}
            variant="outline"
            size="icon"
          >
            <RefreshCw className={`h-4 w-4 ${stats.loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}