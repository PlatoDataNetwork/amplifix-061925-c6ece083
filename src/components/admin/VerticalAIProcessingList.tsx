import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Brain, Loader2, Search, Play, XCircle, CheckCircle2, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VerticalStats {
  slug: string;
  totalArticles: number;
  unprocessedArticles: number;
  latestJob?: {
    id: string;
    status: string;
    total_chunks: number;
    processed_chunks: number[] | null;
    failed_chunks: number[] | null;
    started_at: string;
    completed_at: string | null;
  };
}

const ALL_VERTICALS = [
  'blockchain',
  'fintech',
  'ai',
  'healthtech',
  'cleantech',
  'edtech',
  'arvr',
  'security',
  'mobility',
  'iot',
  'biotech',
  'legal',
  'hr',
  'marketing',
  'analytics'
];

export function VerticalAIProcessingList() {
  const [verticals, setVerticals] = useState<VerticalStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingVertical, setProcessingVertical] = useState<string | null>(null);

  const loadVerticalStats = async () => {
    setLoading(true);
    try {
      const stats: VerticalStats[] = [];

      for (const slug of ALL_VERTICALS) {
        // Count total articles
        const { count: total } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('vertical_slug', slug);

        // Count unprocessed articles
        const { count: unprocessed } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('vertical_slug', slug)
          .is('metadata->ai_processed', null);

        // Get latest job
        const { data: jobs } = await supabase
          .from('ai_processing_jobs')
          .select('*')
          .eq('vertical_slug', slug)
          .order('started_at', { ascending: false })
          .limit(1);

        stats.push({
          slug,
          totalArticles: total || 0,
          unprocessedArticles: unprocessed || 0,
          latestJob: jobs?.[0] || undefined
        });
      }

      setVerticals(stats);
    } catch (error) {
      console.error('Error loading vertical stats:', error);
      toast.error('Failed to load vertical statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerticalStats();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('vertical-stats-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_processing_jobs'
        },
        () => {
          loadVerticalStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleStartProcessing = async (verticalSlug: string) => {
    setProcessingVertical(verticalSlug);
    try {
      const { data, error } = await supabase.functions.invoke('start-ai-processing', {
        body: { verticalSlug }
      });

      if (error) throw error;

      toast.success('AI Processing Started', {
        description: `Started processing ${verticalSlug}`
      });

      await loadVerticalStats();
    } catch (error) {
      console.error('Error starting AI processing:', error);
      toast.error('Failed to start AI processing', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setProcessingVertical(null);
    }
  };

  const getCompletionPercentage = (job?: VerticalStats['latestJob']) => {
    if (!job || job.total_chunks === 0) return 0;
    const processedCount = job.processed_chunks?.length || 0;
    return Math.round((processedCount / job.total_chunks) * 100);
  };

  const getStatusBadge = (job?: VerticalStats['latestJob']) => {
    if (!job) {
      return (
        <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" />
          No Jobs
        </Badge>
      );
    }

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

  const filteredVerticals = verticals.filter(v =>
    v.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Vertical AI Processing
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
          Vertical AI Processing
        </CardTitle>
        <div className="relative mt-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by vertical name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[700px] pr-4">
          <div className="space-y-4">
            {filteredVerticals.map((vertical) => {
              const percentage = getCompletionPercentage(vertical.latestJob);
              const processedCount = vertical.latestJob?.processed_chunks?.length || 0;
              const failedCount = vertical.latestJob?.failed_chunks?.length || 0;
              const isProcessing = vertical.latestJob?.status === 'processing';

              return (
                <div
                  key={vertical.slug}
                  className="border rounded-lg p-4 space-y-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {formatVerticalName(vertical.slug)}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>Total: {vertical.totalArticles}</span>
                        <span className="text-orange-600">
                          Unprocessed: {vertical.unprocessedArticles}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(vertical.latestJob)}
                      <Button
                        size="sm"
                        onClick={() => handleStartProcessing(vertical.slug)}
                        disabled={isProcessing || processingVertical === vertical.slug || vertical.unprocessedArticles === 0}
                      >
                        {processingVertical === vertical.slug ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {vertical.latestJob && (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{percentage}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="space-y-1">
                          <div className="text-muted-foreground">Chunks</div>
                          <div className="font-medium">{vertical.latestJob.total_chunks}</div>
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
                        Started: {new Date(vertical.latestJob.started_at).toLocaleString()}
                        {vertical.latestJob.completed_at && (
                          <> • Completed: {new Date(vertical.latestJob.completed_at).toLocaleString()}</>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
