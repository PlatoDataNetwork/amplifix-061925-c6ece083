import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useVerticalOperations } from "@/hooks/useVerticalOperations";
import { useResumeAIJob } from "@/hooks/useResumeAIJob";
import { SourceAttributionMonitor } from "@/components/admin/SourceAttributionMonitor";
import { SourceUrlStats } from "@/components/admin/SourceUrlStats";
import { Loader2, Play, Sparkles, Trash2, Link2, History, AlertTriangle, FileText, ExternalLink, RefreshCcw, Zap, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

interface VerticalImportControlsProps {
  verticalSlug: string;
}

export const VerticalImportControls = ({ verticalSlug }: VerticalImportControlsProps) => {
  const {
    stats,
    processing,
    jsonUrl,
    setJsonUrl,
    loadStats,
    startFastImport,
    startAIProcessing,
    cleanupDuplicates,
    backfillUrls,
    clearImportHistory,
    clearAllArticles,
    addSourceAttribution,
    removeSourceAttribution,
    resetAIProcessing,
    resetAndRestartAI,
    reprocessWithSourceExtraction
  } = useVerticalOperations(verticalSlug);
  
  const cancelImport = async () => {
    const { error } = await supabase
      .from('import_history')
      .update({ cancelled: true, status: 'cancelled', completed_at: new Date().toISOString() })
      .eq('vertical_slug', verticalSlug)
      .eq('status', 'in_progress');
    
    if (error) {
      console.error('Error cancelling import:', error);
    } else {
      loadStats();
    }
  };
  
  const cancelCleanup = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('cleanup-cannabis-articles', {
        body: { action: 'cancel' }
      });
      
      if (error) throw error;
      console.log('Cleanup cancelled successfully');
      loadStats();
    } catch (error) {
      console.error('Error cancelling cleanup:', error);
    }
  };
  
  const { resumeJob, resuming } = useResumeAIJob();
  const [fastMode, setFastMode] = useState(verticalSlug === 'cannabis');
  const [skipTags, setSkipTags] = useState(verticalSlug === 'cannabis');

  // Initial load
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Real-time updates for articles and AI jobs
  useEffect(() => {
    const articlesChannel = supabase
      .channel(`vertical-${verticalSlug}-articles`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'articles',
          filter: `vertical_slug=eq.${verticalSlug}`
        },
        () => {
          loadStats();
        }
      )
      .subscribe();

    const jobsChannel = supabase
      .channel(`vertical-${verticalSlug}-jobs`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_processing_jobs',
          filter: `vertical_slug=eq.${verticalSlug}`
        },
        () => {
          loadStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(articlesChannel);
      supabase.removeChannel(jobsChannel);
    };
  }, [verticalSlug, loadStats]);

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

  // Debug logging
  console.log('🔍 VerticalImportControls Debug:', {
    verticalSlug,
    totalArticles: stats.totalArticles,
    aiProcessed: stats.aiProcessed,
    remaining: stats.remaining,
    shouldShowButton: verticalSlug === 'cannabis' && stats.totalArticles > 0
  });

  return (
    <div className="space-y-6">
      {/* Source URL Extraction Stats */}
      <SourceUrlStats verticalSlug={verticalSlug} />

      {/* Source Attribution Monitor */}
      <SourceAttributionMonitor 
        verticalSlug={verticalSlug} 
        isProcessing={processing}
      />

      {/* Stats Overview - Real-time */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              📊 {formatVerticalName(verticalSlug)} Statistics
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg border-2 border-blue-500/20">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">TOTAL ARTICLES</p>
              <p className="text-4xl font-bold">{stats.totalArticles.toLocaleString()}</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg border-2 border-green-500/20">
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">AI PROCESSED</p>
              <p className="text-4xl font-bold">{stats.aiProcessed.toLocaleString()}</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-lg border-2 border-orange-500/20">
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-2">REMAINING</p>
              <p className="text-4xl font-bold">{stats.remaining.toLocaleString()}</p>
            </div>
          </div>

          {stats.remaining > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Processing Progress</span>
                <span className="font-semibold">{Math.round((stats.aiProcessed / stats.totalArticles) * 100)}%</span>
              </div>
              <Progress value={(stats.aiProcessed / stats.totalArticles) * 100} className="h-3" />
            </div>
          )}

          <div className="mt-4 pt-4 border-t space-y-1">
            {stats.lastImport && (
              <p className="text-xs text-muted-foreground text-center">
                Last import: {new Date(stats.lastImport).toLocaleString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Streamlined 2-Step Workflow */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Quick Workflow: Import → Process
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step 1: Fast Import */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                1
              </div>
              <Label htmlFor="json-url" className="text-base font-semibold">
                Fast Import
              </Label>
            </div>
            <div className="flex gap-2">
              <Input
                id="json-url"
                type="url"
                placeholder="Paste Plato Data JSON URL..."
                value={jsonUrl}
                onChange={(e) => setJsonUrl(e.target.value)}
                disabled={processing}
                className="flex-1 h-12 text-base"
              />
              {stats.importJobStatus === 'in_progress' ? (
                <Button
                  onClick={cancelImport}
                  size="lg"
                  variant="destructive"
                  className="min-w-[140px] h-12"
                >
                  Stop Import
                </Button>
              ) : (
                <Button
                  onClick={startFastImport}
                  disabled={processing || !jsonUrl.trim()}
                  size="lg"
                  className="min-w-[140px] h-12"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      Import
                    </>
                  )}
                </Button>
              )}
            </div>
            {stats.importJobStatus && (
              <div className="space-y-2 rounded-lg border bg-background p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {stats.importJobStatus === 'in_progress' ? '⏳ Importing...' : `✅ ${stats.importJobStatus}`}
                  </span>
                  <span className="font-bold">{stats.importProgress.toFixed(0)}%</span>
                </div>
                <Progress value={stats.importProgress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Imported: {stats.importImported.toLocaleString()} · Skipped: {stats.importSkipped.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Step 2: AI Process */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                2
              </div>
              <Label className="text-base font-semibold">
                AI Process
              </Label>
            </div>

            {verticalSlug === 'cannabis' && (
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Fast Mode</span>
                </div>
                <Switch
                  checked={fastMode}
                  onCheckedChange={setFastMode}
                />
              </div>
            )}

            <Button
              onClick={() => startAIProcessing(fastMode, skipTags)}
              disabled={processing || stats.remaining === 0}
              className="w-full h-12"
              size="lg"
              variant={stats.remaining === 0 ? "outline" : "default"}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : stats.remaining === 0 ? (
                <>✅ All Articles Processed</>
              ) : (
                <>
                  {fastMode ? <Zap className="mr-2 h-5 w-5" /> : <Sparkles className="mr-2 h-5 w-5" />}
                  Process {stats.remaining.toLocaleString()} Articles
                </>
              )}
            </Button>

            {stats.aiJobStatus === 'in_progress' && (
              <div className="space-y-2 rounded-lg border-2 border-orange-500/20 bg-orange-500/5 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">⚡ AI Processing</span>
                  <span className="font-bold">{stats.aiProgress}%</span>
                </div>
                <Progress value={stats.aiProgress} className="h-2" />
                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-muted-foreground">
                    Job: {stats.aiJobId?.slice(0, 8)}...
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => stats.aiJobId && resumeJob(stats.aiJobId).then(loadStats)}
                    disabled={resuming}
                  >
                    <RefreshCcw className="mr-1 h-3 w-3" />
                    Resume
                  </Button>
                </div>
              </div>
            )}
          </div>
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
                  This will add "Source: Plato Data Intelligence" to the bottom of all <span className="font-semibold">{formatVerticalName(verticalSlug)}</span> articles 
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
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Source Attribution
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Source Attribution?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove "Source: Plato Data Intelligence" from all <span className="font-semibold">{formatVerticalName(verticalSlug)}</span> articles. 
                  You can re-add it later with the updated formatting.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={removeSourceAttribution}>
                  Remove Source Attribution
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
