import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DuplicateStats {
  duplicateTitleCount: number;
  totalDuplicates: number;
}

interface DuplicateMonitorProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const DuplicateMonitor = ({ 
  autoRefresh = true,
  refreshInterval = 30000 // 30 seconds
}: DuplicateMonitorProps) => {
  const [stats, setStats] = useState<DuplicateStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const fetchDuplicateStats = async () => {
    setLoading(true);
    try {
      const { data: queryData, error: queryError } = await supabase
        .from('articles')
        .select('title');
      
      if (queryError) throw queryError;
      
      // Count duplicates in memory
      const titleCounts = new Map<string, number>();
      queryData?.forEach(article => {
        titleCounts.set(article.title, (titleCounts.get(article.title) || 0) + 1);
      });
      
      const duplicateTitles = Array.from(titleCounts.entries()).filter(([_, count]) => count > 1);
      const totalDuplicates = duplicateTitles.reduce((sum, [_, count]) => sum + (count - 1), 0);
      
      setStats({
        duplicateTitleCount: duplicateTitles.length,
        totalDuplicates
      });
      
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error fetching duplicate stats:', error);
      toast.error('Failed to fetch duplicate statistics');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDuplicateStats();
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(fetchDuplicateStats, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Real-time monitoring for new articles
  useEffect(() => {
    const channel = supabase
      .channel('duplicate-monitor')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'articles'
        },
        () => {
          // Debounce - wait a bit for batch inserts to complete
          setTimeout(fetchDuplicateStats, 2000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const hasDuplicates = stats && stats.totalDuplicates > 0;
  const statusColor = stats?.totalDuplicates === 0 ? 'text-green-500' : 'text-yellow-500';
  const statusIcon = stats?.totalDuplicates === 0 ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Duplicate Monitor</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchDuplicateStats}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={statusColor}>{statusIcon}</span>
              <span className="text-sm font-medium">Status</span>
            </div>
            <Badge variant={stats?.totalDuplicates === 0 ? 'default' : 'secondary'}>
              {loading ? 'Checking...' : stats?.totalDuplicates === 0 ? 'Clean' : 'Has Duplicates'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Duplicate Titles</p>
              <p className="text-2xl font-bold">{stats?.duplicateTitleCount ?? '–'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total Duplicates</p>
              <p className="text-2xl font-bold">{stats?.totalDuplicates ?? '–'}</p>
            </div>
          </div>

          {lastChecked && (
            <p className="text-xs text-muted-foreground">
              Last checked: {lastChecked.toLocaleTimeString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
