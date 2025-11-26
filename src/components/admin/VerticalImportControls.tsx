import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useVerticalOperations } from "@/hooks/useVerticalOperations";
import { Loader2, Play, Sparkles, Trash2, Link2, History, AlertTriangle, FileText } from "lucide-react";

interface VerticalImportControlsProps {
  verticalSlug: string;
}

export const VerticalImportControls = ({ verticalSlug }: VerticalImportControlsProps) => {
  const {
    stats,
    processing,
    loadStats,
    startFastImport,
    startAIProcessing,
    cleanupDuplicates,
    backfillUrls,
    clearImportHistory,
    clearAllArticles,
    addSourceAttribution
  } = useVerticalOperations(verticalSlug);

  useEffect(() => {
    loadStats();

    const interval = setInterval(() => {
      loadStats();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [loadStats]);

  const formatVerticalName = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (stats.loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 {formatVerticalName(verticalSlug)} Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-background rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Total Articles</p>
              <p className="text-2xl font-bold">{stats.totalArticles.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-background rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">AI Processed</p>
              <p className="text-2xl font-bold text-green-500">{stats.aiProcessed.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-background rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Remaining</p>
              <p className="text-2xl font-bold text-orange-500">{stats.remaining.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-background rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Missing URLs</p>
              <p className="text-2xl font-bold text-red-500">{stats.missingUrls.toLocaleString()}</p>
            </div>
          </div>

          {stats.lastImport && (
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Last import: {new Date(stats.lastImport).toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Import Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Import Operations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={startFastImport}
            disabled={processing}
            className="w-full h-12"
            size="lg"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Fast Import
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Imports latest articles from Plato Data feed
          </p>
        </CardContent>
      </Card>

      {/* AI Processing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Processing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {stats.aiJobStatus === 'in_progress' && (
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span className="font-semibold">{stats.aiProgress}%</span>
              </div>
              <Progress value={stats.aiProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Job ID: {stats.aiJobId}
              </p>
            </div>
          )}

          <Button
            onClick={startAIProcessing}
            disabled={processing || stats.remaining === 0}
            className="w-full h-12"
            size="lg"
            variant={stats.remaining === 0 ? "outline" : "default"}
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : stats.remaining === 0 ? (
              <>✅ All Articles Processed</>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Process {stats.remaining.toLocaleString()} Articles with AI
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Formats content and extracts tags using AI
          </p>
        </CardContent>
      </Card>

      {/* Maintenance Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔧 Maintenance Operations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={cleanupDuplicates}
            disabled={processing}
            variant="outline"
            className="w-full"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Cleanup Duplicates
          </Button>

          <Button
            onClick={backfillUrls}
            disabled={processing || stats.missingUrls === 0}
            variant="outline"
            className="w-full"
          >
            <Link2 className="mr-2 h-4 w-4" />
            Backfill Missing URLs ({stats.missingUrls})
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={processing}
                variant="outline"
                className="w-full"
              >
                <FileText className="mr-2 h-4 w-4" />
                Add Source Attribution
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Add Source Attribution?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will add "Source: Plato Data Intelligence" to the bottom of all {formatVerticalName(verticalSlug)} articles 
                  that don't already have it. The source will appear with proper styling.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={addSourceAttribution}>
                  Add Source Attribution
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={processing}
                variant="outline"
                className="w-full"
              >
                <History className="mr-2 h-4 w-4" />
                Clear Import History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Import History?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all import history records for {formatVerticalName(verticalSlug)}. 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearImportHistory}>
                  Clear History
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={processing}
                variant="destructive"
                className="w-full"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Clear All Articles
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete All Articles?</AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>This will permanently delete ALL {stats.totalArticles.toLocaleString()} articles for {formatVerticalName(verticalSlug)}.</p>
                  <p className="font-semibold text-destructive">This is IRREVERSIBLE and cannot be undone!</p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={clearAllArticles}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete All Articles
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};
