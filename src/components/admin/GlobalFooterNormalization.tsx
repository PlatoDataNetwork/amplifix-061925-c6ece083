import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, AlertTriangle } from "lucide-react";

export const GlobalFooterNormalization = () => {
  const [processing, setProcessing] = useState(false);

  const normalizeAllFooters = async () => {
    try {
      setProcessing(true);
      toast.info("Normalizing article footers across all verticals (except aerospace/aviation)...", {
        description: "This may take a few minutes"
      });

      const { data, error } = await supabase.functions.invoke('normalize-article-footers');

      if (error) throw error;

      toast.success("Footer normalization complete!", {
        description: `Updated: ${data?.updated || 0} | Skipped: ${data?.skipped || 0} | Total: ${data?.total || 0}`,
        duration: 7000
      });
    } catch (error) {
      toast.error("Failed to normalize footers", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Global Footer Normalization
        </CardTitle>
        <CardDescription>
          Clean and standardize article footers across all verticals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4 space-y-2">
          <p className="text-sm font-medium">This will:</p>
          <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
            <li>Remove all old "Published/Source" text from article content</li>
            <li>Strip legacy Plato and Zephyrnet attribution blocks</li>
            <li>Process <strong>all verticals except Aerospace and Aviation</strong></li>
            <li>Frontend will show: <code className="bg-secondary px-1 py-0.5 rounded text-xs">Published: [date] | Source: Plato Data Intelligence</code></li>
          </ul>
        </div>

        <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-yellow-500">Important</p>
            <p className="text-sm text-muted-foreground">
              This modifies article content in the database. Run this once to clean up legacy footers.
              Aerospace and Aviation articles will not be modified.
            </p>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={processing}
              variant="default"
              className="w-full"
              size="lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {processing ? "Normalizing..." : "Normalize All Article Footers"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Normalize All Article Footers?</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>This will process all articles across all verticals (except Aerospace and Aviation) and:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Remove old "Published/Source" text embedded in content</li>
                  <li>Clean up legacy Plato and Zephyrnet attribution blocks</li>
                  <li>Standardize footer format for consistent display</li>
                </ul>
                <p className="font-semibold text-foreground mt-4">
                  This is a one-time operation. Continue?
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={normalizeAllFooters}>
                Normalize Footers
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <p className="text-xs text-muted-foreground text-center">
          After normalization, all articles will display: "Published: [date] | Source: Plato Data Intelligence"
        </p>
      </CardContent>
    </Card>
  );
};
