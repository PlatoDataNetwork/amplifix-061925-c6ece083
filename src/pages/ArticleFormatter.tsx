import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const ArticleFormatter = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    total?: number;
    processed?: number;
    errors?: number;
    errorDetails?: Array<{ id: string; post_id: number; error: string }>;
    message?: string;
  } | null>(null);

  const handleFormatAllArticles = async () => {
    if (!confirm(
      "⚠️ WARNING: This will apply formatting to ALL articles in the database.\n\n" +
      "This operation cannot be undone. Are you sure you want to continue?"
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
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => navigate("/admin")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Button>
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

          {/* Action Card */}
          <Card>
            <CardHeader>
              <CardTitle>Format All Articles</CardTitle>
              <CardDescription>
                Click the button below to start the bulk formatting process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleFormatAllArticles}
                disabled={isProcessing}
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
