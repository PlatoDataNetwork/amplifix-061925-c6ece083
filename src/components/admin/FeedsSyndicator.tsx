import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Rss, Plus, Trash2, RefreshCw, Loader2, ExternalLink, Settings,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const FeedsSyndicator = () => {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newFeed, setNewFeed] = useState({
    name: '', feed_url: '', vertical_slug: '', auto_sync: false,
    import_mode: 'full_content' as 'full_content' | 'excerpt_with_link',
    publish_status: 'draft' as 'publish' | 'draft',
    sync_interval_hours: 24, max_articles_per_sync: 0,
    check_duplicate_title: true, check_duplicate_link: true,
    strip_images: false, strip_inline_styles: true,
    default_author: '', default_image_url: '', source_link_text: '', source_link_url: '',
  });

  const { data: verticals } = useQuery({
    queryKey: ['article-verticals'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_article_verticals');
      if (error) throw error;
      return data;
    },
  });

  const { data: feeds, isLoading } = useQuery({
    queryKey: ['rss-feeds'],
    queryFn: async () => {
      const { data, error } = await supabase.from('rss_feeds').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addFeed = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('rss_feeds').insert(newFeed);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rss-feeds'] });
      toast.success('Feed added');
      setIsAddOpen(false);
      setNewFeed({ name: '', feed_url: '', vertical_slug: '', auto_sync: false, import_mode: 'full_content', publish_status: 'draft', sync_interval_hours: 24, max_articles_per_sync: 0, check_duplicate_title: true, check_duplicate_link: true, strip_images: false, strip_inline_styles: true, default_author: '', default_image_url: '', source_link_text: '', source_link_url: '' });
    },
    onError: (err) => toast.error(`Failed: ${err.message}`),
  });

  const deleteFeed = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('rss_feeds').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rss-feeds'] });
      toast.success('Feed deleted');
    },
  });

  const syncFeed = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.functions.invoke('sync-rss-feed', { body: { feedId: id } });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rss-feeds'] });
      toast.success(`Synced: ${data?.imported || 0} imported, ${data?.skipped || 0} skipped`);
    },
    onError: (err) => toast.error(`Sync failed: ${err.message}`),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-700';
      case 'paused': return 'bg-yellow-500/10 text-yellow-700';
      case 'error': return 'bg-red-500/10 text-red-700';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Feed Syndicator</h2>
          <p className="text-muted-foreground">{feeds?.length || 0} feeds configured</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Feed</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add RSS Feed</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Feed Name</Label>
                <Input value={newFeed.name} onChange={(e) => setNewFeed({ ...newFeed, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Feed URL</Label>
                <Input value={newFeed.feed_url} onChange={(e) => setNewFeed({ ...newFeed, feed_url: e.target.value })} placeholder="https://example.com/feed.xml" />
              </div>
              <div className="space-y-2">
                <Label>Vertical</Label>
                <Input value={newFeed.vertical_slug} onChange={(e) => setNewFeed({ ...newFeed, vertical_slug: e.target.value })} placeholder="e.g. cannabis" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Import Mode</Label>
                  <Select value={newFeed.import_mode} onValueChange={(v: any) => setNewFeed({ ...newFeed, import_mode: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_content">Full Content</SelectItem>
                      <SelectItem value="excerpt_with_link">Excerpt + Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Publish Status</Label>
                  <Select value={newFeed.publish_status} onValueChange={(v: any) => setNewFeed({ ...newFeed, publish_status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="publish">Publish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Auto Sync</Label>
                <Switch checked={newFeed.auto_sync} onCheckedChange={(c) => setNewFeed({ ...newFeed, auto_sync: c })} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => addFeed.mutate()} disabled={!newFeed.name || !newFeed.feed_url || !newFeed.vertical_slug || addFeed.isPending}>
                {addFeed.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Add Feed
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : (
        <div className="grid gap-4">
          {feeds?.map((feed) => (
            <Card key={feed.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <Rss className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{feed.name}</p>
                    <Badge className={getStatusColor(feed.status)}>{feed.status}</Badge>
                    {feed.auto_sync && <Badge variant="outline">Auto</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{feed.feed_url}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                    <span>{feed.vertical_slug}</span>
                    {feed.last_synced_at && <span>• Synced {new Date(feed.last_synced_at).toLocaleString()}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => syncFeed.mutate(feed.id)} disabled={syncFeed.isPending}>
                    {syncFeed.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Feed</AlertDialogTitle>
                        <AlertDialogDescription>Delete "{feed.name}"? Sync logs will also be removed.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteFeed.mutate(feed.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
          {!feeds?.length && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Rss className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No feeds configured yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedsSyndicator;
