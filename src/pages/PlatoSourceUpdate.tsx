import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Loader2, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface VerticalStats {
  vertical: string;
  total: number;
  processed: number;
  updated: number;
  skipped: number;
  errors: number;
  status: 'pending' | 'processing' | 'completed';
}

interface UpdateStats {
  totalArticles: number;
  processed: number;
  updated: number;
  skipped: number;
  errors: number;
  verticals: VerticalStats[];
}

export default function PlatoSourceUpdate() {
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<UpdateStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verticalCounts, setVerticalCounts] = useState<Record<string, number>>({});
  const { toast } = useToast();

  // Fetch vertical counts on mount
  useEffect(() => {
    const fetchVerticalCounts = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('vertical_slug')
        .not('vertical_slug', 'in', '("aerospace","aviation")');

      if (!error && data) {
        const counts: Record<string, number> = {};
        data.forEach(article => {
          counts[article.vertical_slug] = (counts[article.vertical_slug] || 0) + 1;
        });
        setVerticalCounts(counts);
      }
    };

    fetchVerticalCounts();
  }, []);

  const startUpdate = async () => {
    setIsRunning(true);
    setError(null);
    setStats(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to perform this action');
      }

      toast({
        title: "Starting Update",
        description: "Updating article sources across all verticals...",
      });

      const { data, error: functionError } = await supabase.functions.invoke(
        'update-plato-sources',
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (functionError) throw functionError;

      if (data.success) {
        setStats(data.stats);
        toast({
          title: "Update Complete",
          description: `Updated ${data.stats.updated} articles across ${data.stats.verticals.length} verticals`,
        });
      } else {
        throw new Error(data.error || 'Update failed');
      }
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.message);
      toast({
        title: "Update Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getProgress = () => {
    if (!stats) return 0;
    return stats.totalArticles > 0 
      ? (stats.processed / stats.totalArticles) * 100 
      : 0;
  };

  const getStatusBadge = (status: VerticalStats['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">Processing</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Plato Source Update</h1>
        <p className="text-muted-foreground">
          Update article sources to display "Source: Plato Data Intelligence." without backlinks
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Update Configuration</CardTitle>
          <CardDescription>
            This process will update all articles excluding Aerospace and Aviation verticals at the database level
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database-Level Updates</AlertTitle>
            <AlertDescription>
              All changes are made directly to the database. This will remove all backlinks from article sources and replace them with plain text: 
              <span className="font-mono text-sm ml-1">"Source: Plato Data Intelligence."</span>
            </AlertDescription>
          </Alert>

          {Object.keys(verticalCounts).length > 0 && !stats && (
            <div className="bg-secondary/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Verticals to Process
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
                {Object.entries(verticalCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([vertical, count]) => (
                    <div key={vertical} className="flex justify-between items-center bg-background/50 px-3 py-2 rounded">
                      <span className="capitalize">{vertical.replace(/-/g, ' ')}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              onClick={startUpdate}
              disabled={isRunning}
              size="lg"
              className="w-full"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Database...
                </>
              ) : (
                "Start Update"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {stats && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Overall Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {stats.processed} / {stats.totalArticles}
                  </span>
                </div>
                <Progress value={getProgress()} className="h-2" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold">{stats.totalArticles}</div>
                  <div className="text-sm text-muted-foreground">Total Articles</div>
                </div>
                
                <div className="bg-green-500/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.updated}
                  </div>
                  <div className="text-sm text-muted-foreground">Updated</div>
                </div>
                
                <div className="bg-blue-500/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.skipped}
                  </div>
                  <div className="text-sm text-muted-foreground">Skipped</div>
                </div>
                
                <div className="bg-red-500/10 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {stats.errors}
                  </div>
                  <div className="text-sm text-muted-foreground">Errors</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Per-Vertical Statistics</CardTitle>
              <CardDescription>
                Detailed breakdown by vertical
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.verticals.map((vertical) => (
                  <div key={vertical.vertical} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold capitalize text-lg">
                        {vertical.vertical.replace(/-/g, ' ')}
                      </h3>
                      {getStatusBadge(vertical.status)}
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Progress</span>
                        <span className="text-muted-foreground">
                          {vertical.processed} / {vertical.total}
                        </span>
                      </div>
                      <Progress 
                        value={(vertical.processed / vertical.total) * 100} 
                        className="h-2"
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-3 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-green-600 dark:text-green-400">
                          {vertical.updated}
                        </div>
                        <div className="text-xs text-muted-foreground">Updated</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-blue-600 dark:text-blue-400">
                          {vertical.skipped}
                        </div>
                        <div className="text-xs text-muted-foreground">Skipped</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-red-600 dark:text-red-400">
                          {vertical.errors}
                        </div>
                        <div className="text-xs text-muted-foreground">Errors</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{vertical.total}</div>
                        <div className="text-xs text-muted-foreground">Total</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
