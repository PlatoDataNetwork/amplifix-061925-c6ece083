import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Brain, CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface JobStatus {
  id: string;
  vertical_slug: string;
  status: string;
  total_chunks: number;
  processed_chunks: number[] | null;
  failed_chunks: number[] | null;
  started_at: string;
  completed_at: string | null;
}

export function GlobalAIProcessingDashboard() {
  const [jobs, setJobs] = useState<JobStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    try {
      // Get the most recent job for each vertical
      const { data, error } = await supabase
        .from('ai_processing_jobs')
        .select('*')
        .order('started_at', { ascending: false });

      if (error) throw error;

      // Group by vertical and keep only the most recent
      const jobsByVertical = new Map<string, JobStatus>();
      data?.forEach((job) => {
        if (!jobsByVertical.has(job.vertical_slug) || 
            new Date(job.started_at) > new Date(jobsByVertical.get(job.vertical_slug)!.started_at)) {
          jobsByVertical.set(job.vertical_slug, job);
        }
      });

      setJobs(Array.from(jobsByVertical.values()).sort((a, b) => 
        a.vertical_slug.localeCompare(b.vertical_slug)
      ));
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('ai-processing-jobs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_processing_jobs'
        },
        () => {
          loadJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getCompletionPercentage = (job: JobStatus) => {
    if (job.total_chunks === 0) return 0;
    const processedCount = job.processed_chunks?.length || 0;
    return Math.round((processedCount / job.total_chunks) * 100);
  };

  const getStatusBadge = (job: JobStatus) => {
    switch (job.status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="default" className="bg-blue-500">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            {job.status}
          </Badge>
        );
    }
  };

  const formatVerticalName = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Processing Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Processing Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No AI processing jobs found
          </div>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {jobs.map((job) => {
                const percentage = getCompletionPercentage(job);
                const processedCount = job.processed_chunks?.length || 0;
                const failedCount = job.failed_chunks?.length || 0;

                return (
                  <div
                    key={job.id}
                    className="border rounded-lg p-4 space-y-3 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">
                        {formatVerticalName(job.vertical_slug)}
                      </h3>
                      {getStatusBadge(job)}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Total</div>
                        <div className="font-medium">{job.total_chunks}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Processed</div>
                        <div className="font-medium text-green-600">
                          {processedCount}
                        </div>
                      </div>
                      {failedCount > 0 && (
                        <div className="space-y-1">
                          <div className="text-muted-foreground">Failed</div>
                          <div className="font-medium text-red-600">
                            {failedCount}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Started: {new Date(job.started_at).toLocaleString()}
                      {job.completed_at && (
                        <> • Completed: {new Date(job.completed_at).toLocaleString()}</>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

