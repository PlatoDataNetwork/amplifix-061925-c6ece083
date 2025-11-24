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

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('article_backups')
        .select('backup_name, backup_description, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error loading backups:", error);
        throw error;
      }

      // Group by backup_name and count articles
      const backupMap = new Map<string, Backup>();
      
      data?.forEach((item: any) => {
        const existing = backupMap.get(item.backup_name);
        if (existing) {
          existing.article_count++;
        } else {
          backupMap.set(item.backup_name, {
            backup_name: item.backup_name,
            backup_description: item.backup_description,
            created_at: item.created_at,
            article_count: 1
          });
        }
      });

      setBackups(Array.from(backupMap.values()));
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

  const handleCreateBackup = async () => {
    if (!confirm(
      "Create a full backup of ALL articles?\n\n" +
      "This will save the current state of all articles in the database."
    )) {
      return;
    }

    setIsCreatingBackup(true);

    try {
      toast.info("Creating full backup of all articles...");

      // Get all articles
      const { data: articles, error: fetchError } = await supabase
        .from('articles')
        .select('*');

      if (fetchError) throw fetchError;

      if (!articles || articles.length === 0) {
        toast.error("No articles found to backup");
        return;
      }

      // Create backup name with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `manual-backup-${timestamp}`;
      const backupDescription = `Manual full backup created on ${new Date().toLocaleString()}`;

      // Prepare backup records
      const backups = articles.map(article => ({
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
      const chunkSize = 1000;
      for (let i = 0; i < backups.length; i += chunkSize) {
        const chunk = backups.slice(i, i + chunkSize);
        const { error: insertError } = await supabase
          .from('article_backups')
          .insert(chunk);

        if (insertError) throw insertError;
      }

      toast.success(`Successfully backed up ${articles.length} articles!`);
      await loadBackups(); // Refresh the list
    } catch (error) {
      console.error("Error creating backup:", error);
      toast.error("Failed to create backup");
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
            <Button
              onClick={handleCreateBackup}
              disabled={isCreatingBackup}
              className="gap-2"
            >
              {isCreatingBackup ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Create Full Backup Now
            </Button>
          </div>

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
