import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Plane, PlayCircle, PauseCircle, BarChart3 } from "lucide-react";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useNavigate } from "react-router-dom";
import AviationUrlBackfill from "@/components/AviationUrlBackfill";
import AviationAIProcessing from "@/components/AviationAIProcessing";
import AviationDuplicateCleanup from "@/components/AviationDuplicateCleanup";

interface ImportProgress {
  currentPage: number;
  totalImported: number;
  totalSkipped: number;
  totalErrors: number;
  articlesInPage: number;
}

interface ImportHistory {
  id: string;
  vertical_slug: string;
  status: string;
  imported_count: number;
  skipped_count: number;
  error_count: number;
  total_processed: number;
  duration_ms: number | null;
  started_at: string;
  completed_at: string | null;
  metadata: any;
}

export default function AviationImport() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [importHistory, setImportHistory] = useState<ImportHistory[]>([]);
  const [currentImportId, setCurrentImportId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalArticles: 0,
    lastImportDate: null as string | null,
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    loadStats();
    loadImportHistory();
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
        loadImportHistory();
      })
      .on("broadcast", { event: "error" }, ({ payload }) => {
        setImporting(false);
        setProgress(null);
        toast({
          title: "Import Failed",
          description: payload.error,
          variant: "destructive",
        });
        loadImportHistory();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentImportId]);

  const loadStats = async () => {
    const { data: articles } = await supabase
      .from("articles")
      .select("id, created_at")
      .eq("vertical_slug", "aviation")
      .order("created_at", { ascending: false });

    if (articles) {
      setStats({
        totalArticles: articles.length,
        lastImportDate: articles[0]?.created_at || null,
      });
    }
  };

  const loadImportHistory = async () => {
    const { data } = await supabase
      .from("import_history")
      .select("*")
      .eq("vertical_slug", "aviation")
      .order("started_at", { ascending: false })
      .limit(10);

    if (data) {
      setImportHistory(data);
    }
  };

  const startImport = async () => {
    setImporting(true);
    setProgress(null);

    try {
      const { data, error } = await supabase.functions.invoke("import-aviation-fast", {
        body: {},
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
      const { data, error } = await supabase.functions.invoke("import-aviation-fast", {
        body: {
          resumeImportId: importId,
          resumeFromPage: lastPage + 1,
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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      in_progress: "secondary",
      failed: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <CardTitle>Import Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">
                {importing ? "Running" : "Idle"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5" />
              Import Control
            </CardTitle>
            <CardDescription>
              Import articles from platodata.ai/aviation/json/
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={startImport}
              disabled={importing}
              size="lg"
              className="w-full"
            >
              {importing ? "Import Running..." : "Start New Import"}
            </Button>

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
          <AviationUrlBackfill />
          <AviationAIProcessing />
          <AviationDuplicateCleanup />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Import History</CardTitle>
            <CardDescription>Recent import operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {importHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No import history yet
                </p>
              ) : (
                importHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(item.status)}
                        <span className="text-sm text-muted-foreground">
                          {new Date(item.started_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span className="text-green-600">
                          ✓ {item.imported_count}
                        </span>
                        <span className="text-yellow-600">
                          ⊘ {item.skipped_count}
                        </span>
                        <span className="text-red-600">✗ {item.error_count}</span>
                      </div>
                      {item.duration_ms && (
                        <span className="text-xs text-muted-foreground">
                          Duration: {(item.duration_ms / 1000).toFixed(1)}s
                        </span>
                      )}
                    </div>
                    {item.status === "failed" && item.metadata?.current_page && (
                      <Button
                        onClick={() =>
                          resumeImport(item.id, item.metadata.current_page)
                        }
                        disabled={importing}
                        size="sm"
                        variant="outline"
                      >
                        <PauseCircle className="h-4 w-4 mr-2" />
                        Resume from page {item.metadata.current_page + 1}
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
