import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";

interface CleanupResult {
  duplicatesFound: number;
  duplicatesRemoved: number;
  errors: string[];
}

export default function AviationDuplicateCleanup() {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<CleanupResult | null>(null);

  const runCleanup = async () => {
    setIsRunning(true);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      toast({
        title: "Starting Cleanup",
        description: "Detecting and removing duplicate Aviation articles...",
      });

      const { data, error } = await supabase.functions.invoke(
        "cleanup-aviation-duplicates",
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (error) throw error;

      setResult(data as CleanupResult);

      if (data.errors && data.errors.length > 0) {
        toast({
          title: "Cleanup Completed with Errors",
          description: `Found: ${data.duplicatesFound}, Removed: ${data.duplicatesRemoved}, Errors: ${data.errors.length}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cleanup Complete",
          description: `Successfully removed ${data.duplicatesRemoved} duplicate articles`,
        });
      }
    } catch (error: any) {
      console.error("Cleanup error:", error);
      toast({
        title: "Cleanup Failed",
        description: error.message || "Failed to clean up duplicates",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          Aviation Duplicate Cleanup
        </CardTitle>
        <CardDescription>
          Detect and remove duplicate Aviation articles based on post_id
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This will permanently delete duplicate articles. For each post_id, only
            the oldest article will be kept.
          </AlertDescription>
        </Alert>

        <Button
          onClick={runCleanup}
          disabled={isRunning}
          variant="destructive"
          className="w-full"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Cleanup...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Run Duplicate Cleanup
            </>
          )}
        </Button>

        {result && (
          <div className="space-y-3">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">Cleanup Results</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Duplicates Found</p>
                  <p className="text-2xl font-bold">{result.duplicatesFound}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duplicates Removed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {result.duplicatesRemoved}
                  </p>
                </div>
              </div>
            </div>

            {result.errors && result.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-semibold mb-2">
                    {result.errors.length} errors occurred:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    {result.errors.slice(0, 5).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                    {result.errors.length > 5 && (
                      <li>... and {result.errors.length - 5} more</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
