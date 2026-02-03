import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Rss, 
  Loader2, 
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Pause
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlatoVerticals } from "@/hooks/usePlatoVerticals";

type FeedStatus = "active" | "paused" | "error";
type FeedImportMode = "full_content" | "excerpt_with_link";
type FeedPublishStatus = "publish" | "draft";

interface RssFeed {
  id: string;
  name: string;
  feed_url: string;
  vertical_slug: string;
  status: FeedStatus;
  import_mode: FeedImportMode;
  publish_status: FeedPublishStatus;
  auto_sync: boolean;
  sync_interval_hours: number;
  last_synced_at: string | null;
  last_error: string | null;
  default_image_url: string | null;
  check_duplicate_title: boolean;
  check_duplicate_link: boolean;
  max_articles_per_sync: number;
  strip_images: boolean;
  strip_inline_styles: boolean;
  default_author: string | null;
  source_link_text: string | null;
  source_link_url: string | null;
  created_at: string;
  updated_at: string;
}

const defaultFeed = {
  name: "",
  feed_url: "",
  vertical_slug: "",
  status: "active" as FeedStatus,
  import_mode: "full_content" as FeedImportMode,
  publish_status: "draft" as FeedPublishStatus,
  auto_sync: false,
  sync_interval_hours: 24,
  default_image_url: "",
  check_duplicate_title: true,
  check_duplicate_link: true,
  max_articles_per_sync: 0,
  strip_images: false,
  strip_inline_styles: true,
  default_author: "",
  source_link_text: "",
  source_link_url: "",
};

const FeedsManagement = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { verticals } = usePlatoVerticals();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFeed, setEditingFeed] = useState<RssFeed | null>(null);
  const [newFeed, setNewFeed] = useState(defaultFeed);

  // Fetch feeds
  const { data: feeds, isLoading } = useQuery({
    queryKey: ["rss-feeds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rss_feeds")
        .select("*")
        .order("name", { ascending: true });
      
      if (error) throw error;
      return data as RssFeed[];
    },
  });

  // Create feed mutation
  const createFeedMutation = useMutation({
    mutationFn: async (feed: typeof defaultFeed) => {
      const { data, error } = await supabase
        .from("rss_feeds")
        .insert({
          name: feed.name,
          feed_url: feed.feed_url,
          vertical_slug: feed.vertical_slug,
          status: feed.status,
          import_mode: feed.import_mode,
          publish_status: feed.publish_status,
          auto_sync: feed.auto_sync,
          sync_interval_hours: feed.sync_interval_hours,
          default_image_url: feed.default_image_url || null,
          check_duplicate_title: feed.check_duplicate_title,
          check_duplicate_link: feed.check_duplicate_link,
          max_articles_per_sync: feed.max_articles_per_sync,
          strip_images: feed.strip_images,
          strip_inline_styles: feed.strip_inline_styles,
          default_author: feed.default_author || null,
          source_link_text: feed.source_link_text || null,
          source_link_url: feed.source_link_url || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rss-feeds"] });
      setIsCreateDialogOpen(false);
      setNewFeed(defaultFeed);
      toast.success("Feed created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create feed: ${error.message}`);
    },
  });

  // Update feed mutation
  const updateFeedMutation = useMutation({
    mutationFn: async (feed: RssFeed) => {
      const { data, error } = await supabase
        .from("rss_feeds")
        .update({
          name: feed.name,
          feed_url: feed.feed_url,
          vertical_slug: feed.vertical_slug,
          status: feed.status,
          import_mode: feed.import_mode,
          publish_status: feed.publish_status,
          auto_sync: feed.auto_sync,
          sync_interval_hours: feed.sync_interval_hours,
          default_image_url: feed.default_image_url,
          check_duplicate_title: feed.check_duplicate_title,
          check_duplicate_link: feed.check_duplicate_link,
          max_articles_per_sync: feed.max_articles_per_sync,
          strip_images: feed.strip_images,
          strip_inline_styles: feed.strip_inline_styles,
          default_author: feed.default_author,
          source_link_text: feed.source_link_text,
          source_link_url: feed.source_link_url,
        })
        .eq("id", feed.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rss-feeds"] });
      setIsEditDialogOpen(false);
      setEditingFeed(null);
      toast.success("Feed updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update feed: ${error.message}`);
    },
  });

  // Delete feed mutation
  const deleteFeedMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("rss_feeds")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rss-feeds"] });
      toast.success("Feed deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete feed: ${error.message}`);
    },
  });

  // Filter feeds by search
  const filteredFeeds = feeds?.filter(
    (feed) =>
      feed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feed.feed_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feed.vertical_slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: FeedStatus) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case "paused":
        return <Badge className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"><Pause className="h-3 w-3 mr-1" />Paused</Badge>;
      case "error":
        return <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30"><XCircle className="h-3 w-3 mr-1" />Error</Badge>;
    }
  };

  const FeedForm = ({ 
    feed, 
    onChange, 
    onSubmit, 
    isLoading, 
    submitText 
  }: { 
    feed: typeof defaultFeed | RssFeed;
    onChange: (feed: any) => void;
    onSubmit: () => void;
    isLoading: boolean;
    submitText: string;
  }) => (
    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Feed Name *</Label>
          <Input
            id="name"
            value={feed.name}
            onChange={(e) => onChange({ ...feed, name: e.target.value })}
            placeholder="My RSS Feed"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vertical">Vertical *</Label>
          <Select
            value={feed.vertical_slug}
            onValueChange={(value) => onChange({ ...feed, vertical_slug: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select vertical" />
            </SelectTrigger>
            <SelectContent>
              {verticals.map((v) => (
                <SelectItem key={v.slug} value={v.slug}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="feed_url">Feed URL *</Label>
        <Input
          id="feed_url"
          value={feed.feed_url}
          onChange={(e) => onChange({ ...feed, feed_url: e.target.value })}
          placeholder="https://example.com/feed.xml"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="import_mode">Import Mode</Label>
          <Select
            value={feed.import_mode}
            onValueChange={(value: FeedImportMode) => onChange({ ...feed, import_mode: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full_content">Full Content</SelectItem>
              <SelectItem value="excerpt_with_link">Excerpt with Link</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="publish_status">Publish Status</Label>
          <Select
            value={feed.publish_status}
            onValueChange={(value: FeedPublishStatus) => onChange({ ...feed, publish_status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="publish">Publish</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="default_image_url">Default Image URL</Label>
        <Input
          id="default_image_url"
          value={feed.default_image_url || ""}
          onChange={(e) => onChange({ ...feed, default_image_url: e.target.value })}
          placeholder="https://example.com/default-image.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="default_author">Default Author</Label>
        <Input
          id="default_author"
          value={feed.default_author || ""}
          onChange={(e) => onChange({ ...feed, default_author: e.target.value })}
          placeholder="Author name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="source_link_text">Source Link Text</Label>
          <Input
            id="source_link_text"
            value={feed.source_link_text || ""}
            onChange={(e) => onChange({ ...feed, source_link_text: e.target.value })}
            placeholder="Read more at..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="source_link_url">Source Link URL</Label>
          <Input
            id="source_link_url"
            value={feed.source_link_url || ""}
            onChange={(e) => onChange({ ...feed, source_link_url: e.target.value })}
            placeholder="https://source-website.com"
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-medium">Auto-Sync Settings</h4>
        <div className="flex items-center justify-between">
          <div>
            <Label>Enable Auto-Sync</Label>
            <p className="text-xs text-muted-foreground">Automatically sync this feed on a schedule</p>
          </div>
          <Switch
            checked={feed.auto_sync}
            onCheckedChange={(checked) => onChange({ ...feed, auto_sync: checked })}
          />
        </div>
        {feed.auto_sync && (
          <div className="space-y-2">
            <Label htmlFor="sync_interval">Sync Interval (hours)</Label>
            <Input
              id="sync_interval"
              type="number"
              min={1}
              value={feed.sync_interval_hours}
              onChange={(e) => onChange({ ...feed, sync_interval_hours: parseInt(e.target.value) || 24 })}
            />
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h4 className="font-medium">Content Options</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <Label>Check Duplicate Title</Label>
            <Switch
              checked={feed.check_duplicate_title}
              onCheckedChange={(checked) => onChange({ ...feed, check_duplicate_title: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Check Duplicate Link</Label>
            <Switch
              checked={feed.check_duplicate_link}
              onCheckedChange={(checked) => onChange({ ...feed, check_duplicate_link: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Strip Images</Label>
            <Switch
              checked={feed.strip_images}
              onCheckedChange={(checked) => onChange({ ...feed, strip_images: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Strip Inline Styles</Label>
            <Switch
              checked={feed.strip_inline_styles}
              onCheckedChange={(checked) => onChange({ ...feed, strip_inline_styles: checked })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_articles">Max Articles Per Sync (0 = unlimited)</Label>
          <Input
            id="max_articles"
            type="number"
            min={0}
            value={feed.max_articles_per_sync}
            onChange={(e) => onChange({ ...feed, max_articles_per_sync: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <DialogFooter className="pt-4">
        <Button
          onClick={onSubmit}
          disabled={!feed.name || !feed.feed_url || !feed.vertical_slug || isLoading}
        >
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {submitText}
        </Button>
      </DialogFooter>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/management")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">RSS Feed Syndicator</h1>
              <p className="text-muted-foreground">Manage RSS feeds and auto-sync articles</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Rss className="h-5 w-5" />
                <CardTitle>All Feeds</CardTitle>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feed
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New RSS Feed</DialogTitle>
                    <DialogDescription>
                      Configure a new RSS feed for automatic article importing.
                    </DialogDescription>
                  </DialogHeader>
                  <FeedForm
                    feed={newFeed}
                    onChange={setNewFeed}
                    onSubmit={() => createFeedMutation.mutate(newFeed)}
                    isLoading={createFeedMutation.isPending}
                    submitText="Create Feed"
                  />
                </DialogContent>
              </Dialog>
            </div>
            <CardDescription>
              {feeds?.length || 0} feeds configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search feeds..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredFeeds?.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-lg">
                <Rss className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No Feeds Configured</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery ? "No feeds match your search" : "Add your first RSS feed to start syncing articles"}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feed
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Vertical</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Auto-Sync</TableHead>
                    <TableHead>Last Synced</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeeds?.map((feed) => (
                    <TableRow key={feed.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{feed.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {feed.feed_url}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{feed.vertical_slug}</TableCell>
                      <TableCell>{getStatusBadge(feed.status)}</TableCell>
                      <TableCell>
                        {feed.auto_sync ? (
                          <span className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3" />
                            Every {feed.sync_interval_hours}h
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">Manual</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {feed.last_synced_at
                          ? new Date(feed.last_synced_at).toLocaleString()
                          : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" disabled>
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingFeed(feed);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Feed</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{feed.name}"? This will also delete all sync logs for this feed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteFeedMutation.mutate(feed.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Feed</DialogTitle>
              <DialogDescription>
                Update the feed configuration.
              </DialogDescription>
            </DialogHeader>
            {editingFeed && (
              <FeedForm
                feed={editingFeed}
                onChange={setEditingFeed}
                onSubmit={() => updateFeedMutation.mutate(editingFeed)}
                isLoading={updateFeedMutation.isPending}
                submitText="Save Changes"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FeedsManagement;
