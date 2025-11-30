import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { usePlatoVerticals } from '@/hooks/usePlatoVerticals';
import { useVerticalOperations } from '@/hooks/useVerticalOperations';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Download, Zap, Database, Activity, TrendingUp, RefreshCw, StopCircle, TestTube } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

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
  const [stoppingJobs, setStoppingJobs] = useState(false);
  const [testVertical, setTestVertical] = useState<string>('');
  const [testImporting, setTestImporting] = useState(false);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);

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

  const stopAllAIProcessing = async () => {
    try {
      setStoppingJobs(true);
      toast.info('Stopping all AI processing jobs...');

      const { data, error } = await supabase.functions.invoke('stop-all-ai-processing');

      if (error) throw error;

      toast.success('All AI processing stopped!', {
        description: `Stopped ${data?.stoppedJobs || 0} jobs`,
        duration: 5000
      });

      await loadGlobalStats();
    } catch (error) {
      toast.error('Failed to stop AI processing', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setStoppingJobs(false);
    }
  };

  const testImportVertical = async (limit: number) => {
    if (!testVertical) {
      toast.error('Please select a vertical first');
      return;
    }

    try {
      setTestImporting(true);
      toast.info(`Starting test import: ${limit} articles from ${testVertical}...`);

      const { count: beforeCount } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', testVertical);

      const { data, error } = await supabase.functions.invoke('import-articles', {
        body: {
          vertical: testVertical,
          limit: limit,
          offset: 0
        }
      });

      if (error) throw error;

      const { count: afterCount } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', testVertical);

      const imported = (afterCount ?? 0) - (beforeCount ?? 0);
      const total = afterCount ?? 0;

      // Fetch the last 10 articles for this vertical
      const { data: articles } = await supabase
        .from('articles')
        .select('id, title, post_id, published_at, vertical_slug')
        .eq('vertical_slug', testVertical)
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentArticles(articles || []);

      toast.success('Test import complete!', {
        description: `Imported: ${imported} of ${total} articles`,
        duration: 5000
      });

      await loadGlobalStats();
    } catch (error) {
      toast.error('Test import failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setTestImporting(false);
    }
  };

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
            <div className="flex items-center gap-3">
              {activeJobs > 0 && (
                <Button
                  onClick={stopAllAIProcessing}
                  disabled={stoppingJobs}
                  variant="destructive"
                  size="sm"
                >
                  {stoppingJobs ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Stopping...
                    </>
                  ) : (
                    <>
                      <StopCircle className="mr-2 h-4 w-4" />
                      Stop All AI Processing
                    </>
                  )}
                </Button>
              )}
              <Badge 
                variant={realtimeStatus === 'Monitoring...' ? 'outline' : 'default'}
                className="gap-2"
              >
                <Activity className={`h-3 w-3 ${realtimeStatus !== 'Monitoring...' ? 'animate-pulse' : ''}`} />
                {realtimeStatus}
              </Badge>
            </div>
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

        {/* Test Import Section */}
        <Card className="mb-6">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Test Import Single Vertical
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Select Vertical</label>
                <Select value={testVertical} onValueChange={setTestVertical}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a vertical..." />
                  </SelectTrigger>
                  <SelectContent>
                    {verticals.map((v) => (
                      <SelectItem key={v.slug} value={v.slug}>
                        {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => testImportVertical(5)}
                disabled={!testVertical || testImporting}
                variant="outline"
              >
                {testImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Import 5 Test Articles
              </Button>
              <Button
                onClick={() => testImportVertical(10)}
                disabled={!testVertical || testImporting}
                variant="outline"
              >
                {testImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Import 10 Test Articles
              </Button>
              <Button
                onClick={() => testImportVertical(25)}
                disabled={!testVertical || testImporting}
                variant="outline"
              >
                {testImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Import 25 Test Articles
              </Button>
            </div>

            {/* Recent Articles Table */}
            {recentArticles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Last 10 Imported Articles</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-2 font-medium">Title</th>
                        <th className="text-left p-2 font-medium">Post ID</th>
                        <th className="text-left p-2 font-medium">Published</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentArticles.map((article, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="p-2 max-w-md">
                            <a
                              href={`/intel/article/${article.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline truncate block"
                            >
                              {article.title}
                            </a>
                          </td>
                          <td className="p-2">{article.post_id}</td>
                          <td className="p-2">
                            {new Date(article.published_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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