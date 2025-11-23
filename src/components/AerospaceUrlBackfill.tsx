import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Link as LinkIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ProgressUpdate {
  phase: string;
  total?: number;
  current?: number;
  currentTitle?: string;
  updated: number;
  failed: number;
  percentComplete: number;
}

export const AerospaceUrlBackfill = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<ProgressUpdate | null>(null);
  const [result, setResult] = useState<{
    updated: number;
    skipped: number;
    errors: number;
    pagesProcessed: number;
  } | null>(null);

  // Subscribe to progress updates
  useEffect(() => {
    if (!isRunning) return;

    const channel = supabase
      .channel('aerospace-url-backfill-progress')
      .on('broadcast', { event: 'progress' }, (payload) => {
        console.log('📡 Progress update:', payload.payload);
        setProgress(payload.payload as ProgressUpdate);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isRunning]);

  const startBackfill = async () => {
    try {
      setIsRunning(true);
      setResult(null);
      setProgress(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please log in to run backfill");
        return;
      }

      toast.info("Starting aerospace URL backfill (500 articles per batch)...");

      const { data, error } = await supabase.functions.invoke('backfill-aerospace-urls', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { batchSize: 500, delayMs: 200 },
      });

      if (error) throw error;

      setResult(data);
      toast.success(`Backfill complete! Updated ${data.updated} articles`);
    } catch (error: any) {
      console.error('Backfill error:', error);
      toast.error(error.message || "Failed to run backfill");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          Aerospace Source Links Backfill
        </CardTitle>
        <CardDescription>
          Automatically fetch and update source links for aerospace articles from Plato feed (500 articles per batch)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Processes 500 articles per batch. Fetches original source URLs by querying Plato JSON feed with post_id.
          </p>
        </div>

        {isRunning && progress && (
          <div className="space-y-4">
            {/* Phase Badge */}
            <div className="flex items-center justify-between">
              <Badge variant={progress.phase === 'complete' ? 'default' : 'secondary'}>
                {progress.phase === 'starting' && '🚀 Starting...'}
                {progress.phase === 'processing' && '⚙️ Processing'}
                {progress.phase === 'complete' && '✅ Complete'}
              </Badge>
              <span className="text-sm font-medium">{progress.percentComplete}%</span>
            </div>

            {/* Progress Bar */}
            <Progress value={progress.percentComplete} className="h-2" />

            {/* Current Article */}
            {progress.currentTitle && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  Processing [{progress.current}/{progress.total}]
                </p>
                <p className="text-sm font-medium line-clamp-1">{progress.currentTitle}...</p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-muted rounded-lg text-center">
                <div className="text-xs text-muted-foreground mb-1">Total</div>
                <div className="text-xl font-bold">{progress.total || 0}</div>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg text-center">
                <div className="text-xs text-muted-foreground mb-1">Updated</div>
                <div className="text-xl font-bold text-green-600">{progress.updated}</div>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg text-center">
                <div className="text-xs text-muted-foreground mb-1">Failed</div>
                <div className="text-xl font-bold text-red-600">{progress.failed}</div>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-3 p-4 bg-muted rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-green-600">Updated</div>
                <div className="text-2xl">{result.updated}</div>
              </div>
              <div>
                <div className="font-semibold text-yellow-600">Skipped</div>
                <div className="text-2xl">{result.skipped}</div>
              </div>
              <div>
                <div className="font-semibold text-red-600">Errors</div>
                <div className="text-2xl">{result.errors}</div>
              </div>
              <div>
                <div className="font-semibold text-blue-600">Pages</div>
                <div className="text-2xl">{result.pagesProcessed}</div>
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={startBackfill} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <LinkIcon className="mr-2 h-4 w-4" />
              Start URL Backfill
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
