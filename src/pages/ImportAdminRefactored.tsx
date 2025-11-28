import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { usePlatoVerticals } from '@/hooks/usePlatoVerticals';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Play, Activity, Database, Download, FileJson } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface VerticalData {
  slug: string;
  name: string;
  currentArticles: number;
  jsonArticles: number;
  newArticles: number;
  isLoading: boolean;
  importStatus: 'idle' | 'importing' | 'completed' | 'error';
}

export default function ImportAdminRefactored() {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminCheck();
  const { verticals, isLoading: verticalsLoading } = usePlatoVerticals();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [verticalData, setVerticalData] = useState<Record<string, VerticalData>>({});
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

  // Initialize URLs and vertical data from verticals
  useEffect(() => {
    if (verticals.length > 0) {
      const initialUrls: Record<string, string> = {};
      const initialData: Record<string, VerticalData> = {};
      
      verticals.forEach(v => {
        initialUrls[v.slug] = v.url;
        initialData[v.slug] = {
          slug: v.slug,
          name: v.name,
          currentArticles: 0,
          jsonArticles: 0,
          newArticles: 0,
          isLoading: true,
          importStatus: 'idle'
        };
      });
      
      setUrls(initialUrls);
      setVerticalData(initialData);
      
      // Load stats for each vertical
      verticals.forEach(v => loadVerticalStats(v.slug));
    }
  }, [verticals]);

  // Load stats for a specific vertical
  const loadVerticalStats = async (slug: string) => {
    try {
      // Get current articles count from DB
      const { count: currentCount } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', slug);

      // Get post_ids already in DB for this vertical
      const { data: existingArticles } = await supabase
        .from('articles')
        .select('post_id')
        .eq('vertical_slug', slug);

      const existingPostIds = new Set(existingArticles?.map(a => a.post_id) || []);

      // Fetch JSON feed to count articles
      let jsonCount = 0;
      let newCount = 0;
      
      try {
        const jsonUrl = urls[slug];
        if (jsonUrl) {
          const response = await fetch(jsonUrl);
          if (response.ok) {
            const data = await response.json();
            const articles = Array.isArray(data) ? data : data.articles || [];
            jsonCount = articles.length;
            
            // Count how many are new (not in DB)
            newCount = articles.filter((article: any) => !existingPostIds.has(article.post_id)).length;
          }
        }
      } catch (error) {
        console.error(`Error fetching JSON for ${slug}:`, error);
      }

      setVerticalData(prev => ({
        ...prev,
        [slug]: {
          ...prev[slug],
          currentArticles: currentCount || 0,
          jsonArticles: jsonCount,
          newArticles: newCount,
          isLoading: false
        }
      }));
    } catch (error) {
      console.error(`Error loading stats for ${slug}:`, error);
      setVerticalData(prev => ({
        ...prev,
        [slug]: {
          ...prev[slug],
          isLoading: false
        }
      }));
    }
  };

  // Realtime updates for imports
  useEffect(() => {
    const channel = supabase
      .channel('import-monitoring')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'import_history'
        },
        (payload: any) => {
          const verticalSlug = payload.new?.vertical_slug;
          if (verticalSlug) {
            setRealtimeStatus(`Import started: ${verticalSlug}`);
            setVerticalData(prev => ({
              ...prev,
              [verticalSlug]: {
                ...prev[verticalSlug],
                importStatus: 'importing'
              }
            }));
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'import_history'
        },
        (payload: any) => {
          const verticalSlug = payload.new?.vertical_slug;
          const status = payload.new?.status;
          
          if (verticalSlug && status === 'completed') {
            setRealtimeStatus(`Import completed: ${verticalSlug}`);
            setVerticalData(prev => ({
              ...prev,
              [verticalSlug]: {
                ...prev[verticalSlug],
                importStatus: 'completed'
              }
            }));
            
            // Reload stats for this vertical
            setTimeout(() => loadVerticalStats(verticalSlug), 1000);
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
          const verticalSlug = payload.new?.vertical_slug;
          if (verticalSlug) {
            setRealtimeStatus(`New article: ${verticalSlug}`);
            setTimeout(() => setRealtimeStatus('Monitoring...'), 2000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [urls]);

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
      setVerticalData(prev => ({
        ...prev,
        [slug]: { ...prev[slug], importStatus: 'importing' }
      }));
      
      toast.info(`Starting import for ${name}...`);
      
      const { data, error } = await supabase.functions.invoke('import-articles', {
        body: { 
          vertical: slug,
          customJsonUrl: urls[slug]
        }
      });

      if (error) throw error;
      
      setVerticalData(prev => ({
        ...prev,
        [slug]: { ...prev[slug], importStatus: 'completed' }
      }));
      
      toast.success(`${name} import completed! ${data?.insertedArticles || 0} new articles added.`);
      
      // Reload stats
      setTimeout(() => loadVerticalStats(slug), 1000);
      setTimeout(() => {
        setVerticalData(prev => ({
          ...prev,
          [slug]: { ...prev[slug], importStatus: 'idle' }
        }));
      }, 3000);
    } catch (error: any) {
      setVerticalData(prev => ({
        ...prev,
        [slug]: { ...prev[slug], importStatus: 'error' }
      }));
      toast.error(`Import failed: ${error.message}`);
      
      setTimeout(() => {
        setVerticalData(prev => ({
          ...prev,
          [slug]: { ...prev[slug], importStatus: 'idle' }
        }));
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Import Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor article counts and import new content from JSON feeds
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
        </div>

        {/* Verticals Grid */}
        <div className="grid gap-6">
          {verticals.map((vertical) => {
            const data = verticalData[vertical.slug];
            const isImporting = data?.importStatus === 'importing';
            const isCompleted = data?.importStatus === 'completed';
            const hasError = data?.importStatus === 'error';

            return (
              <Card key={vertical.slug} className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{vertical.name}</CardTitle>
                    {isImporting && (
                      <Badge variant="default" className="gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Importing...
                      </Badge>
                    )}
                    {isCompleted && (
                      <Badge variant="default" className="gap-2 bg-green-600">
                        ✓ Completed
                      </Badge>
                    )}
                    {hasError && (
                      <Badge variant="destructive">
                        Error
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center gap-2 mb-2 text-muted-foreground">
                        <Database className="h-4 w-4" />
                        <span className="text-sm font-medium">Current Articles</span>
                      </div>
                      {data?.isLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      ) : (
                        <p className="text-3xl font-bold">{data?.currentArticles.toLocaleString() || 0}</p>
                      )}
                    </div>

                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center gap-2 mb-2 text-muted-foreground">
                        <FileJson className="h-4 w-4" />
                        <span className="text-sm font-medium">In JSON Feed</span>
                      </div>
                      {data?.isLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      ) : (
                        <p className="text-3xl font-bold text-blue-600">{data?.jsonArticles.toLocaleString() || 0}</p>
                      )}
                    </div>

                    <div className="text-center p-4 rounded-lg bg-primary/10">
                      <div className="flex items-center justify-center gap-2 mb-2 text-muted-foreground">
                        <Download className="h-4 w-4" />
                        <span className="text-sm font-medium">New to Import</span>
                      </div>
                      {data?.isLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      ) : (
                        <p className="text-3xl font-bold text-primary">{data?.newArticles.toLocaleString() || 0}</p>
                      )}
                    </div>
                  </div>

                  {/* JSON URL Input and Import Button */}
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <label htmlFor={`url-${vertical.slug}`} className="block text-sm font-medium mb-2">
                        JSON Feed URL
                      </label>
                      <input
                        id={`url-${vertical.slug}`}
                        type="url"
                        placeholder="https://dashboard.platodata.io/json/..."
                        value={urls[vertical.slug] || ''}
                        onChange={(e) => handleUrlChange(vertical.slug, e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={isImporting}
                      />
                    </div>
                    <Button
                      onClick={() => handleImport(vertical.slug, vertical.name)}
                      disabled={!urls[vertical.slug]?.trim() || isImporting || data?.isLoading}
                      size="lg"
                    >
                      {isImporting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Import {data?.newArticles ? `(${data.newArticles})` : ''}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
