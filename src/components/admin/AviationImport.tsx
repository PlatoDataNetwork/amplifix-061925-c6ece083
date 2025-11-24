import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AviationImportProps {
  importing: string | null;
  aviationProgress: {
    phase: string;
    currentPage: number;
    totalPages: number;
    articlesCollected: number;
    imported?: number;
    skipped?: number;
    errors?: number;
    percentComplete?: number;
    message: string;
  } | null;
  aviationImportTotals: {
    imported: number;
    skipped: number;
    totalProcessed: number;
    lastPage: number | null;
    status: string;
  } | null;
  aviationArticleCounts: {
    total: number;
    aiProcessed: number;
    remaining: number;
  } | null;
  onImportStart: () => void;
  onLoadMetrics: () => Promise<void>;
  onLoadAviationArticleCounts: () => Promise<void>;
}

export const AviationImport = ({
  importing,
  aviationProgress,
  aviationImportTotals,
  aviationArticleCounts,
  onImportStart,
  onLoadMetrics,
  onLoadAviationArticleCounts,
}: AviationImportProps) => {
  const importAviationFast = async () => {
    onImportStart();

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Authentication required');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('User not found');
        return;
      }

      toast.info('Starting FAST Aviation import in background...', {
        description: 'Aviation articles will be imported using JSON feed. Check Import History below for progress.'
      });

      const { data, error } = await supabase.functions.invoke('import-aviation-fast', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      await onLoadMetrics();
    } catch (error) {
      console.error('Error importing Aviation:', error);
      toast.error('Failed to start Aviation import', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const clearAviationData = async () => {
    if (!confirm('⚠️ This will permanently delete ALL Aviation data including:\n- All articles\n- Import history\n\nThis action cannot be undone. Are you sure?')) {
      return;
    }

    try {
      toast.info('Clearing Aviation data...');

      const { error: articlesError } = await supabase
        .from('articles')
        .delete()
        .eq('vertical_slug', 'aviation');

      if (articlesError) throw articlesError;

      const { error: historyError } = await supabase
        .from('import_history')
        .delete()
        .eq('vertical_slug', 'aviation');

      if (historyError) throw historyError;

      toast.success('Aviation data cleared successfully');
      await onLoadMetrics();
      await onLoadAviationArticleCounts();
    } catch (error) {
      console.error('Error clearing Aviation data:', error);
      toast.error('Failed to clear Aviation data', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  return (
    <Card className="mb-8 border-blue-500/50 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2">
            ✈️ Aviation Fast Import (JSON Feed)
          </CardTitle>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Article Counts</p>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold">
                  {aviationArticleCounts ? aviationArticleCounts.total.toLocaleString() : '0'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">AI Processed</p>
                <p className="text-lg font-bold text-green-600">
                  {aviationArticleCounts ? aviationArticleCounts.aiProcessed.toLocaleString() : '0'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Remaining</p>
                <p className="text-lg font-bold text-orange-600">
                  {aviationArticleCounts ? aviationArticleCounts.remaining.toLocaleString() : '0'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={importAviationFast}
              disabled={importing !== null}
              className="flex-1 h-14 text-lg bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {importing === 'aviation-fast' ? 'Importing Aviation...' : 'Import Aviation (Fast, No AI)'}
            </Button>
            <Button
              onClick={clearAviationData}
              disabled={importing !== null || !aviationArticleCounts?.total}
              variant="destructive"
              className="h-14 px-6"
              size="lg"
            >
              Clear Aviation
            </Button>
          </div>

          {importing === 'aviation-fast' && aviationProgress && (
            <div className="space-y-4">
              <div className="space-y-3 p-4 bg-background rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{aviationProgress.message}</span>
                  <span className="text-sm text-muted-foreground">
                    Page {aviationProgress.currentPage} / {aviationProgress.totalPages}
                  </span>
                </div>
                <Progress 
                  value={aviationProgress.percentComplete || 0} 
                  className="h-2" 
                />
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div>
                    <p className="text-muted-foreground">Collected</p>
                    <p className="font-bold">{aviationProgress.articlesCollected}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Imported</p>
                    <p className="font-bold text-green-600">{aviationProgress.imported || 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Skipped</p>
                    <p className="font-bold text-yellow-600">{aviationProgress.skipped || 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Errors</p>
                    <p className="font-bold text-red-600">{aviationProgress.errors || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {aviationImportTotals && (
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/30">
              <h4 className="text-sm font-semibold text-green-700 dark:text-green-300 mb-3">
                📊 Latest Aviation Import Session
              </h4>
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-background/80 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <p className="text-sm font-bold capitalize">{aviationImportTotals.status}</p>
                </div>
                <div className="p-3 bg-background/80 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">Imported</p>
                  <p className="text-sm font-bold text-green-600">{aviationImportTotals.imported.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-background/80 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">Skipped</p>
                  <p className="text-sm font-bold text-yellow-600">{aviationImportTotals.skipped.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-background/80 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">Last Page</p>
                  <p className="text-sm font-bold">{aviationImportTotals.lastPage || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
