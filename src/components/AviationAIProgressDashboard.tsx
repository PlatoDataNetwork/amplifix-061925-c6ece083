import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AIProcessingStats {
  totalArticles: number;
  processedArticles: number;
  unprocessedArticles: number;
  processingRate: number;
}

interface SpeedDataPoint {
  time: string;
  articlesPerMinute: number;
  timestamp: number;
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
  const [speedData, setSpeedData] = useState<SpeedDataPoint[]>([]);
  const [previousProcessed, setPreviousProcessed] = useState(0);
  const [estimatedCompletionTime, setEstimatedCompletionTime] = useState<string | null>(null);
  const [currentSpeed, setCurrentSpeed] = useState(0);

  const loadStats = async () => {
    console.log("🔄 Loading AI processing stats...");
    try {
      // Get total count
      const { count: total, error: totalError } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("vertical_slug", "aviation");

      if (totalError) {
        console.error("❌ Error fetching total:", totalError);
        throw totalError;
      }

      // Get processed count
      const { count: processed, error: processedError } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("vertical_slug", "aviation")
        .eq("metadata->>ai_processed", "true");

      if (processedError) {
        console.error("❌ Error fetching processed:", processedError);
        throw processedError;
      }

      console.log("📊 Stats loaded - Total:", total, "Processed:", processed);

      const totalArticles = total || 0;
      const processedArticles = processed || 0;
      const unprocessedArticles = totalArticles - processedArticles;

      // Calculate speed if we have previous data
      const now = Date.now();
      const timeDiff = lastUpdateTime ? (now - lastUpdateTime.getTime()) / 1000 / 60 : 1; // minutes
      const articlesDiff = processedArticles - previousProcessed;
      const speed = timeDiff > 0 ? articlesDiff / timeDiff : 0;

      // Update speed data for chart (keep last 20 data points)
      if (previousProcessed > 0 && articlesDiff > 0) {
        const newDataPoint: SpeedDataPoint = {
          time: new Date().toLocaleTimeString(),
          articlesPerMinute: Math.round(speed * 10) / 10,
          timestamp: now,
        };
        setSpeedData((prev) => [...prev.slice(-19), newDataPoint]);
        setCurrentSpeed(speed);

        // Calculate estimated completion time
        if (speed > 0 && unprocessedArticles > 0) {
          const minutesRemaining = unprocessedArticles / speed;
          const completionDate = new Date(now + minutesRemaining * 60 * 1000);
          setEstimatedCompletionTime(completionDate.toLocaleString());
        }
      }

      setStats({
        totalArticles,
        processedArticles,
        unprocessedArticles,
        processingRate: totalArticles > 0 ? (processedArticles / totalArticles) * 100 : 0,
      });
      setPreviousProcessed(processedArticles);
      setLastUpdateTime(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading AI processing stats:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("🚀 Initializing AviationAIProgressDashboard");
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
          console.log("📡 Article updated:", payload.new.id);
          // Check if this is an AI processing update
          if (payload.new?.metadata?.ai_processed === true) {
            console.log("✅ AI processed update detected, reloading stats");
            loadStats();
          }
        }
      )
      .subscribe((status) => {
        console.log("📡 Realtime subscription status:", status);
      });

    // Refresh stats every 10 seconds for active monitoring
    const interval = setInterval(() => {
      console.log("⏰ Auto-refresh stats");
      loadStats();
    }, 10000);

    return () => {
      console.log("🔌 Cleaning up AviationAIProgressDashboard");
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

        {/* Processing Speed Chart */}
        {speedData.length > 0 && progressPercent < 100 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Processing Speed Over Time
              </h3>
              <Badge variant="outline">
                {currentSpeed.toFixed(1)} articles/min
              </Badge>
            </div>
            <div className="h-48 bg-background rounded-lg p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={speedData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    label={{ value: 'Articles/min', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="articlesPerMinute" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Estimated Completion Time */}
        {estimatedCompletionTime && progressPercent < 100 && progressPercent > 0 && (
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Estimated Completion
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {estimatedCompletionTime}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on current processing speed of {currentSpeed.toFixed(1)} articles/min
                </p>
              </div>
            </div>
          </div>
        )}

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
