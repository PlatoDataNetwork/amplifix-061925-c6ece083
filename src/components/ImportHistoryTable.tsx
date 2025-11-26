import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Loader2, PlayCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface ImportHistory {
  id: string;
  vertical_slug: string;
  imported_count: number;
  skipped_count: number;
  error_count: number;
  total_processed: number;
  duration_ms: number | null;
  started_at: string;
  completed_at: string | null;
  status: 'in_progress' | 'completed' | 'failed' | 'partial';
  metadata: any;
}

interface ImportHistoryTableProps {
  verticalSlug?: string;
}

export const ImportHistoryTable = ({ verticalSlug }: ImportHistoryTableProps = {}) => {
  const [history, setHistory] = useState<ImportHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [fixing, setFixing] = useState(false);

  const loadHistory = async () => {
    console.log('📜 Loading import history for vertical:', verticalSlug);
    
    if (!verticalSlug) {
      setHistory([]);
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('import_history')
        .select('*')
        .eq('vertical_slug', verticalSlug)
        .order('started_at', { ascending: false })
        .limit(50);

      console.log('Import history data:', data);
      console.log('Import history error:', error);

      if (error) {
        console.error('Error loading import history:', error);
        throw error;
      }
      setHistory((data || []) as ImportHistory[]);
    } catch (error) {
      console.error('Error loading import history:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('📜 ImportHistoryTable component mounted/updated with vertical:', verticalSlug);
    setLoading(true);
    setHistory([]); // Clear history when vertical changes
    loadHistory();

    if (!verticalSlug) {
      return;
    }

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`import-history-${verticalSlug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'import_history',
          filter: `vertical_slug=eq.${verticalSlug}`
        },
        () => {
          console.log('📡 Import history real-time update received');
          loadHistory();
        }
      )
      .subscribe();

    return () => {
      console.log('📜 ImportHistoryTable component unmounting');
      supabase.removeChannel(channel);
    };
  }, [verticalSlug]);

  console.log('📜 ImportHistoryTable rendering, loading:', loading, 'history count:', history.length);

  const handleResume = async (historyId: string) => {
    try {
      toast.info("Resuming import...");
      
      const { data, error } = await supabase.functions.invoke('import-aerospace-fast', {
        body: { resumeHistoryId: historyId }
      });

      if (error) throw error;
      
      toast.success(data.message);
    } catch (error) {
      console.error('Resume error:', error);
      toast.error('Failed to resume import');
    }
  };

  const handleFixStuckImports = async () => {
    try {
      setFixing(true);
      toast.info("Checking for stuck imports...");

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Authentication required');
        return;
      }

      const { data, error } = await supabase.functions.invoke('fix-stuck-imports', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      const fixedCount = (data as any)?.fixed?.length ?? (data as any)?.fixed ?? 0;
      toast.success((data as any)?.message || 'Checked for stuck imports', {
        description: fixedCount
          ? `${fixedCount} import${fixedCount === 1 ? '' : 's'} updated`
          : undefined,
      });
    } catch (error) {
      console.error('Fix stuck imports error:', error);
      toast.error('Failed to fix stuck imports', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setFixing(false);
    }
  };

  const getStatusBadge = (status: string, metadata?: any) => {
    const isResumable = status === 'partial' && (metadata?.nextPage || metadata?.resumable);

    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      in_progress: { variant: "secondary", label: "In Progress" },
      completed: { variant: "default", label: "Completed" },
      failed: { variant: "destructive", label: "Failed" },
      partial: { variant: "outline", label: isResumable ? "Needs Resume" : "Partial" },
    };

    const config = variants[status] || variants.completed;
    
    if (status === 'in_progress') {
      return (
        <Badge variant={config.variant} className="gap-1.5">
          <Loader2 className="h-3 w-3 animate-spin" />
          {config.label}
        </Badge>
      );
    }
    
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const calculateProgress = (record: ImportHistory): number => {
    if (record.status !== 'in_progress' && record.status !== 'partial') return 100;
    
    // Try to get progress from metadata
    const metadata = record.metadata as any;
    if (metadata?.currentPage && metadata?.totalPages) {
      const rawProgress = (metadata.currentPage / metadata.totalPages) * 100;
      const clampedProgress = Math.max(0, Math.min(100, Math.floor(rawProgress)));
      return clampedProgress;
    }
    
    // Fallback: estimate based on processed count
    if (record.total_processed > 0) {
      // Assume ~50 items per page for aerospace (rough estimate)
      const estimatedTotal = 9240; // For aerospace specifically
      return Math.min(Math.floor((record.total_processed / estimatedTotal) * 100), 99);
    }
    
    return 5; // Just started
  };

  const formatDuration = (ms: number | null) => {
    if (!ms) return "-";
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${seconds}s`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Import History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No import history yet. Start an import to see records here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="flex items-center gap-2">
          📜 Import History
          <Badge variant="outline" className="ml-auto">
            {history.length} records
          </Badge>
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleFixStuckImports}
          disabled={fixing}
          className="mt-2 sm:mt-0"
        >
          {fixing && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
          Fix stuck imports
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vertical</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Imported</TableHead>
                <TableHead className="text-right">Skipped</TableHead>
                <TableHead className="text-right">Errors</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Duration</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((record) => {
                const progress = calculateProgress(record);
                const metadata = record.metadata as any;
                const isEffectivelyCompleted =
                  record.status === 'in_progress' &&
                  metadata?.currentPage &&
                  metadata?.totalPages &&
                  metadata.currentPage >= metadata.totalPages;
                const isRunning = record.status === 'in_progress' && !isEffectivelyCompleted;
                const isResumable =
                  record.status === 'partial' &&
                  (metadata?.nextPage || metadata?.resumable);
                const displayStatus = isEffectivelyCompleted ? 'completed' : record.status;
                
                return (
                  <TableRow key={record.id} className={isRunning ? "bg-muted/30" : ""}>
                    <TableCell className="font-medium">
                      {record.vertical_slug}
                    </TableCell>
                    <TableCell>{getStatusBadge(displayStatus, record.metadata)}</TableCell>
                    <TableCell className="text-right text-green-600 font-semibold">
                      {record.imported_count.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {record.skipped_count.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {record.error_count > 0 ? record.error_count.toLocaleString() : "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {record.total_processed.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatDuration(record.duration_ms)}
                    </TableCell>
                    <TableCell className="min-w-[160px]">
                      {isRunning ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Processing...</span>
                            <span className="font-medium">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {displayStatus === 'completed' ? '100%' : 
                           displayStatus === 'failed' ? 'Failed' : 
                           displayStatus === 'partial' ? `${progress}%` : '-'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(record.started_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      {isResumable && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleResume(record.id)}
                          className="gap-1"
                        >
                          <PlayCircle className="h-3 w-3" />
                          Resume
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
