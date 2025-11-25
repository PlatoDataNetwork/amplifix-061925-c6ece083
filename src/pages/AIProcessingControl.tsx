import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, PlayCircle, StopCircle, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';

interface ProcessingJob {
  id: string;
  vertical_slug: string;
  status: string;
  total_chunks: number;
  processed_chunks: number[];
  failed_chunks: number[];
  started_at: string;
  completed_at: string | null;
  updated_at: string | null;
}

interface VerticalStats {
  vertical: string;
  total: number;
  processed: number;
  unprocessed: number;
}

const AIProcessingControl = () => {
  const [jobs, setJobs] = useState<ProcessingJob[]>([]);
  const [verticalStats, setVerticalStats] = useState<VerticalStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVertical, setSelectedVertical] = useState('aviation');
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  const loadData = async () => {
    try {
      // Load recent jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('ai_processing_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (jobsError) throw jobsError;
      setJobs(jobsData || []);

      // Load stats for major verticals
      const verticals = ['aviation', 'aerospace', 'blockchain', 'artificial-intelligence'];
      const statsPromises = verticals.map(async (vertical) => {
        const { count: total } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('vertical_slug', vertical);

        const { count: processed } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('vertical_slug', vertical)
          .eq('metadata->>ai_processed', 'true');

        return {
          vertical,
          total: total || 0,
          processed: processed || 0,
          unprocessed: (total || 0) - (processed || 0),
        };
      });

      const stats = await Promise.all(statsPromises);
      setVerticalStats(stats);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Set up real-time subscription for jobs
    const channel = supabase
      .channel('ai_processing_jobs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_processing_jobs'
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    // Auto-refresh every 10 seconds
    const interval = setInterval(loadData, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const handleStartProcessing = async () => {
    setIsStarting(true);
    try {
      const { data, error } = await supabase.functions.invoke('start-ai-processing', {
        body: { verticalSlug: selectedVertical }
      });

      if (error) throw error;

      toast.success(`Started AI processing for ${selectedVertical}`, {
        description: `Processing ${data.totalArticles} articles in ${data.totalChunks} chunks`
      });
      
      loadData();
    } catch (error: any) {
      console.error('Error starting processing:', error);
      toast.error('Failed to start processing', {
        description: error.message || 'Unknown error occurred'
      });
    } finally {
      setIsStarting(false);
    }
  };

  const handleStopProcessing = async () => {
    setIsStopping(true);
    try {
      const { data, error } = await supabase.functions.invoke('stop-ai-processing', {
        body: {}
      });

      if (error) throw error;

      toast.success('Stopped all AI processing jobs', {
        description: `${data.stoppedJobs} job(s) stopped`
      });
      
      loadData();
    } catch (error: any) {
      console.error('Error stopping processing:', error);
      toast.error('Failed to stop processing', {
        description: error.message || 'Unknown error occurred'
      });
    } finally {
      setIsStopping(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Badge variant="default" className="bg-blue-500"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const activeJobs = jobs.filter(j => j.status === 'in_progress');
  const hasActiveJobs = activeJobs.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">AI Processing Control Panel</h1>
          </div>
          <p className="text-muted-foreground">Manage AI article formatting and processing jobs</p>
        </div>

        {/* Control Panel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Start New Processing Job</CardTitle>
            <CardDescription>Select a vertical and start AI processing for articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedVertical}
                onChange={(e) => setSelectedVertical(e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-input rounded-md"
                disabled={hasActiveJobs}
              >
                <option value="aviation">Aviation</option>
                <option value="aerospace">Aerospace</option>
                <option value="blockchain">Blockchain</option>
                <option value="artificial-intelligence">Artificial Intelligence</option>
              </select>
              <Button
                onClick={handleStartProcessing}
                disabled={isStarting || hasActiveJobs}
                className="sm:w-auto"
              >
                {isStarting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Start Processing
                  </>
                )}
              </Button>
              <Button
                onClick={handleStopProcessing}
                variant="destructive"
                disabled={isStopping || !hasActiveJobs}
                className="sm:w-auto"
              >
                {isStopping ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Stopping...
                  </>
                ) : (
                  <>
                    <StopCircle className="w-4 h-4 mr-2" />
                    Stop All Jobs
                  </>
                )}
              </Button>
              <Button
                onClick={loadData}
                variant="outline"
                size="icon"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            {hasActiveJobs && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  ⚠️ {activeJobs.length} job(s) currently running. Stop them before starting a new job.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vertical Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {verticalStats.map((stat) => {
            const progress = stat.total > 0 ? (stat.processed / stat.total) * 100 : 0;
            return (
              <Card key={stat.vertical}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium capitalize">
                    {stat.vertical.replace('-', ' ')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-medium">{stat.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Processed:</span>
                      <span className="font-medium text-green-600">{stat.processed}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Remaining:</span>
                      <span className="font-medium text-orange-600">{stat.unprocessed}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">{progress.toFixed(1)}%</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Processing Jobs</CardTitle>
            <CardDescription>View status and progress of AI processing jobs</CardDescription>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No processing jobs found</p>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => {
                  const processedCount = job.processed_chunks?.length || 0;
                  const failedCount = job.failed_chunks?.length || 0;
                  const progress = job.total_chunks > 0 ? (processedCount / job.total_chunks) * 100 : 0;
                  
                  return (
                    <div key={job.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold capitalize">{job.vertical_slug.replace('-', ' ')}</h4>
                          <p className="text-sm text-muted-foreground">
                            Started: {new Date(job.started_at).toLocaleString()}
                          </p>
                        </div>
                        {getStatusBadge(job.status)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Chunks:</span>
                          <p className="font-medium">{job.total_chunks}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Processed:</span>
                          <p className="font-medium text-green-600">{processedCount}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Failed:</span>
                          <p className="font-medium text-red-600">{failedCount}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Progress:</span>
                          <p className="font-medium">{progress.toFixed(1)}%</p>
                        </div>
                      </div>
                      
                      {job.status === 'in_progress' && (
                        <Progress value={progress} className="h-2" />
                      )}
                      
                      {job.completed_at && (
                        <p className="text-xs text-muted-foreground">
                          Completed: {new Date(job.completed_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default AIProcessingControl;
