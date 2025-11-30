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
      "This will run in the background. You can check progress by refreshing the page."
    )) {
      return;
    }

    setIsCreatingBackup(true);

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = isVerticalBackup 
        ? `${verticalSlug}-backup-${timestamp}`
        : `full-backup-${timestamp}`;
      const backupDescription = isVerticalBackup
        ? `${verticalSlug.toUpperCase()} vertical backup created on ${new Date().toLocaleString()}`
        : `Full backup created on ${new Date().toLocaleString()}`;

      toast.info(`Starting backup process...`);

      // Use the edge function that handles large backups properly
      const { data, error } = await supabase.functions.invoke('backup-articles', {
        body: { 
          backupName,
          backupDescription,
          verticalSlug: isVerticalBackup ? verticalSlug : undefined
        }
      });

      if (error) throw error;

      toast.success(`✅ Backup started successfully!`, {
        description: `Backup name: ${backupName}. Refresh this page in a few minutes to see it.`,
        duration: 10000
      });
      
      // Refresh after a short delay
      setTimeout(() => loadBackups(), 2000);
    } catch (error) {
      console.error("Error creating backup:", error);
      toast.error("Failed to start backup", {
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
