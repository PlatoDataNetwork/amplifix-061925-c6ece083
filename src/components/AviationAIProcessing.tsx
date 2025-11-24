import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Brain, Tags } from "lucide-react";

export default function AviationAIProcessing() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [chunkSize, setChunkSize] = useState(50);
  const [progress, setProgress] = useState(0);

  const startAIProcessing = async () => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      // Get total unprocessed articles count
      const { count } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("vertical_slug", "aviation")
        .or("metadata->ai_processed.is.null,metadata->ai_processed.eq.false");

      if (!count || count === 0) {
        toast({
          title: "No Articles to Process",
          description: "All Aviation articles are already processed",
        });
        setIsProcessing(false);
        return;
      }

      const totalChunks = Math.ceil(count / chunkSize);
      let processedChunks = 0;

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const { data, error } = await supabase.functions.invoke("format-all-articles", {
          body: {
            chunkIndex,
            chunkSize,
            verticalSlug: "aviation",
          },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (error) {
          console.error(`Error processing chunk ${chunkIndex}:`, error);
          toast({
            title: "Processing Error",
            description: `Failed at chunk ${chunkIndex + 1}/${totalChunks}`,
            variant: "destructive",
          });
          break;
        }

        processedChunks++;
        setProgress(Math.round((processedChunks / totalChunks) * 100));

        toast({
          title: "Chunk Processed",
          description: `Processed chunk ${processedChunks}/${totalChunks}`,
        });

        // Wait between chunks to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      toast({
        title: "AI Processing Complete",
        description: `Processed ${processedChunks} chunks successfully`,
      });
    } catch (error: any) {
      console.error("AI processing error:", error);
      toast({
        title: "Processing Failed",
        description: error.message || "Failed to process articles",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const extractTags = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      // Get all aviation articles without tags
      const { data: articles, error: fetchError } = await supabase
        .from("articles")
        .select("id, title, content, excerpt")
        .eq("vertical_slug", "aviation")
        .limit(100);

      if (fetchError) throw fetchError;

      if (!articles || articles.length === 0) {
        toast({
          title: "No Articles Found",
          description: "No Aviation articles available for tag extraction",
        });
        return;
      }

      toast({
        title: "Extracting Tags",
        description: `Processing ${articles.length} articles...`,
      });

      let processed = 0;

      for (const article of articles) {
        try {
          await supabase.functions.invoke("extract-article-tags", {
            body: { articleId: article.id },
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });
          processed++;
        } catch (error) {
          console.error(`Error extracting tags for article ${article.id}:`, error);
        }

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      toast({
        title: "Tag Extraction Complete",
        description: `Processed ${processed}/${articles.length} articles`,
      });
    } catch (error: any) {
      console.error("Tag extraction error:", error);
      toast({
        title: "Extraction Failed",
        description: error.message || "Failed to extract tags",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Article Formatting
          </CardTitle>
          <CardDescription>
            Process Aviation articles with AI to format content and identify headers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="chunkSize">Chunk Size</Label>
            <Input
              id="chunkSize"
              type="number"
              value={chunkSize}
              onChange={(e) => setChunkSize(parseInt(e.target.value))}
              min={10}
              max={100}
              disabled={isProcessing}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Number of articles to process per batch
            </p>
          </div>

          <Button
            onClick={startAIProcessing}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? "Processing..." : "Start AI Processing"}
          </Button>

          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground">
                {progress}% complete
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tags className="h-5 w-5" />
            Tag Extraction
          </CardTitle>
          <CardDescription>
            Extract and assign tags to Aviation articles based on content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={extractTags} className="w-full">
            Extract Tags
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
