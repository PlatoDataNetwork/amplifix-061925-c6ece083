import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const ArticleFormatter = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupCreated, setBackupCreated] = useState(false);
  const [currentBackupName, setCurrentBackupName] = useState<string>("");
  const [backupProgress, setBackupProgress] = useState({ backed: 0, total: 0, status: '' });
  const [result, setResult] = useState<{
    success: boolean;
    total?: number;
    processed?: number;
    errors?: number;
    errorDetails?: Array<{ id: string; post_id: number; error: string }>;
    message?: string;
  } | null>(null);

  const handleCreateBackup = async () => {
    const backupName = `pre-format-${Date.now()}`;
    setIsBackingUp(true);
    setBackupProgress({ backed: 0, total: 0, status: 'starting' });

    try {
      toast.info("Starting backup process...");

      // Get total count first
      const { count: totalCount } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });

      if (!totalCount || totalCount === 0) {
        toast.info('No articles found to backup');
        setIsBackingUp(false);
        return;
      }

      setBackupProgress({ backed: 0, total: totalCount, status: 'processing' });

      const chunkSize = 5000;
      const totalChunks = Math.ceil(totalCount / chunkSize);
      let totalBacked = 0;
      let chunkIndex = 0;
      let hasMore = true;

      console.log(`Starting chunked backup: ${totalChunks} chunks for ${totalCount} articles`);

      while (hasMore && chunkIndex < totalChunks) {
        console.log(`Processing chunk ${chunkIndex + 1} of ${totalChunks}`);

        const { data, error } = await supabase.functions.invoke('backup-articles-chunked', {
          body: {
            backupName,
            backupDescription: 'Automatic backup before bulk formatting operation',
            chunkIndex,
            chunkSize
          }
        });

        if (error) {
          console.error(`Error in chunk ${chunkIndex}:`, error);
          throw error;
        }

        if (!data.success) {
          throw new Error(data.error || 'Failed to backup chunk');
        }

        totalBacked += data.backedUp;
        hasMore = data.hasMore;
        chunkIndex++;

        // Update progress
        setBackupProgress({
          backed: totalBacked,
          total: totalCount,
          status: 'processing'
        });

        console.log(`Progress: ${totalBacked} / ${totalCount} articles backed up`);

        // Brief pause between chunks to avoid overwhelming the system
        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Mark as complete
      setBackupProgress({
        backed: totalBacked,
        total: totalCount,
        status: 'completed'
      });

      setBackupCreated(true);
      setCurrentBackupName(backupName);
      toast.success(`Backup completed: ${totalBacked.toLocaleString()} articles saved in ${chunkIndex} chunks`);

    } catch (error) {
      console.error("Error creating backup:", error);
      toast.error("Failed to create backup");
      setBackupProgress(prev => ({
        ...prev,
        status: 'error'
      }));
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleFormatAllArticles = async () => {
    if (!backupCreated) {
      toast.error("Please create a backup first!");
      return;
    }

    if (!confirm(
      "⚠️ WARNING: This will apply formatting to ALL articles in the database.\n\n" +
      `A backup has been created (${currentBackupName}).\n` +
      "You can restore from this backup if needed. Continue?"
    )) {
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      toast.info("Starting article formatting process...");

      const { data, error } = await supabase.functions.invoke('format-all-articles', {
        body: {}
      });

      if (error) throw error;

      setResult(data);

      if (data.success) {
        toast.success(
          `Successfully formatted ${data.processed} of ${data.total} articles!`
        );
      } else {
        toast.error("Formatting completed with errors");
      }
    } catch (error) {
      console.error("Error formatting articles:", error);
      toast.error("Failed to format articles");
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                onClick={() => navigate("/admin")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Admin
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/admin/articles/backups")}
              >
                Manage Backups
              </Button>
            </div>
            <h1 className="text-3xl font-bold">Bulk Article Formatter</h1>
          </div>

          {/* Warning Card */}
          <Card className="mb-6 border-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-600">
                <AlertTriangle className="h-5 w-5" />
                Warning: Bulk Operation
              </CardTitle>
              <CardDescription>
                This tool will apply the formatting template to ALL articles in the database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>The formatting will:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Remove HTML links and markdown links</li>
                  <li>Convert markdown headings to HTML h2 tags</li>
                  <li>Format bold text with strong tags</li>
                  <li>Convert question headers to h2 tags</li>
                  <li>Format numbered list headers</li>
                  <li>Clean up spacing and formatting artifacts</li>
                </ul>
                <p className="text-yellow-600 font-semibold mt-4">
                  ⚠️ This operation cannot be undone. Make sure you have a backup if needed.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Backup Card */}
          <Card className={backupCreated ? 'border-green-500' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Step 1: Create Backup
                {backupCreated && <CheckCircle className="h-5 w-5 text-green-600" />}
              </CardTitle>
              <CardDescription>
                First, create a backup of all articles so you can restore them if needed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleCreateBackup}
                disabled={isBackingUp || backupCreated}
                size="lg"
                variant={backupCreated ? "outline" : "default"}
                className="w-full gap-2"
              >
                {isBackingUp ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating Backup...
                  </>
                ) : backupCreated ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Backup Created
                  </>
                ) : (
                  <>Create Backup</>
                )}
              </Button>

              {/* Progress Bar */}
              {isBackingUp && backupProgress.total > 0 && (
                <div className="space-y-2">
                  <Progress 
                    value={(backupProgress.backed / backupProgress.total) * 100} 
                    className="h-2"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    {backupProgress.status === 'processing' ? 'Backing up' : 'Starting backup of'} {backupProgress.backed.toLocaleString()} of {backupProgress.total.toLocaleString()} articles
                    ({Math.round((backupProgress.backed / backupProgress.total) * 100)}%)
                  </p>
                  {backupProgress.total > 50000 && (
                    <p className="text-xs text-muted-foreground text-center">
                      Large backup in progress. This may take several minutes...
                    </p>
                  )}
                </div>
              )}

              {backupCreated && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    Backup created: <strong>{currentBackupName}</strong>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Action Card */}
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Format All Articles</CardTitle>
              <CardDescription>
                Apply the formatting template to all articles in the database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleFormatAllArticles}
                disabled={isProcessing || !backupCreated}
                size="lg"
                className="w-full gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing Articles...
                  </>
                ) : (
                  <>Format All Articles</>
                )}
              </Button>
              {!backupCreated && (
                <p className="text-sm text-muted-foreground mt-2">
                  Create a backup first to enable formatting
                </p>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Card className={`mt-6 ${result.success ? 'border-green-500' : 'border-red-500'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.success ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Formatting Complete
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-600" />
                      Formatting Failed
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.total !== undefined && (
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{result.total}</div>
                        <div className="text-sm text-muted-foreground">Total Articles</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{result.processed}</div>
                        <div className="text-sm text-muted-foreground">Formatted</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{result.errors}</div>
                        <div className="text-sm text-muted-foreground">Errors</div>
                      </div>
                    </div>
                  )}

                  {result.message && (
                    <Alert>
                      <AlertDescription>{result.message}</AlertDescription>
                    </Alert>
                  )}

                  {result.errorDetails && result.errorDetails.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Error Details:</h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {result.errorDetails.map((err, idx) => (
                          <Alert key={idx} variant="destructive">
                            <AlertDescription>
                              <strong>Article ID {err.post_id}:</strong> {err.error}
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ArticleFormatter;
