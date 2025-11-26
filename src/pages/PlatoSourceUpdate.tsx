import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Loader2, Database } from "lucide-react";
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

interface VerticalInfo {
  vertical: string;
  count: number;
}

export default function PlatoSourceUpdate() {
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<UpdateStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verticals, setVerticals] = useState<VerticalInfo[]>([]);
  const [isLoadingVerticals, setIsLoadingVerticals] = useState(true);
  const { toast } = useToast();

  // Fetch all verticals and their counts on mount
  useEffect(() => {
    const fetchVerticals = async () => {
      setIsLoadingVerticals(true);
      const { data, error } = await supabase
        .from('articles')
        .select('vertical_slug')
        .not('vertical_slug', 'in', '("aerospace","aviation")');

      if (!error && data) {
        const counts: Record<string, number> = {};
        data.forEach(article => {
          counts[article.vertical_slug] = (counts[article.vertical_slug] || 0) + 1;
        });
        
        const verticalList = Object.entries(counts)
          .map(([vertical, count]) => ({ vertical, count }))
          .sort((a, b) => b.count - a.count);
        
        setVerticals(verticalList);
      }
      setIsLoadingVerticals(false);
    };

    fetchVerticals();
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
        title: "Starting Database Update",
        description: `Processing ${verticals.reduce((sum, v) => sum + v.count, 0)} articles across ${verticals.length} verticals...`,
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
          title: "Database Update Complete",
          description: `Successfully updated ${data.stats.updated} articles across ${data.stats.verticals.length} verticals`,
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
        return <Badge className="bg-blue-500 animate-pulse">Processing</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const totalArticles = verticals.reduce((sum, v) => sum + v.count, 0);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Plato Source Update Dashboard</h1>
        <p className="text-muted-foreground">
          Update article sources across all verticals (excluding Aerospace & Aviation)
        </p>
      </div>

      <div className="grid gap-6 mb-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Verticals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{verticals.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready to process</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalArticles.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all verticals</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Successfully Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats?.updated.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Database updated</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>All Verticals to Process</CardTitle>
          <CardDescription>
            Complete list of verticals and their article counts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingVerticals ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {verticals.map(({ vertical, count }) => (
                <div 
                  key={vertical} 
                  className="flex justify-between items-center bg-secondary/30 px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <span className="capitalize text-sm font-medium">
                    {vertical.replace(/-/g, ' ')}
                  </span>
                  <Badge variant="outline" className="ml-2">
                    {count.toLocaleString()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Update Configuration</CardTitle>
          <CardDescription>
            Database-level updates with automatic source normalization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Database className="h-4 w-4" />
            <AlertTitle>What This Does</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                <li>Updates articles <strong>directly in the database</strong></li>
                <li>Replaces all source links with: <code className="bg-secondary px-1 py-0.5 rounded">Source: Plato Data Intelligence.</code></li>
                <li>Removes Zephyrnet and Plato AI references</li>
                <li>Skips articles already in correct format</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Button
            onClick={startUpdate}
            disabled={isRunning || verticals.length === 0}
            size="lg"
            className="w-full"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing {totalArticles.toLocaleString()} Articles...
              </>
            ) : (
              `Start Database Update (${totalArticles.toLocaleString()} Articles)`
            )}
          </Button>
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
                    {stats.processed.toLocaleString()} / {stats.totalArticles.toLocaleString()}
                  </span>
                </div>
                <Progress value={getProgress()} className="h-3" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold">{stats.totalArticles.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Articles</div>
                </div>
                
                <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.updated.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Successfully Updated</div>
                </div>
                
                <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.skipped.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Skipped (Already Correct)</div>
                </div>
                
                <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {stats.errors.toLocaleString()}
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
                Detailed breakdown by vertical with real-time status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.verticals.map((vertical) => (
                  <div key={vertical.vertical} className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
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
