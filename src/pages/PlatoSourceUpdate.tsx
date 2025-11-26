import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UpdateStats {
  totalArticles: number;
  processed: number;
  updated: number;
  skipped: number;
  errors: number;
}

export default function PlatoSourceUpdate() {
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<UpdateStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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
        description: "Updating article sources...",
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
          description: `Updated ${data.stats.updated} articles successfully`,
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

  return (
    <div className="container mx-auto p-6 max-w-4xl">
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
            This process will update all articles excluding Aerospace and Aviation verticals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              This will remove all backlinks from article sources and replace them with plain text: 
              <span className="font-mono text-sm ml-1">"Source: Plato Data Intelligence."</span>
            </AlertDescription>
          </Alert>

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
                  Updating...
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Update Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
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

            {stats.errors > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Some Updates Failed</AlertTitle>
                <AlertDescription>
                  {stats.errors} article(s) could not be updated. Check the logs for details.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
