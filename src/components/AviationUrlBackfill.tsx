import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface ProgressUpdate {
  phase: string;
  currentArticle: number;
  totalArticles: number;
  updated: number;
  skipped: number;
  errors: number;
  percentage: number;
}

interface BackfillResult {
  updated: number;
  skipped: number;
  errors: number;
  cancelled?: boolean;
}

export default function AviationUrlBackfill() {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<ProgressUpdate | null>(null);
  const [result, setResult] = useState<BackfillResult | null>(null);
  const [importId, setImportId] = useState<string | null>(null);
  const [onStatsRefresh, setOnStatsRefresh] = useState<(() => void) | null>(null);

  const startBackfill = async () => {
    setIsRunning(true);
    setProgress(null);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase.functions.invoke("backfill-aviation-urls", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error("Backfill invocation error:", error);
        throw new Error(error.message || "Failed to start backfill");
      }

      const channelName = data.channelName;
      const newImportId = data.importId;
      setImportId(newImportId);

      const channel = supabase.channel(channelName);

      channel
        .on("broadcast", { event: "progress" }, ({ payload }) => {
          setProgress(payload as ProgressUpdate);
        })
        .on("broadcast", { event: "complete" }, ({ payload }) => {
          const finalProgress = payload as ProgressUpdate;
          setResult({
            updated: finalProgress.updated,
            skipped: finalProgress.skipped,
            errors: finalProgress.errors,
          });
          setIsRunning(false);
          setProgress(null);
          setImportId(null);
          if (onStatsRefresh) onStatsRefresh();
          toast({
            title: "Backfill Complete",
            description: `Updated: ${finalProgress.updated}, Skipped: ${finalProgress.skipped}, Errors: ${finalProgress.errors}`,
          });
        })
        .on("broadcast", { event: "cancelled" }, ({ payload }) => {
          const cancelledProgress = payload as ProgressUpdate;
          setResult({
            updated: cancelledProgress.updated,
            skipped: cancelledProgress.skipped,
            errors: cancelledProgress.errors,
            cancelled: true,
          });
          setIsRunning(false);
          setProgress(null);
          setImportId(null);
          if (onStatsRefresh) onStatsRefresh();
          toast({
            title: "Backfill Cancelled",
            description: `Partial results - Updated: ${cancelledProgress.updated}, Skipped: ${cancelledProgress.skipped}, Errors: ${cancelledProgress.errors}`,
          });
        })
        .subscribe();

      toast({
        title: "Backfill Started",
        description: "Aviation URL backfill is running in the background",
      });
    } catch (error: any) {
      console.error("Backfill error:", error);
      
      let errorMessage = error.message || "Failed to start backfill";
      
      // Provide helpful error messages
      if (error.message?.includes("Unauthorized") || error.message?.includes("401")) {
        errorMessage = "You need to be logged in as an admin to run this backfill";
      } else if (error.message?.includes("Admin access required") || error.message?.includes("403")) {
        errorMessage = "You need admin privileges to run this backfill";
      }
      
      toast({
        title: "Backfill Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsRunning(false);
    }
  };

  const cancelBackfill = async () => {
    if (!importId) return;

    try {
      const { error } = await supabase
        .from('import_history')
        .update({ cancelled: true })
        .eq('id', importId);

      if (error) {
        console.error('Error cancelling backfill:', error);
        toast({
          title: "Cancel Failed",
          description: "Failed to cancel backfill",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cancellation Requested",
          description: "The backfill will stop after the current batch completes",
        });
      }
    } catch (error) {
      console.error('Error cancelling backfill:', error);
      toast({
        title: "Cancel Failed",
        description: "Failed to cancel backfill",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Aviation URL Backfill
        </CardTitle>
        <CardDescription>
          Extract source URLs from platodata.ai for Aviation articles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={startBackfill}
            disabled={isRunning}
            className="flex-1"
          >
            {isRunning ? "Backfill Running..." : "Start URL Backfill"}
          </Button>
          {isRunning && (
            <Button
              onClick={cancelBackfill}
              variant="destructive"
            >
              Cancel
            </Button>
          )}
        </div>

        {progress && (
          <div className="space-y-3 p-4 bg-muted rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Processing article {progress.currentArticle} of {progress.totalArticles}</span>
              <span>{progress.percentage}%</span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <CheckCircle2 className="h-5 w-5 text-green-600 mb-1" />
                <p className="text-xl font-bold">{progress.updated}</p>
                <p className="text-xs text-muted-foreground">Updated</p>
              </div>
              <div className="flex flex-col items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mb-1" />
                <p className="text-xl font-bold">{progress.skipped}</p>
                <p className="text-xs text-muted-foreground">Skipped</p>
              </div>
              <div className="flex flex-col items-center">
                <XCircle className="h-5 w-5 text-red-600 mb-1" />
                <p className="text-xl font-bold">{progress.errors}</p>
                <p className="text-xs text-muted-foreground">Errors</p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.cancelled 
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' 
              : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          }`}>
            <h4 className={`font-semibold mb-2 ${
              result.cancelled 
                ? 'text-yellow-800 dark:text-yellow-200' 
                : 'text-green-800 dark:text-green-200'
            }`}>
              {result.cancelled ? 'Backfill Cancelled - Partial Results' : 'Backfill Complete'}
            </h4>
            <div className={`space-y-1 text-sm ${
              result.cancelled 
                ? 'text-yellow-700 dark:text-yellow-300' 
                : 'text-green-700 dark:text-green-300'
            }`}>
              <p>✓ Updated: {result.updated}</p>
              <p>⊘ Skipped: {result.skipped}</p>
              <p>✗ Errors: {result.errors}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
