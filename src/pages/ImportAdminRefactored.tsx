import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { usePlatoVerticals } from '@/hooks/usePlatoVerticals';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Play, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface VerticalStats {
  slug: string;
  name: string;
  url: string;
  totalArticles: number;
  aiProcessed: number;
  remaining: number;
  missingUrls: number;
  lastImport: string | null;
  aiJobStatus: string | null;
  aiProgress: number;
}

export default function ImportAdminRefactored() {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminCheck();
  const { verticals, isLoading: verticalsLoading } = usePlatoVerticals();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [allStats, setAllStats] = useState<VerticalStats[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [expandedVertical, setExpandedVertical] = useState<string | null>(null);

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

  // Load stats for all verticals
  const loadAllStats = async () => {
    if (verticals.length === 0) return;
    
    setStatsLoading(true);
    const stats: VerticalStats[] = [];
    
    for (const vertical of verticals) {
      try {
        // Get article counts
        const { count: totalArticles } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('vertical_slug', vertical.slug);

        const { count: aiProcessed } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('vertical_slug', vertical.slug)
          .not('metadata->ai_processed', 'is', null);

        const { count: missingUrls } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('vertical_slug', vertical.slug)
          .or('external_url.is.null,external_url.like.%platodata%');

        // Get last import
        const { data: lastImportData } = await supabase
          .from('import_history')
          .select('completed_at')
          .eq('vertical_slug', vertical.slug)
          .eq('status', 'completed')
          .order('completed_at', { ascending: false })
          .limit(1)
          .single();

        // Get AI job status
        const { data: aiJob } = await supabase
          .from('ai_processing_jobs')
          .select('*')
          .eq('vertical_slug', vertical.slug)
          .order('started_at', { ascending: false })
          .limit(1)
          .single();

        const aiProgress = aiJob && aiJob.status === 'in_progress' 
          ? Math.round((aiJob.processed_chunks.length / aiJob.total_chunks) * 100)
          : 0;

        stats.push({
          slug: vertical.slug,
          name: vertical.name,
          url: vertical.url,
          totalArticles: totalArticles || 0,
          aiProcessed: aiProcessed || 0,
          remaining: (totalArticles || 0) - (aiProcessed || 0),
          missingUrls: missingUrls || 0,
          lastImport: lastImportData?.completed_at || null,
          aiJobStatus: aiJob?.status || null,
          aiProgress
        });
      } catch (error) {
        console.error(`Error loading stats for ${vertical.slug}:`, error);
        stats.push({
          slug: vertical.slug,
          name: vertical.name,
          url: vertical.url,
          totalArticles: 0,
          aiProcessed: 0,
          remaining: 0,
          missingUrls: 0,
          lastImport: null,
          aiJobStatus: null,
          aiProgress: 0
        });
      }
    }
    
    setAllStats(stats);
    setStatsLoading(false);
  };

  useEffect(() => {
    if (!verticalsLoading && verticals.length > 0) {
      loadAllStats();
    }
  }, [verticals, verticalsLoading]);

  // Refresh stats every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!statsLoading) {
        loadAllStats();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [statsLoading]);

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

  const handleQuickImport = async (vertical: VerticalStats) => {
    try {
      toast.info(`Starting import for ${vertical.name}...`);
      
      const { data, error } = await supabase.functions.invoke('import-articles', {
        body: { 
          vertical: vertical.slug,
          customJsonUrl: vertical.url 
        }
      });

      if (error) throw error;
      
      toast.success(`${vertical.name} import completed!`);
      loadAllStats();
    } catch (error: any) {
      toast.error(`Import failed: ${error.message}`);
    }
  };

  const handleQuickAIProcess = async (vertical: VerticalStats) => {
    try {
      toast.info(`Starting AI processing for ${vertical.name}...`);
      
      const { data, error } = await supabase.functions.invoke('start-ai-processing', {
        body: { 
          verticalSlug: vertical.slug,
          fastMode: vertical.slug === 'cannabis',
          skipTags: vertical.slug === 'cannabis'
        }
      });

      if (error) throw error;
      
      toast.success(`${vertical.name} AI processing started!`);
      loadAllStats();
    } catch (error: any) {
      toast.error(`AI processing failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-[1800px]">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Import Administration</h1>
              <p className="text-muted-foreground">
                Manage article imports and AI processing across all verticals
              </p>
            </div>
            <Button onClick={loadAllStats} variant="outline" disabled={statsLoading}>
              {statsLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</>
              ) : (
                <>🔄 Refresh All</>
              )}
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Verticals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{verticals.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{allStats.reduce((sum, s) => sum + s.totalArticles, 0).toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">AI Processed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{allStats.reduce((sum, s) => sum + s.aiProcessed, 0).toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">{allStats.reduce((sum, s) => sum + s.remaining, 0).toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Missing URLs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{allStats.reduce((sum, s) => sum + s.missingUrls, 0).toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* All Verticals Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Verticals</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {statsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Vertical</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">AI Processed</TableHead>
                      <TableHead className="text-right">Remaining</TableHead>
                      <TableHead className="text-right">Missing URLs</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Import</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allStats
                      .sort((a, b) => b.totalArticles - a.totalArticles)
                      .map((vertical) => (
                        <TableRow key={vertical.slug}>
                          <TableCell className="font-medium">{vertical.name}</TableCell>
                          <TableCell className="text-right">{vertical.totalArticles.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-green-600">{vertical.aiProcessed.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-orange-600">{vertical.remaining.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-red-600">{vertical.missingUrls.toLocaleString()}</TableCell>
                          <TableCell>
                            {vertical.aiJobStatus === 'in_progress' ? (
                              <Badge variant="secondary" className="gap-1">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                {vertical.aiProgress}%
                              </Badge>
                            ) : vertical.remaining > 0 ? (
                              <Badge variant="outline">Ready</Badge>
                            ) : (
                              <Badge variant="default">Complete</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {vertical.lastImport ? new Date(vertical.lastImport).toLocaleDateString() : 'Never'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuickImport(vertical)}
                                disabled={vertical.aiJobStatus === 'in_progress'}
                              >
                                <Play className="h-3 w-3 mr-1" />
                                Import
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleQuickAIProcess(vertical)}
                                disabled={vertical.remaining === 0 || vertical.aiJobStatus === 'in_progress'}
                              >
                                <Sparkles className="h-3 w-3 mr-1" />
                                Process
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setExpandedVertical(expandedVertical === vertical.slug ? null : vertical.slug)}
                              >
                                {expandedVertical === vertical.slug ? '▼' : '▶'}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expanded Vertical Details */}
        {expandedVertical && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>
                {allStats.find(v => v.slug === expandedVertical)?.name} - Detailed Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Advanced operations and detailed statistics coming soon...
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
