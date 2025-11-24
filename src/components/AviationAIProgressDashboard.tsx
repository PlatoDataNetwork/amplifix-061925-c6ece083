import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface AIProcessingStats {
  totalArticles: number;
  processedArticles: number;
  unprocessedArticles: number;
  processingRate: number;
}

export default function AviationAIProgressDashboard() {
  const [stats, setStats] = useState<AIProcessingStats>({
    totalArticles: 0,
    processedArticles: 0,
    unprocessedArticles: 0,
    processingRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  const loadStats = async () => {
    try {
      // Get total count
      const { count: total } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("vertical_slug", "aviation");

      // Get processed count
      const { count: processed } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("vertical_slug", "aviation")
        .eq("metadata->>ai_processed", "true");

      const totalArticles = total || 0;
      const processedArticles = processed || 0;
      const unprocessedArticles = totalArticles - processedArticles;

      setStats({
        totalArticles,
        processedArticles,
        unprocessedArticles,
        processingRate: totalArticles > 0 ? (processedArticles / totalArticles) * 100 : 0,
      });
      setLastUpdateTime(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading AI processing stats:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();

    // Set up real-time subscription for article updates
    const channel = supabase
      .channel("aviation-ai-processing")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "articles",
          filter: "vertical_slug=eq.aviation",
        },
        (payload) => {
          console.log("Article updated:", payload);
          // Check if this is an AI processing update
          if (payload.new?.metadata?.ai_processed === true) {
            loadStats();
          }
        }
      )
      .subscribe();

    // Refresh stats every 30 seconds as backup
    const interval = setInterval(loadStats, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const progressPercent = Math.round(stats.processingRate);

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          AI Processing Progress - Aviation
        </CardTitle>
        <CardDescription>
          Real-time tracking of AI article formatting and tag extraction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress</span>
            <Badge variant={progressPercent === 100 ? "default" : "secondary"}>
              {progressPercent}%
            </Badge>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background rounded-lg p-4 space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Total Articles
            </div>
            <p className="text-3xl font-bold">{stats.totalArticles}</p>
          </div>

          <div className="bg-background rounded-lg p-4 space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Processed
            </div>
            <p className="text-3xl font-bold text-green-600">
              {stats.processedArticles}
            </p>
          </div>

          <div className="bg-background rounded-lg p-4 space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              Remaining
            </div>
            <p className="text-3xl font-bold text-yellow-600">
              {stats.unprocessedArticles}
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live Updates Active</span>
          </div>
          {lastUpdateTime && (
            <span>
              Last updated: {lastUpdateTime.toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Completion Status */}
        {progressPercent === 100 && (
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-green-900 dark:text-green-100">
              All Aviation Articles Processed!
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              {stats.totalArticles} articles have been formatted and tagged
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
