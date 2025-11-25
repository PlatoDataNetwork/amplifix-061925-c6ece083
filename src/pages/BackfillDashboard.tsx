import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Play, Square, Clock, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface BackfillJob {
  id: string;
  vertical_slug: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  imported_count: number;
  skipped_count: number;
  error_count: number;
  total_processed: number;
  cancelled: boolean;
  duration_ms: number | null;
  metadata: any;
}

interface LiveProgress {
  currentArticle: number;
  totalArticles: number;
  updated: number;
  skipped: number;
  errors: number;
  percentage: number;
  startTime: number;
  articlesPerSecond?: number;
  estimatedSecondsRemaining?: number;
}

export default function BackfillDashboard() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<BackfillJob[]>([]);
  const [liveProgress, setLiveProgress] = useState<Record<string, LiveProgress>>({});
  const [loading, setLoading] = useState(true);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 30000); // Refresh every 30 seconds as fallback
    return () => clearInterval(interval);
  }, []);

  // Realtime subscription for live updates
  useEffect(() => {
    const channel = supabase
      .channel('import-history-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'import_history',
          filter: 'metadata->>type=eq.url_backfill'
        },
        (payload) => {
          console.log('📡 Realtime update:', payload);
          const updatedJob = payload.new as BackfillJob;
          setLastUpdate(new Date());
          
          setJobs(prevJobs => {
            // Find and update the job for this vertical
            const jobIndex = prevJobs.findIndex(j => j.vertical_slug === updatedJob.vertical_slug);
            
            if (jobIndex !== -1) {
              // Update existing job
              const newJobs = [...prevJobs];
              newJobs[jobIndex] = updatedJob;
              return newJobs;
            } else {
              // Add new job
              return [...prevJobs, updatedJob];
            }
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'import_history',
          filter: 'metadata->>type=eq.url_backfill'
        },
        (payload) => {
          console.log('📡 New backfill job started:', payload);
          const newJob = payload.new as BackfillJob;
          setLastUpdate(new Date());
          
          setJobs(prevJobs => {
            // Replace job for this vertical or add if not exists
            const filtered = prevJobs.filter(j => j.vertical_slug !== newJob.vertical_slug);
            return [...filtered, newJob];
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsRealtimeConnected(true);
          console.log('✅ Realtime connection established');
        } else if (status === 'CLOSED') {
          setIsRealtimeConnected(false);
          console.log('❌ Realtime connection closed');
        }
      });

    return () => {
      supabase.removeChannel(channel);
      setIsRealtimeConnected(false);
    };
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('import_history')
        .select('*')
        .eq('metadata->>type', 'url_backfill')
        .order('started_at', { ascending: false })
        .limit(20); // Show last 20 backfill jobs

      if (error) throw error;
      
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const startBackfill = async (verticalSlug: string) => {
    try {
      // Check if any backfill is currently running
      const { data: runningJobs } = await supabase
        .from('import_history')
        .select('*')
        .eq('status', 'in_progress')
        .eq('metadata->>type', 'url_backfill')
        .limit(1);

      if (runningJobs && runningJobs.length > 0) {
        toast({
          title: "Backfill Already Running",
          description: `Cannot start ${verticalSlug} backfill while another backfill is in progress`,
          variant: "destructive",
        });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const functionName = `backfill-${verticalSlug}-urls`;
      const { data, error } = await supabase.functions.invoke(functionName, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      const { channelName, importId } = data;

      // Subscribe to progress updates
      const channel = supabase.channel(channelName);
      
      channel
        .on("broadcast", { event: "progress" }, ({ payload }) => {
          const startTime = liveProgress[importId]?.startTime || Date.now();
          const elapsed = (Date.now() - startTime) / 1000;
          const articlesPerSecond = payload.currentArticle / elapsed;
          const remainingArticles = payload.totalArticles - payload.currentArticle;
          const estimatedSecondsRemaining = articlesPerSecond > 0 
            ? remainingArticles / articlesPerSecond 
            : 0;

          setLiveProgress(prev => ({
            ...prev,
            [importId]: {
              ...payload,
              startTime,
              articlesPerSecond,
              estimatedSecondsRemaining,
            }
          }));
        })
        .on("broadcast", { event: "complete" }, () => {
          setLiveProgress(prev => {
            const updated = { ...prev };
            delete updated[importId];
            return updated;
          });
          fetchJobs();
          toast({
            title: "Backfill Complete",
            description: `${verticalSlug} backfill completed successfully`,
          });
        })
        .on("broadcast", { event: "cancelled" }, () => {
          setLiveProgress(prev => {
            const updated = { ...prev };
            delete updated[importId];
            return updated;
          });
          fetchJobs();
          toast({
            title: "Backfill Cancelled",
            description: `${verticalSlug} backfill was cancelled`,
          });
        })
        .subscribe();

      setLiveProgress(prev => ({
        ...prev,
        [importId]: {
          currentArticle: 0,
          totalArticles: 0,
          updated: 0,
          skipped: 0,
          errors: 0,
          percentage: 0,
          startTime: Date.now(),
        }
      }));

      toast({
        title: "Backfill Started",
        description: `${verticalSlug} backfill is running`,
      });

      fetchJobs();
    } catch (error: any) {
      console.error('Error starting backfill:', error);
      toast({
        title: "Failed to Start",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resumeBackfill = async (job: BackfillJob) => {
    try {
      // Check if any backfill is currently running
      const { data: runningJobs } = await supabase
        .from('import_history')
        .select('*')
        .eq('status', 'in_progress')
        .eq('metadata->>type', 'url_backfill')
        .limit(1);

      if (runningJobs && runningJobs.length > 0 && runningJobs[0].id !== job.id) {
        toast({
          title: "Backfill Already Running",
          description: `Cannot resume while another backfill is in progress`,
          variant: "destructive",
        });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const lastOffset = (job.metadata?.lastProcessedOffset || 0) + 1;
      const functionName = `backfill-${job.vertical_slug}-urls`;

      const { data, error } = await supabase.functions.invoke(functionName, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { resumeFromOffset: lastOffset },
      });

      if (error) throw error;

      const { channelName, importId } = data;

      // Subscribe to progress updates
      const channel = supabase.channel(channelName);
      
      channel
        .on("broadcast", { event: "progress" }, ({ payload }) => {
          const startTime = liveProgress[importId]?.startTime || Date.now();
          const elapsed = (Date.now() - startTime) / 1000;
          const articlesPerSecond = payload.currentArticle / elapsed;
          const remainingArticles = payload.totalArticles - payload.currentArticle;
          const estimatedSecondsRemaining = articlesPerSecond > 0 
            ? remainingArticles / articlesPerSecond 
            : 0;

          setLiveProgress(prev => ({
            ...prev,
            [importId]: {
              ...payload,
              startTime,
              articlesPerSecond,
              estimatedSecondsRemaining,
            }
          }));
        })
        .on("broadcast", { event: "complete" }, () => {
          setLiveProgress(prev => {
            const updated = { ...prev };
            delete updated[importId];
            return updated;
          });
          fetchJobs();
          toast({
            title: "Backfill Complete",
            description: `${job.vertical_slug} backfill completed successfully`,
          });
        })
        .on("broadcast", { event: "cancelled" }, () => {
          setLiveProgress(prev => {
            const updated = { ...prev };
            delete updated[importId];
            return updated;
          });
          fetchJobs();
          toast({
            title: "Backfill Cancelled",
            description: `${job.vertical_slug} backfill was cancelled`,
          });
        })
        .subscribe();

      setLiveProgress(prev => ({
        ...prev,
        [importId]: {
          currentArticle: lastOffset,
          totalArticles: 0,
          updated: 0,
          skipped: 0,
          errors: 0,
          percentage: 0,
          startTime: Date.now(),
        }
      }));

      toast({
        title: "Backfill Resumed",
        description: `Resuming ${job.vertical_slug} from article ${lastOffset}`,
      });

      fetchJobs();
    } catch (error: any) {
      toast({
        title: "Resume Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const cancelBackfill = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('import_history')
        .update({ cancelled: true })
        .eq('id', jobId);

      if (error) throw error;

      toast({
        title: "Cancellation Requested",
        description: "Job will stop after current batch",
      });

      setTimeout(fetchJobs, 1000);
    } catch (error: any) {
      toast({
        title: "Cancel Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const cleanupStuckJobs = async () => {
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      
      const { data: stuckJobs } = await supabase
        .from('import_history')
        .select('id')
        .eq('metadata->>type', 'url_backfill')
        .eq('status', 'in_progress')
        .lt('started_at', tenMinutesAgo);

      if (stuckJobs && stuckJobs.length > 0) {
        for (const job of stuckJobs) {
          await supabase
            .from('import_history')
            .update({ 
              status: 'completed',
              completed_at: new Date().toISOString()
            })
            .eq('id', job.id);
        }
        
        toast({
          title: "Cleanup Complete",
          description: `Marked ${stuckJobs.length} stuck job(s) as completed`,
        });
        
        fetchJobs();
      } else {
        toast({
          title: "No Stuck Jobs",
          description: "All jobs are up to date",
        });
      }
    } catch (error: any) {
      toast({
        title: "Cleanup Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (job: BackfillJob) => {
    if (job.cancelled) {
      return <Badge variant="secondary">Cancelled</Badge>;
    }

    switch (job.status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-blue-600">In Progress</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{job.status}</Badge>;
    }
  };

  const formatETA = (seconds: number) => {
    if (!seconds || seconds <= 0) return "Calculating...";
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h ${Math.round((seconds % 3600) / 60)}m`;
  };

  const formatSpeed = (articlesPerSecond: number) => {
    if (!articlesPerSecond || articlesPerSecond <= 0) return "N/A";
    if (articlesPerSecond < 1) return `${(articlesPerSecond * 60).toFixed(1)}/min`;
    return `${articlesPerSecond.toFixed(1)}/sec`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Backfill Dashboard</h1>
            {isRealtimeConnected && (
              <Badge variant="default" className="bg-green-600 animate-pulse">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
            )}
            {!isRealtimeConnected && (
              <Badge variant="secondary">
                Offline
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">
            Monitor and manage URL backfill jobs (showing last 20 jobs)
            {lastUpdate && (
              <span className="text-xs ml-2">
                • Last update: {formatDistanceToNow(lastUpdate, { addSuffix: true })}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={cleanupStuckJobs} variant="outline" size="sm">
            Clean Up Stuck Jobs
          </Button>
          <Button onClick={fetchJobs} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Start New Backfill
            </CardTitle>
            <CardDescription>
              Begin a new URL backfill process for a vertical
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={() => startBackfill('aviation')} 
              className="w-full"
              variant="outline"
              disabled={Object.keys(liveProgress).length > 0}
            >
              Aviation
            </Button>
            <Button 
              onClick={() => startBackfill('aerospace')} 
              className="w-full"
              variant="outline"
              disabled={Object.keys(liveProgress).length > 0}
            >
              Aerospace
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Active Jobs
            </CardTitle>
            <CardDescription>
              Currently running backfill processes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Object.keys(liveProgress).length}
            </div>
            <p className="text-sm text-muted-foreground">
              {Object.keys(liveProgress).length === 0 ? "No active jobs" : "jobs running"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Live Progress Section */}
      {Object.entries(liveProgress).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Live Progress</h2>
          {Object.entries(liveProgress).map(([jobId, progress]) => {
            const job = jobs.find(j => j.id === jobId);
            return (
              <Card key={jobId} className="border-blue-500 border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 animate-pulse text-blue-600" />
                        {job?.vertical_slug || 'Unknown'} Backfill (Live)
                      </CardTitle>
                      <CardDescription>
                        Processing article {progress.currentArticle} of {progress.totalArticles}
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => cancelBackfill(jobId)}
                      variant="destructive"
                      size="sm"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress: {progress.percentage}%</span>
                      <span className="text-muted-foreground">
                        {progress.articlesPerSecond ? formatSpeed(progress.articlesPerSecond) : "Calculating..."}
                      </span>
                    </div>
                    <Progress value={progress.percentage} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Updated</p>
                      <p className="text-xl font-bold text-green-600">{progress.updated}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Skipped</p>
                      <p className="text-xl font-bold text-yellow-600">{progress.skipped}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Errors</p>
                      <p className="text-xl font-bold text-red-600">{progress.errors}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        ETA
                      </p>
                      <p className="text-xl font-bold text-blue-600">
                        {progress.estimatedSecondsRemaining 
                          ? formatETA(progress.estimatedSecondsRemaining)
                          : "Calculating..."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Historical Jobs Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Recent Backfill Jobs</h2>
        {loading ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Loading jobs...
            </CardContent>
          </Card>
        ) : jobs.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No backfill jobs found
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => {
              const isLive = liveProgress[job.id];
              const canResume = (job.status === 'in_progress' || job.cancelled) && !isLive;
              const lastOffset = job.metadata?.lastProcessedOffset || 0;

              return (
                <Card key={job.id} className={isLive ? "opacity-50" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <CardTitle className="capitalize">
                            {job.vertical_slug} Backfill
                          </CardTitle>
                          {getStatusBadge(job)}
                        </div>
                        <CardDescription>
                          Started {formatDistanceToNow(new Date(job.started_at), { addSuffix: true })}
                          {job.completed_at && ` • Completed ${formatDistanceToNow(new Date(job.completed_at), { addSuffix: true })}`}
                        </CardDescription>
                      </div>
                      {canResume && (
                        <Button
                          onClick={() => resumeBackfill(job)}
                          variant="secondary"
                          size="sm"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Resume from {lastOffset + 1}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Last Offset</p>
                        <p className="text-lg font-semibold">{lastOffset.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Updated</p>
                        <p className="text-lg font-semibold text-green-600">
                          {job.imported_count > 0 ? job.imported_count.toLocaleString() : 
                           job.status === 'in_progress' ? 'Processing...' : '0'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Skipped</p>
                        <p className="text-lg font-semibold text-yellow-600">
                          {job.skipped_count > 0 ? job.skipped_count.toLocaleString() : 
                           job.status === 'in_progress' ? '-' : '0'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Errors</p>
                        <p className="text-lg font-semibold text-red-600">
                          {job.error_count > 0 ? job.error_count.toLocaleString() : 
                           job.status === 'in_progress' ? '-' : '0'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Duration</p>
                        <p className="text-lg font-semibold">
                          {job.duration_ms 
                            ? `${Math.round(job.duration_ms / 1000)}s`
                            : job.status === 'in_progress' 
                              ? 'Running...' 
                              : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {canResume && (
                      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          This job can be resumed from article {lastOffset + 1}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
