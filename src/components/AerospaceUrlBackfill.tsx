import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Link as LinkIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const AerospaceUrlBackfill = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{
    updated: number;
    skipped: number;
    errors: number;
    pagesProcessed: number;
  } | null>(null);

  const startBackfill = async () => {
    try {
      setIsRunning(true);
      setResult(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please log in to run backfill");
        return;
      }

      toast.info("Starting aerospace URL backfill...");

      const { data, error } = await supabase.functions.invoke('backfill-aerospace-urls', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
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
          Automatically fetch and update source links for aerospace articles from the Plato feed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            This will match articles by post_id and add their original source URLs from platodata.ai
          </p>
        </div>

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
