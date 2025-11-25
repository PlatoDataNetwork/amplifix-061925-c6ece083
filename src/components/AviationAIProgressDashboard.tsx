import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, CheckCircle, Clock, AlertCircle, TrendingUp, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

interface AIProcessingStats {
  totalArticles: number;
  processedArticles: number;
  unprocessedArticles: number;
  processingRate: number;
}

interface ProcessingJob {
  id: string;
  started_at: string;
  status: string;
  processed_chunks: number[];
  total_chunks: number;
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentJob, setCurrentJob] = useState<ProcessingJob | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>("");
  const [lastProcessedCount, setLastProcessedCount] = useState<number>(0);
  const [lastProgressTime, setLastProgressTime] = useState<number>(Date.now());
  const [autoRecoveryAttempts, setAutoRecoveryAttempts] = useState<number>(0);

  const loadStats = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    }
    console.log("🔄 Loading AI processing stats...");
    try {
      // Get current processing job
      const { data: jobData, error: jobError } = await supabase
        .from("ai_processing_jobs")
        .select("id, started_at, status, processed_chunks, total_chunks")
        .eq("vertical_slug", "aviation")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!jobError && jobData) {
        setCurrentJob(jobData);
      }

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
      
      // Track progress for stall detection
      if (processedArticles > lastProcessedCount) {
        setLastProcessedCount(processedArticles);
        setLastProgressTime(Date.now());
        setAutoRecoveryAttempts(0); // Reset attempts on successful progress
      }
      
      setPreviousProcessed(processedArticles);
      setLastUpdateTime(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading AI processing stats:", error);
      setIsLoading(false);
    } finally {
      if (isManualRefresh) {
        setIsRefreshing(false);
      }
    }
  };

  // Calculate elapsed time
  useEffect(() => {
    if (!currentJob) return;

    const updateElapsedTime = () => {
      const startTime = new Date(currentJob.started_at).getTime();
      const now = Date.now();
      const diffMs = now - startTime;
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      if (hours > 0) {
        setElapsedTime(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setElapsedTime(`${minutes}m ${seconds}s`);
      } else {
        setElapsedTime(`${seconds}s`);
      }
    };

    updateElapsedTime();
    const timer = setInterval(updateElapsedTime, 1000);

    return () => clearInterval(timer);
  }, [currentJob]);

  // Handle resuming processing
  const handleResume = useCallback(async (autoRecovery = false) => {
    if (!currentJob) return;
    
    setIsRefreshing(true);
    try {
      const processedChunks = currentJob.processed_chunks || [];
      const totalChunks = currentJob.total_chunks;
      
      // Find the next chunk that hasn't been processed
      const nextChunk = Array.from({ length: totalChunks }, (_, i) => i)
        .find(i => !processedChunks.includes(i));
      
      if (nextChunk !== undefined) {
        console.log(`🔄 Resuming from chunk ${nextChunk}${autoRecovery ? ' (auto-recovery)' : ''}`);
        
        const { error } = await supabase.functions.invoke('format-all-articles', {
          body: { 
            chunkIndex: nextChunk,
            chunkSize: 50,
            verticalSlug: 'aviation',
            jobId: currentJob.id
          }
        });

        if (error) {
          console.error("Failed to resume processing:", error);
          if (!autoRecovery) {
            toast.error("Failed to resume processing");
          }
        } else {
          if (autoRecovery) {
            toast.success('Auto-recovery successful, processing resumed');
          } else {
            toast.success(`Resumed processing from chunk ${nextChunk}`);
          }
          setLastProgressTime(Date.now()); // Reset progress timer
          setTimeout(() => loadStats(true), 2000);
        }
      } else {
        toast.info("All chunks have been processed");
      }
    } catch (error) {
      console.error("Error resuming processing:", error);
      if (!autoRecovery) {
        toast.error("Error resuming processing");
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [currentJob]);

  // Auto-detect stalls and recover
  useEffect(() => {
    if (!currentJob || currentJob.status !== 'in_progress' || stats.unprocessedArticles === 0) {
      return;
    }

    console.log('🔍 Starting stall detection monitor');
    const checkInterval = setInterval(() => {
      const timeSinceLastProgress = Date.now() - lastProgressTime;
      const STALL_THRESHOLD = 20000; // 20 seconds without progress
      const MAX_AUTO_RECOVERY_ATTEMPTS = 3;

      console.log(`⏱️ Time since last progress: ${timeSinceLastProgress}ms, attempts: ${autoRecoveryAttempts}`);

      if (timeSinceLastProgress > STALL_THRESHOLD && autoRecoveryAttempts < MAX_AUTO_RECOVERY_ATTEMPTS) {
        console.log(`⚠️ Processing stalled for ${timeSinceLastProgress}ms, attempting auto-recovery #${autoRecoveryAttempts + 1}`);
        toast.info(`Processing stalled, attempting auto-recovery (${autoRecoveryAttempts + 1}/${MAX_AUTO_RECOVERY_ATTEMPTS})...`);
        setAutoRecoveryAttempts(prev => prev + 1);
        handleResume(true); // Auto-recovery mode
      }
    }, 5000); // Check every 5 seconds (faster stall detection)

    return () => {
      console.log('🛑 Stopping stall detection monitor');
      clearInterval(checkInterval);
    };
  }, [currentJob, stats.unprocessedArticles, lastProgressTime, autoRecoveryAttempts, handleResume]);

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

    // Refresh stats every 3 seconds for active monitoring (faster updates)
    const interval = setInterval(() => {
      console.log("⏰ Auto-refresh stats");
      loadStats();
    }, 3000);

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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              AI Processing Progress - Aviation
            </CardTitle>
            <CardDescription>
              Real-time tracking of AI article formatting and tag extraction
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadStats(true)}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {stats.unprocessedArticles > 0 && currentJob && (
              <Button
                variant="default"
                size="sm"
                onClick={() => handleResume(false)}
                disabled={isRefreshing}
              >
                Resume Processing
              </Button>
            )}
          </div>
        </div>
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

        {/* Job Info & Status */}
        {currentJob && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">Processing Started:</span>
                <span className="text-muted-foreground">
                  {new Date(currentJob.started_at).toLocaleString()}
                </span>
              </div>
              <Badge variant={currentJob.status === "completed" ? "default" : "secondary"}>
                {currentJob.status}
              </Badge>
            </div>
            {currentJob.status === "in_progress" && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Elapsed Time:</span>
                <span className="text-blue-600 font-mono">{elapsedTime}</span>
              </div>
            )}
          </div>
        )}

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
