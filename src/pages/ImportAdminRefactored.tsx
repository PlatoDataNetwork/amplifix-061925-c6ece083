import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { usePlatoVerticals } from '@/hooks/usePlatoVerticals';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Play, Activity, TrendingUp, Database, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface VerticalStats {
  totalArticles: number;
  aiProcessed: number;
  remaining: number;
}

export default function ImportAdminRefactored() {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminCheck();
  const { verticals, isLoading: verticalsLoading } = usePlatoVerticals();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [globalStats, setGlobalStats] = useState<VerticalStats>({
    totalArticles: 0,
    aiProcessed: 0,
    remaining: 0
  });
  const [activeJobs, setActiveJobs] = useState<number>(0);
  const [realtimeStatus, setRealtimeStatus] = useState<string>('Idle');

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

  // Initialize URLs from verticals
  useEffect(() => {
    if (verticals.length > 0) {
      const initialUrls: Record<string, string> = {};
      verticals.forEach(v => {
        initialUrls[v.slug] = v.url;
      });
      setUrls(initialUrls);
    }
  }, [verticals]);

  // Load global stats
  const loadGlobalStats = async () => {
    try {
      const { count: totalArticles } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });

      const { count: aiProcessed } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .not('metadata->ai_processed', 'is', null);

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

  // Realtime updates for AI jobs
  useEffect(() => {
    const channel = supabase
      .channel('ai-jobs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_processing_jobs'
        },
        (payload: any) => {
          console.log('AI job change:', payload);
          const verticalSlug = payload.new?.vertical_slug || payload.old?.vertical_slug || 'unknown';
          setRealtimeStatus(`Job ${payload.eventType}: ${verticalSlug}`);
          loadGlobalStats();
          
          setTimeout(() => setRealtimeStatus('Idle'), 3000);
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
          console.log('New article:', payload);
          setRealtimeStatus('New article imported');
          loadGlobalStats();
          
          setTimeout(() => setRealtimeStatus('Idle'), 2000);
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

  const handleUrlChange = (slug: string, url: string) => {
    setUrls(prev => ({ ...prev, [slug]: url }));
  };

  const handleImport = async (slug: string, name: string) => {
    try {
      toast.info(`Starting import for ${name}...`);
      
      const { data, error } = await supabase.functions.invoke('import-articles', {
        body: { 
          vertical: slug,
          customJsonUrl: urls[slug]
        }
      });

      if (error) throw error;
      
      toast.success(`${name} import completed! ${data?.insertedArticles || 0} articles imported.`);
    } catch (error: any) {
      toast.error(`Import failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Import JSON URLs</h1>
              <p className="text-muted-foreground">
                Configure JSON feed URLs for each vertical and start imports
              </p>
            </div>
            <Badge 
              variant={realtimeStatus === 'Idle' ? 'outline' : 'default'}
              className="gap-2"
            >
              <Activity className={`h-3 w-3 ${realtimeStatus !== 'Idle' ? 'animate-pulse' : ''}`} />
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
                  {((globalStats.aiProcessed / globalStats.totalArticles) * 100).toFixed(1)}% complete
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
        <div className="space-y-3">
          {verticals.map((vertical) => (
            <Card key={vertical.slug}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label htmlFor={`url-${vertical.slug}`} className="block text-sm font-medium mb-2">
                      {vertical.name}
                    </label>
                    <input
                      id={`url-${vertical.slug}`}
                      type="url"
                      placeholder="https://platodata.ai/cannabis/json/"
                      value={urls[vertical.slug] || ''}
                      onChange={(e) => handleUrlChange(vertical.slug, e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <Button
                    onClick={() => handleImport(vertical.slug, vertical.name)}
                    disabled={!urls[vertical.slug]?.trim()}
                    className="mt-6"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Import
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
