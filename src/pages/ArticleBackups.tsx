import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Loader2, Database, Trash2, RotateCcw, AlertCircle, Save } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Backup {
  backup_name: string;
  backup_description: string | null;
  created_at: string;
  article_count: number;
}

const ArticleBackups = () => {
  const navigate = useNavigate();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingBackup, setProcessingBackup] = useState<string | null>(null);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [selectedVertical, setSelectedVertical] = useState<string>("");
  const [verticals, setVerticals] = useState<Array<{ slug: string; count: number }>>([]);

  useEffect(() => {
    loadBackups();
    loadVerticals();
  }, []);

  const loadVerticals = async () => {
    try {
      const { data, error } = await supabase.rpc('get_vertical_article_counts');
      
      if (error) throw error;
      
      if (data) {
        setVerticals(data.map((v: any) => ({ 
          slug: v.vertical_slug, 
          count: v.article_count 
        })));
      }
    } catch (error) {
      console.error("Error loading verticals:", error);
    }
  };

  const loadBackups = async () => {
    try {
      // Get distinct backup names with their metadata
      const { data: distinctBackups, error: distinctError } = await supabase
        .from('article_backups')
        .select('backup_name, backup_description, created_at')
        .order('created_at', { ascending: false });

      if (distinctError) {
        console.error("Error loading backups:", distinctError);
        throw distinctError;
      }

      if (!distinctBackups || distinctBackups.length === 0) {
        setBackups([]);
        setIsLoading(false);
        return;
      }

      // Group by backup_name to get unique backups
      const backupMap = new Map<string, { backup_description: string | null, created_at: string }>();
      
      distinctBackups.forEach((item: any) => {
        if (!backupMap.has(item.backup_name)) {
          backupMap.set(item.backup_name, {
            backup_description: item.backup_description,
            created_at: item.created_at
          });
        }
      });

      // Now get the count for each backup
      const backupsWithCounts = await Promise.all(
        Array.from(backupMap.entries()).map(async ([backupName, metadata]) => {
          const { count, error: countError } = await supabase
            .from('article_backups')
            .select('*', { count: 'exact', head: true })
            .eq('backup_name', backupName);

          if (countError) {
            console.error(`Error counting backup ${backupName}:`, countError);
            return null;
          }

          return {
            backup_name: backupName,
            backup_description: metadata.backup_description,
            created_at: metadata.created_at,
            article_count: count || 0
          };
        })
      );

      // Filter out any null results and sort by creation date
      const validBackups = backupsWithCounts
        .filter((b): b is Backup => b !== null)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setBackups(validBackups);
    } catch (error) {
      console.error("Error loading backups:", error);
      toast.error("Failed to load backups");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (backupName: string) => {
    if (!confirm(
      `⚠️ WARNING: This will restore ALL articles from the backup "${backupName}".\n\n` +
      "Current article content will be overwritten. Are you sure?"
    )) {
      return;
    }

    setProcessingBackup(backupName);

    try {
      toast.info(`Restoring from backup: ${backupName}...`);

      const { data, error } = await supabase.functions.invoke('restore-articles', {
        body: { backupName }
      });

      if (error) throw error;

      if (data.success) {
        toast.success(
          `Successfully restored ${data.restored} of ${data.total} articles!`
        );
      } else {
        toast.error("Restore completed with errors");
      }
    } catch (error) {
      console.error("Error restoring backup:", error);
      toast.error("Failed to restore backup");
    } finally {
      setProcessingBackup(null);
    }
  };

  const handleDelete = async (backupName: string) => {
    // Prevent deletion of automatic safety backups
    if (backupName.startsWith('pre-clear-') || backupName.startsWith('safety-backup-')) {
      toast.error("Cannot delete automatic safety backups. These are protected to prevent data loss.");
      return;
    }

    if (!confirm(
      `Are you sure you want to delete the backup "${backupName}"?\n\n` +
      "This action cannot be undone."
    )) {
      return;
    }

    setProcessingBackup(backupName);

    try {
      const { error } = await (supabase as any)
        .from('article_backups')
        .delete()
        .eq('backup_name', backupName);

      if (error) {
        console.error("Delete error:", error);
        throw error;
      }

      toast.success("Backup deleted successfully");
      await loadBackups(); // Refresh the list
    } catch (error) {
      console.error("Error deleting backup:", error);
      toast.error("Failed to delete backup. Please check console for details.");
    } finally {
      setProcessingBackup(null);
    }
  };

  const handleCreateBackup = async (verticalSlug?: string) => {
    const isVerticalBackup = !!verticalSlug;
    const backupType = isVerticalBackup ? `${verticalSlug}` : "ALL";
    
    if (!confirm(
      `Create a ${isVerticalBackup ? 'vertical-specific' : 'full'} backup of ${backupType} articles?\n\n` +
      "This will save the current state of " + (isVerticalBackup ? `all ${verticalSlug} articles` : "all articles in the database") + ".\n" +
      "This may take several minutes for large datasets."
    )) {
      return;
    }

    setIsCreatingBackup(true);

    try {
      // Build query based on whether it's a vertical-specific backup
      let query = supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });
      
      if (isVerticalBackup) {
        query = query.eq('vertical_slug', verticalSlug);
      }

      // First, get the total count
      const { count: totalCount, error: countError } = await query;

      if (countError) throw countError;

      if (!totalCount || totalCount === 0) {
        toast.error(`No ${isVerticalBackup ? verticalSlug : ''} articles found to backup`);
        setIsCreatingBackup(false);
        return;
      }

      toast.info(`Starting backup of ${totalCount.toLocaleString()} ${isVerticalBackup ? verticalSlug : ''} articles...`, {
        duration: 5000
      });

      // Fetch all articles in batches (Supabase default limit is 1000)
      const batchSize = 1000;
      let allArticles: any[] = [];
      let fetchedCount = 0;

      for (let offset = 0; offset < totalCount; offset += batchSize) {
        let fetchQuery = supabase
          .from('articles')
          .select('*')
          .range(offset, offset + batchSize - 1);
        
        if (isVerticalBackup) {
          fetchQuery = fetchQuery.eq('vertical_slug', verticalSlug);
        }

        const { data: batch, error: fetchError } = await fetchQuery;

        if (fetchError) throw fetchError;

        if (batch) {
          allArticles = allArticles.concat(batch);
          fetchedCount += batch.length;
          
          toast.info(`Fetching articles: ${fetchedCount.toLocaleString()} / ${totalCount.toLocaleString()}`, {
            duration: 1000,
            id: 'fetch-progress'
          });
        }
      }

      toast.success(`Fetched ${allArticles.length.toLocaleString()} articles. Starting backup...`);

      // Create backup name with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = isVerticalBackup 
        ? `${verticalSlug}-backup-${timestamp}`
        : `full-backup-${timestamp}`;
      const backupDescription = isVerticalBackup
        ? `${verticalSlug.toUpperCase()} vertical backup of ${allArticles.length.toLocaleString()} articles created on ${new Date().toLocaleString()}`
        : `Full backup of ${allArticles.length.toLocaleString()} articles created on ${new Date().toLocaleString()}`;

      // Prepare backup records
      const backups = allArticles.map(article => ({
        article_id: article.id,
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        author: article.author,
        published_at: article.published_at,
        image_url: article.image_url,
        vertical_slug: article.vertical_slug,
        post_id: article.post_id,
        metadata: article.metadata,
        backup_name: backupName,
        backup_description: backupDescription,
      }));

      // Insert in chunks to avoid timeout
      const insertChunkSize = 1000;
      let insertedCount = 0;
      
      for (let i = 0; i < backups.length; i += insertChunkSize) {
        const chunk = backups.slice(i, i + insertChunkSize);
        const { error: insertError } = await supabase
          .from('article_backups')
          .insert(chunk);

        if (insertError) {
          console.error("Insert error at chunk", i, insertError);
          throw insertError;
        }

        insertedCount += chunk.length;
        toast.info(`Backing up: ${insertedCount.toLocaleString()} / ${backups.length.toLocaleString()}`, {
          duration: 1000,
          id: 'insert-progress'
        });
      }

      toast.success(`✅ Successfully backed up ${allArticles.length.toLocaleString()} ${isVerticalBackup ? verticalSlug : ''} articles!`, {
        description: `Backup: ${backupName}`,
        duration: 10000
      });
      
      await loadBackups(); // Refresh the list
    } catch (error) {
      console.error("Error creating backup:", error);
      toast.error("Failed to create backup", {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsCreatingBackup(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/import")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Import
              </Button>
              <h1 className="text-3xl font-bold">Article Backups</h1>
            </div>
          </div>

          {/* Backup Creation Section */}
          <Card className="mb-6 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="h-5 w-5" />
                Create New Backup
              </CardTitle>
              <CardDescription>
                Create a full system backup or backup a specific vertical
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Full Backup */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Full System Backup</h3>
                  <p className="text-sm text-muted-foreground">
                    Backup all articles from all verticals (~97,000 articles)
                  </p>
                </div>
                <Button
                  onClick={() => handleCreateBackup()}
                  disabled={isCreatingBackup}
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isCreatingBackup ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Database className="h-4 w-4" />
                  )}
                  Backup All
                </Button>
              </div>

              {/* Vertical-Specific Backup */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/20">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Vertical-Specific Backup</h3>
                  <p className="text-sm text-muted-foreground">
                    Backup articles from a single vertical (aerospace, aviation, etc.)
                  </p>
                  <div className="mt-3">
                    <Select value={selectedVertical} onValueChange={setSelectedVertical}>
                      <SelectTrigger className="w-[300px]">
                        <SelectValue placeholder="Select a vertical to backup..." />
                      </SelectTrigger>
                      <SelectContent>
                        {verticals.map((vertical) => (
                          <SelectItem key={vertical.slug} value={vertical.slug}>
                            {vertical.slug} ({vertical.count.toLocaleString()} articles)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  onClick={() => selectedVertical && handleCreateBackup(selectedVertical)}
                  disabled={isCreatingBackup || !selectedVertical}
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                >
                  {isCreatingBackup ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Backup Vertical
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Alert */}
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Automatic backups</strong> are created before destructive operations (prefixed with "pre-clear-" or "safety-backup-") and cannot be deleted to prevent data loss. 
              <strong>Manual backups</strong> can be created anytime and deleted when no longer needed.
            </AlertDescription>
          </Alert>

          {/* Backups List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : backups.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No backups found</p>
                <Button
                  variant="link"
                  onClick={() => navigate('/admin/articles/format')}
                  className="mt-2"
                >
                  Create your first backup →
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {backups.map((backup) => (
                <Card key={backup.backup_name}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-mono">
                          {backup.backup_name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {backup.backup_description || 'No description'}
                        </CardDescription>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{backup.article_count} articles</span>
                          <span>•</span>
                          <span>
                            Created {formatDistanceToNow(new Date(backup.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore(backup.backup_name)}
                          disabled={processingBackup === backup.backup_name}
                          className="gap-2"
                        >
                          {processingBackup === backup.backup_name ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RotateCcw className="h-4 w-4" />
                          )}
                          Restore
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(backup.backup_name)}
                          disabled={
                            processingBackup === backup.backup_name ||
                            backup.backup_name.startsWith('pre-clear-') ||
                            backup.backup_name.startsWith('safety-backup-')
                          }
                          className="gap-2 text-destructive hover:text-destructive"
                          title={
                            backup.backup_name.startsWith('pre-clear-') || backup.backup_name.startsWith('safety-backup-')
                              ? 'Automatic safety backups cannot be deleted'
                              : 'Delete this backup'
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ArticleBackups;
