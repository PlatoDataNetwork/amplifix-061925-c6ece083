import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ScrollText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const FeedSyncLogs = () => {
  const [feedFilter, setFeedFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: feeds } = useQuery({
    queryKey: ['rss-feeds-list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('rss_feeds').select('id, name').order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: logs, isLoading } = useQuery({
    queryKey: ['feed-sync-logs', feedFilter, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('feed_sync_logs')
        .select('*')
        .order('synced_at', { ascending: false })
        .limit(100);

      if (feedFilter !== 'all') query = query.eq('feed_id', feedFilter);
      if (statusFilter !== 'all') query = query.eq('status', statusFilter);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'imported': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'skipped': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Sync Logs</h2>
        <p className="text-muted-foreground">Recent RSS feed sync history</p>
      </div>

      <div className="flex gap-3">
        <Select value={feedFilter} onValueChange={setFeedFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Feeds" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Feeds</SelectItem>
            {feeds?.map((f) => (
              <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="imported">Imported</SelectItem>
            <SelectItem value="skipped">Skipped</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <div className="divide-y">
              {logs?.map((log) => (
                <div key={log.id} className="flex items-center gap-3 p-3 text-sm">
                  {getStatusIcon(log.status)}
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{log.original_title || log.original_guid}</p>
                    {log.error_message && (
                      <p className="text-xs text-destructive truncate">{log.error_message}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">{log.status}</Badge>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {log.synced_at ? new Date(log.synced_at).toLocaleString() : ''}
                  </span>
                </div>
              ))}
              {!logs?.length && (
                <div className="p-8 text-center text-muted-foreground">
                  <ScrollText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No sync logs found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedSyncLogs;
