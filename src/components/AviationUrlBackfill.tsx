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

export default function AviationUrlBackfill() {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<ProgressUpdate | null>(null);
  const [result, setResult] = useState<{
    updated: number;
    skipped: number;
    errors: number;
  } | null>(null);

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

      if (error) throw error;

      const channelName = data.channelName;

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
          toast({
            title: "Backfill Complete",
            description: `Updated: ${finalProgress.updated}, Skipped: ${finalProgress.skipped}, Errors: ${finalProgress.errors}`,
          });
        })
        .subscribe();

      toast({
        title: "Backfill Started",
        description: "Aviation URL backfill is running in the background",
      });
    } catch (error: any) {
      console.error("Backfill error:", error);
      toast({
        title: "Backfill Failed",
        description: error.message || "Failed to start backfill",
        variant: "destructive",
      });
      setIsRunning(false);
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
        <Button
          onClick={startBackfill}
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? "Backfill Running..." : "Start URL Backfill"}
        </Button>

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
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">
              Backfill Complete
            </h4>
            <div className="space-y-1 text-sm text-green-700 dark:text-green-300">
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
