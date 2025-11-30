import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useVerticalOperations } from "@/hooks/useVerticalOperations";
import { useResumeAIJob } from "@/hooks/useResumeAIJob";
import { SourceAttributionMonitor } from "@/components/admin/SourceAttributionMonitor";
import { Loader2, Play, Sparkles, Trash2, Link2, History, AlertTriangle, FileText, ExternalLink, RefreshCcw, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
  
  const { resumeJob, resuming } = useResumeAIJob();
  const [fastMode, setFastMode] = useState(verticalSlug === 'cannabis');
  const [skipTags, setSkipTags] = useState(verticalSlug === 'cannabis');

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
      {/* Source Attribution Monitor */}
      <SourceAttributionMonitor 
        verticalSlug={verticalSlug} 
        isProcessing={processing}
      />

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

          <div className="mt-4 space-y-1">
            {stats.lastImport && (
              <p className="text-xs text-muted-foreground text-center">
                Last import: {new Date(stats.lastImport).toLocaleString()}
              </p>
            )}
            {stats.lastFeedSize !== null && (
              <div className="text-xs text-center">
                <span className="text-muted-foreground">Feed size: </span>
                <span className="font-semibold">{stats.lastFeedSize.toLocaleString()}</span>
                <span className="text-muted-foreground"> vs DB: </span>
                <span className="font-semibold">{stats.totalArticles.toLocaleString()}</span>
                {stats.lastFeedSize > stats.totalArticles && (
                  <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
                    (~{(stats.lastFeedSize - stats.totalArticles).toLocaleString()} potential new)
                  </span>
                )}
                {stats.lastFeedSize <= stats.totalArticles && (
                  <span className="ml-2 text-muted-foreground">
                    (up to date)
                  </span>
                )}
              </div>
            )}
          </div>
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
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="json-url" className="text-sm font-medium">
              JSON Feed URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="json-url"
                type="url"
                placeholder="https://example.com/feed.json"
                value={jsonUrl}
                onChange={(e) => setJsonUrl(e.target.value)}
                disabled={processing}
                className="flex-1"
              />
              <Button
                onClick={startFastImport}
                disabled={processing || !jsonUrl.trim()}
                size="lg"
                className="min-w-[140px]"
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Import
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the JSON feed URL from Plato Data Intelligence
            </p>
          </div>

          {stats.importJobStatus && (
            <div className="space-y-2 rounded-lg border bg-muted/60 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">
                  {stats.importJobStatus === 'in_progress'
                    ? 'Import in progress'
                    : `Import ${stats.importJobStatus}`}
                </span>
                <span className="font-semibold">
                  {stats.importProgress.toFixed(0)}%
                </span>
              </div>
              <Progress value={stats.importProgress} className="h-2" />
              <p className="text-[11px] text-muted-foreground">
                Imported {stats.importImported.toLocaleString()} · Skipped {stats.importSkipped.toLocaleString()} · Errors {stats.importErrors.toLocaleString()}
              </p>
            </div>
          )}
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
            <div className="space-y-2 mb-4 p-4 rounded-lg border-2 border-orange-500/20 bg-orange-500/5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Job In Progress</span>
                <span className="font-semibold">{stats.aiProgress}%</span>
              </div>
              <Progress value={stats.aiProgress} className="h-2" />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Job ID: {stats.aiJobId}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => stats.aiJobId && resumeJob(stats.aiJobId).then(loadStats)}
                    disabled={resuming}
                  >
                    {resuming ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Resuming...
                      </>
                    ) : (
                      <>
                        <RefreshCcw className="mr-2 h-3 w-3" />
                        Resume
                      </>
                    )}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={processing}
                      >
                        <AlertTriangle className="mr-2 h-3 w-3" />
                        Reset & Restart
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset & Restart AI Processing?</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                          <p>This will:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Mark the current stuck job as completed</li>
                            <li>Start a fresh AI processing job immediately</li>
                            <li>Use the latest cheaper model and optimized settings</li>
                          </ul>
                          <p className="font-semibold text-orange-600 dark:text-orange-400 mt-3">
                            Use this when processing gets stuck or fails to progress.
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                       <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => resetAndRestartAI(fastMode, skipTags)}>
                          Reset & Restart {fastMode && '(Fast)'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          )}

          {verticalSlug === 'cannabis' && stats.remaining > 0 && (
            <div className="space-y-3 p-4 bg-muted rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="fast-mode" className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Fast Mode
                </Label>
                <Switch
                  id="fast-mode"
                  checked={fastMode}
                  onCheckedChange={setFastMode}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Skip AI formatting, use fallback only, reduce concurrency to avoid timeouts
              </p>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="skip-tags">Skip Tag Extraction</Label>
                <Switch
                  id="skip-tags"
                  checked={skipTags}
                  onCheckedChange={setSkipTags}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Skip extracting and storing article tags for faster processing
              </p>
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : stats.remaining === 0 ? (
              <>✅ All Articles Processed</>
            ) : (
              <>
                {fastMode ? <Zap className="mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Process {stats.remaining.toLocaleString()} Articles {fastMode ? '(Fast)' : 'with AI'}
              </>
            )}
          </Button>

          {stats.aiProcessed > 0 && (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={processing}
                    variant="outline"
                    className="w-full"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Reset AI Processing ({stats.aiProcessed.toLocaleString()})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset AI Processing?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset the AI processing flag for {stats.aiProcessed.toLocaleString()} processed articles in {formatVerticalName(verticalSlug)}, 
                      allowing you to reprocess them with the improved formatting. This is useful after updating the AI processing prompt.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={resetAIProcessing}>
                      Reset Processing
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={processing}
                    variant="secondary"
                    className="w-full"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Reprocess & Extract Sources ({stats.aiProcessed.toLocaleString()})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reprocess with Source Extraction?</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                      <p>This will:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Clear AI processing flags for {stats.aiProcessed.toLocaleString()} articles</li>
                        <li>Reprocess them with the new source extraction feature</li>
                        <li>Extract and store actual source URLs (not Plato links)</li>
                        <li>Re-format content and update tags</li>
                      </ul>
                      <p className="font-semibold text-blue-600 dark:text-blue-400 mt-3">
                        Use this to add source URLs to articles that were processed before this feature was added.
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => reprocessWithSourceExtraction(fastMode, skipTags)}>
                      Reprocess {fastMode && '(Fast)'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}

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
