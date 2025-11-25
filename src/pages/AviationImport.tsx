import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Plane, PlayCircle, BarChart3, AlertCircle, RefreshCw } from "lucide-react";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useNavigate } from "react-router-dom";
import AviationUrlBackfill from "@/components/AviationUrlBackfill";
import AviationAIProcessing from "@/components/AviationAIProcessing";
import AviationDuplicateCleanup from "@/components/AviationDuplicateCleanup";
import AviationAIProgressDashboard from "@/components/AviationAIProgressDashboard";

interface ImportProgress {
  currentPage: number;
  totalImported: number;
  totalSkipped: number;
  totalErrors: number;
  articlesInPage: number;
}

export default function AviationImport() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [currentImportId, setCurrentImportId] = useState<string | null>(null);
  const [liveProgress, setLiveProgress] = useState<{
    currentPage: number;
    totalPages: number;
    imported: number;
    skipped: number;
    totalInFeed: number;
  } | null>(null);
  const [stats, setStats] = useState({
    totalArticles: 0,
    lastImportDate: null as string | null,
    lastImportSkipped: 0,
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    loadStats();
    
    // Set up realtime subscription for article inserts
    const channel = supabase
      .channel('aviation-articles-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'articles',
          filter: 'vertical_slug=eq.aviation'
        },
        () => {
          loadStats(); // Refresh stats when new articles are added
        }
      )
      .subscribe();

    // Periodic refresh every 3 seconds during imports
    const refreshInterval = setInterval(() => {
      loadStats();
      loadLiveProgress();
    }, 3000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(refreshInterval);
    };
  }, []);

  useEffect(() => {
    if (!currentImportId) return;

    const channel = supabase.channel(`import-progress-${currentImportId}`);

    channel
      .on("broadcast", { event: "progress" }, ({ payload }) => {
        setProgress(payload);
      })
      .on("broadcast", { event: "complete" }, ({ payload }) => {
        setImporting(false);
        setProgress(null);
        toast({
          title: "Import Complete",
          description: `Imported: ${payload.totalImported}, Skipped: ${payload.totalSkipped}, Errors: ${payload.totalErrors}`,
        });
        loadStats();
      })
      .on("broadcast", { event: "error" }, ({ payload }) => {
        setImporting(false);
        setProgress(null);
        toast({
          title: "Import Failed",
          description: payload.error,
          variant: "destructive",
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentImportId]);

  const loadStats = async () => {
    const { count, error } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("vertical_slug", "aviation");

    const { data: latestArticle } = await supabase
      .from("articles")
      .select("created_at")
      .eq("vertical_slug", "aviation")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const { data: lastImport } = await supabase
      .from('import_history')
      .select('skipped_count')
      .eq('vertical_slug', 'aviation')
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error) {
      setStats({
        totalArticles: count || 0,
        lastImportDate: latestArticle?.created_at || null,
        lastImportSkipped: lastImport?.skipped_count || 0,
      });
    }
  };

  const loadLiveProgress = async () => {
    const { data: activeImport } = await supabase
      .from('import_history')
      .select('imported_count, skipped_count, total_processed, metadata')
      .eq('vertical_slug', 'aviation')
      .eq('status', 'in_progress')
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (activeImport) {
      const metadata = activeImport.metadata as any;
      setLiveProgress({
        currentPage: metadata?.currentPage || 0,
        totalPages: metadata?.totalPages || 0,
        imported: activeImport.imported_count || 0,
        skipped: activeImport.skipped_count || 0,
        totalInFeed: metadata?.totalInFeed || 0,
      });
      setImporting(true);
    } else {
      setLiveProgress(null);
      if (importing) {
        setImporting(false);
      }
    }
  };

  const startImport = async () => {
    setImporting(true);
    setProgress(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase.functions.invoke("import-aviation-fast", {
        body: {},
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setCurrentImportId(data.importId);
      toast({
        title: "Import Started",
        description: "Aviation articles are being imported in the background",
      });
    } catch (error: any) {
      console.error("Import error:", error);
      toast({
        title: "Import Failed",
        description: error.message || "Failed to start import",
        variant: "destructive",
      });
      setImporting(false);
    }
  };

  const resumeImport = async (importId: string, lastPage: number) => {
    setImporting(true);
    setProgress(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase.functions.invoke("import-aviation-fast", {
        body: {
          resumeImportId: importId,
          resumeFromPage: lastPage + 1,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setCurrentImportId(importId);
      toast({
        title: "Import Resumed",
        description: `Resuming from page ${lastPage + 1}`,
      });
    } catch (error: any) {
      console.error("Resume error:", error);
      toast({
        title: "Resume Failed",
        description: error.message || "Failed to resume import",
        variant: "destructive",
      });
      setImporting(false);
    }
  };

  if (adminLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="flex items-center gap-3 mb-8">
          <Plane className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Aviation Import Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Total Articles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.totalArticles}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Last Import</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                {stats.lastImportDate
                  ? new Date(stats.lastImportDate).toLocaleDateString()
                  : "Never"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Duplicates Skipped</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-yellow-600">{stats.lastImportSkipped}</p>
              <p className="text-xs text-muted-foreground mt-1">Last import</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Import Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-lg font-semibold">
                  {importing ? "Running" : "Idle"}
                </p>
                
                {liveProgress && importing && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Page Progress</span>
                        <span className="font-medium">
                          {liveProgress.currentPage} / {liveProgress.totalPages || '?'}
                        </span>
                      </div>
                      <Progress 
                        value={liveProgress.totalPages > 0 ? (liveProgress.currentPage / liveProgress.totalPages) * 100 : 0} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Imported</p>
                        <p className="font-bold text-green-600">{liveProgress.imported}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Skipped</p>
                        <p className="font-bold text-yellow-600">{liveProgress.skipped}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Live Import Statistics</CardTitle>
            <CardDescription>Manage import data and fix issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={async () => {
                  await loadStats();
                  toast({
                    title: "Stats Refreshed",
                    description: "Import statistics have been updated",
                  });
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Stats
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    const { data: stuckImports } = await supabase
                      .from('import_history')
                      .update({ 
                        status: 'cancelled', 
                        completed_at: new Date().toISOString() 
                      })
                      .eq('vertical_slug', 'aviation')
                      .eq('status', 'in_progress')
                      .select();

                    await loadStats();
                    
                    toast({
                      title: "Fixed Stuck Imports",
                      description: `Cancelled ${stuckImports?.length || 0} stuck import(s)`,
                    });
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Failed to fix stuck imports",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Fix Stuck
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 border-2 border-green-500">
          <CardHeader className="bg-green-50 dark:bg-green-950/20">
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <PlayCircle className="h-5 w-5" />
              🚀 IMPORT CONTROL - CLICK RESUME BELOW
            </CardTitle>
            <CardDescription>
              Import articles from platodata.ai/aviation/json/ - Currently at page 170 of 1,491
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={startImport}
                disabled={importing}
                size="lg"
                className="flex-1"
              >
                {importing ? "Import Running..." : "Start New Import"}
              </Button>
              <Button
                onClick={async () => {
                  const { data, error } = await supabase.functions.invoke('auto-resume-imports');
                  if (error) {
                    toast({ title: "Resume failed", description: error.message, variant: "destructive" });
                  } else {
                    toast({ title: "Import resumed!", description: data.message });
                    loadStats();
                  }
                }}
                disabled={importing}
                size="lg"
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Resume Import
              </Button>
            </div>

            {progress && (
              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Page {progress.currentPage}</span>
                  <span>Articles in page: {progress.articlesInPage}</span>
                </div>
                <Progress value={50} className="h-2" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {progress.totalImported}
                    </p>
                    <p className="text-xs text-muted-foreground">Imported</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {progress.totalSkipped}
                    </p>
                    <p className="text-xs text-muted-foreground">Skipped</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {progress.totalErrors}
                    </p>
                    <p className="text-xs text-muted-foreground">Errors</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6 mb-8">
          <AviationAIProgressDashboard />
          <AviationAIProcessing />
          <AviationDuplicateCleanup />
        </div>

        <AviationUrlBackfill />
      </main>
      <Footer />
    </div>
  );
}
