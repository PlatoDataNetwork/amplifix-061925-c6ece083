import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Loader2, Database, Trash2, RotateCcw, AlertCircle, Save, Pause, Play, Download } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BackupProgress } from "@/components/BackupProgress";

interface Backup {
  backup_name: string;
  backup_description: string | null;
  created_at: string;
  article_count: number;
  size_bytes: number;
}

interface BackupJob {
  id: string;
  backup_name: string;
  backup_description: string | null;
  vertical_slug: string | null;
  total_articles: number;
  processed_articles: number;
  total_chunks: number;
  completed_chunks: number[];
  current_chunk: number;
  status: string;
  created_at: string;
  updated_at: string;
  paused_at: string | null;
}

const ArticleBackups = () => {
  const navigate = useNavigate();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingBackup, setProcessingBackup] = useState<string | null>(null);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [selectedVertical, setSelectedVertical] = useState<string>("");
  const [verticals, setVerticals] = useState<Array<{ slug: string; count: number }>>([]);
  const [activeBackupName, setActiveBackupName] = useState<string | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [pausedJobs, setPausedJobs] = useState<BackupJob[]>([]);
  const [isPausing, setIsPausing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Format bytes into human-readable size
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    loadBackups();
    loadVerticals();
    loadPausedJobs();
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

  const loadPausedJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('backup_jobs')
        .select('*')
        .eq('status', 'paused')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setPausedJobs(data || []);
    } catch (error) {
      console.error("Error loading paused jobs:", error);
    }
  };

  const loadBackups = async () => {
    try {
      // Use RPC to efficiently get backup summaries with counts
      const { data, error } = await supabase.rpc('get_backup_summary');

      if (error) {
        console.error("Error loading backups:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        setBackups([]);
        setIsLoading(false);
        return;
      }

      // Map the RPC results to our Backup interface
      const backupsList = data.map((item: any) => ({
        backup_name: item.backup_name,
        backup_description: item.backup_description,
        created_at: item.created_at,
        article_count: item.article_count,
        size_bytes: item.size_bytes || 0
      }));

      setBackups(backupsList);
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
      "This will save the current state of " + (isVerticalBackup ? `all ${verticalSlug} articles` : "all articles in the database") + "."
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

      setActiveBackupName(backupName);

      // Get total count first
      let countQuery = supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });
      
      if (isVerticalBackup) {
        countQuery = countQuery.eq('vertical_slug', verticalSlug);
      }
      
      const { count: totalCount } = await countQuery;
      
      if (!totalCount || totalCount === 0) {
        toast.error("No articles found to backup");
        setIsCreatingBackup(false);
        setActiveBackupName(null);
        return;
      }

      // Create backup job record
      const chunkSize = 5000;
      const totalChunks = Math.ceil(totalCount / chunkSize);

      const { data: authData } = await supabase.auth.getUser();
      
      const { data: job, error: jobError } = await supabase
        .from('backup_jobs')
        .insert({
          backup_name: backupName,
          backup_description: backupDescription,
          vertical_slug: isVerticalBackup ? verticalSlug : null,
          total_articles: totalCount,
          total_chunks: totalChunks,
          created_by: authData.user?.id
        })
        .select()
        .single();

      if (jobError) throw jobError;

      setActiveJobId(job.id);
      toast.info(`Starting backup of ${totalCount.toLocaleString()} articles...`);

      // Create realtime channel for progress updates
      const channel = supabase.channel(`backup-progress-${backupName}`);
      await channel.subscribe();

      // Process chunks
      let processedCount = 0;

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        // Check if job was paused
        const { data: jobCheck } = await supabase
          .from('backup_jobs')
          .select('status')
          .eq('id', job.id)
          .single();

        if (jobCheck?.status === 'paused') {
          toast.info('Backup paused');
          break;
        }

        const { data, error } = await supabase.functions.invoke('backup-articles-chunked', {
          body: {
            backupName,
            backupDescription,
            chunkIndex,
            chunkSize,
            verticalSlug: isVerticalBackup ? verticalSlug : undefined,
            jobId: job.id
          }
        });

        if (error) {
          console.error(`Error in chunk ${chunkIndex}:`, error);
          throw error;
        }

        if (data?.success) {
          processedCount += data.backedUp;
          
          // Broadcast progress update
          await channel.send({
            type: 'broadcast',
            event: 'progress',
            payload: {
              backed: processedCount,
              total: totalCount,
              status: chunkIndex === totalChunks - 1 ? 'completed' : 'processing'
            }
          });

          if (!data.hasMore) break;
        }
      }

      // Check final status
      const { data: finalJob } = await supabase
        .from('backup_jobs')
        .select('status, processed_articles')
        .eq('id', job.id)
        .single();

      await supabase.removeChannel(channel);

      if (finalJob?.status === 'paused') {
        toast.info(`Backup paused at ${finalJob.processed_articles.toLocaleString()} articles`);
        await loadPausedJobs();
      } else {
        // Mark as completed
        await supabase
          .from('backup_jobs')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', job.id);

        toast.success(`Backup completed: ${processedCount.toLocaleString()} articles backed up`);
        await loadBackups();
      }
    } catch (error) {
      console.error("Error creating backup:", error);
      toast.error("Failed to complete backup", {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsCreatingBackup(false);
      setActiveBackupName(null);
      setActiveJobId(null);
    }
  };

  const handlePauseBackup = async () => {
    if (!activeJobId) return;

    setIsPausing(true);
    try {
      const { data, error } = await supabase.functions.invoke('pause-backup', {
        body: { jobId: activeJobId }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success('Backup paused successfully');
        await loadPausedJobs();
      }
    } catch (error) {
      console.error('Error pausing backup:', error);
      toast.error('Failed to pause backup');
    } finally {
      setIsPausing(false);
    }
  };

  const handleResumeBackup = async (job: BackupJob) => {
    try {
      setIsCreatingBackup(true);
      setActiveBackupName(job.backup_name);
      setActiveJobId(job.id);

      // Resume the backup
      const { data, error } = await supabase.functions.invoke('resume-backup', {
        body: { jobId: job.id }
      });

      if (error) throw error;

      toast.info(`Resuming backup from chunk ${job.current_chunk}...`);

      // Create realtime channel
      const channel = supabase.channel(`backup-progress-${job.backup_name}`);
      await channel.subscribe();

      // Continue from last chunk
      const chunkSize = 5000;
      let processedCount = job.processed_articles;

      for (let chunkIndex = job.current_chunk; chunkIndex < job.total_chunks; chunkIndex++) {
        // Check if paused again
        const { data: jobCheck } = await supabase
          .from('backup_jobs')
          .select('status')
          .eq('id', job.id)
          .single();

        if (jobCheck?.status === 'paused') {
          toast.info('Backup paused');
          break;
        }

        const { data: chunkData, error: chunkError } = await supabase.functions.invoke('backup-articles-chunked', {
          body: {
            backupName: job.backup_name,
            backupDescription: job.backup_description,
            chunkIndex,
            chunkSize,
            verticalSlug: job.vertical_slug,
            jobId: job.id
          }
        });

        if (chunkError) {
          console.error(`Error in chunk ${chunkIndex}:`, chunkError);
          throw chunkError;
        }

        if (chunkData?.success) {
          processedCount += chunkData.backedUp;
          
          await channel.send({
            type: 'broadcast',
            event: 'progress',
            payload: {
              backed: processedCount,
              total: job.total_articles,
              status: chunkIndex === job.total_chunks - 1 ? 'completed' : 'processing'
            }
          });

          if (!chunkData.hasMore) break;
        }
      }

      // Check final status
      const { data: finalJob } = await supabase
        .from('backup_jobs')
        .select('status')
        .eq('id', job.id)
        .single();

      await supabase.removeChannel(channel);

      if (finalJob?.status === 'paused') {
        toast.info('Backup paused');
        await loadPausedJobs();
      } else {
        // Mark as completed
        await supabase
          .from('backup_jobs')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', job.id);

        toast.success(`Backup completed: ${processedCount.toLocaleString()} articles`);
        await loadBackups();
        await loadPausedJobs();
      }
    } catch (error) {
      console.error('Error resuming backup:', error);
      toast.error('Failed to resume backup');
    } finally {
      setIsCreatingBackup(false);
      setActiveBackupName(null);
      setActiveJobId(null);
    }
  };

  const handleExportBackup = async (backupName: string) => {
    try {
      toast.info('Exporting backup... This may take a while for large backups. Please keep this tab open.');

      // Get total count first using indexed backup_name filter
      const { count, error: countError } = await supabase
        .from('article_backups')
        .select('*', { count: 'exact', head: true })
        .eq('backup_name', backupName);

      if (countError) throw countError;

      if (!count || count === 0) {
        toast.error('No backup data found');
        return;
      }

      const batchSize = 500; // smaller batches to avoid timeouts
      const allRecords: any[] = [];

      for (let from = 0; from < count; from += batchSize) {
        const to = Math.min(from + batchSize - 1, count - 1);

        const { data: batch, error } = await supabase
          .from('article_backups')
          .select('*')
          .eq('backup_name', backupName)
          .order('created_at', { ascending: true })
          .range(from, to);

        if (error) throw error;
        if (batch && batch.length > 0) {
          allRecords.push(...batch);
        }
      }

      if (allRecords.length === 0) {
        toast.error('No backup data found');
        return;
      }

      const exportData = {
        backup_name: backupName,
        backup_description: allRecords[0]?.backup_description,
        exported_at: new Date().toISOString(),
        total_articles: allRecords.length,
        articles: allRecords.map((record) => ({
          article_id: record.article_id,
          post_id: record.post_id,
          title: record.title,
          content: record.content,
          excerpt: record.excerpt,
          author: record.author,
          image_url: record.image_url,
          vertical_slug: record.vertical_slug,
          published_at: record.published_at,
          metadata: record.metadata,
        })),
      };

      const json = JSON.stringify(exportData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${backupName}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${allRecords.length.toLocaleString()} articles to ${backupName}.json`);
    } catch (error) {
      console.error('Error exporting backup:', error);
      toast.error('Failed to export backup', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const handleDeleteAllExcept = async (keepBackupName: string) => {
    if (!confirm(
      `⚠️ CRITICAL WARNING: This will permanently delete ALL backups except "${keepBackupName}".\n\n` +
      `This action cannot be undone.\n\n` +
      `Are you absolutely sure?`
    )) {
      return;
    }

    setIsDeleting(true);

    try {
      // Use the same direct table deletion that already works for single backups,
      // but apply it to every other backup name instead of using the edge function
      const backupsToDelete = backups.filter((b) => b.backup_name !== keepBackupName);

      if (backupsToDelete.length === 0) {
        toast.info('No other backups to delete.');
        return;
      }

      toast.info(`Deleting ${backupsToDelete.length} backup${backupsToDelete.length > 1 ? 's' : ''}... This may take a minute.`);

      for (const backup of backupsToDelete) {
        console.log('Deleting backup set', backup.backup_name);

        // Delete backup records for this backup name
        const { error: deleteBackupsError } = await (supabase as any)
          .from('article_backups')
          .delete()
          .eq('backup_name', backup.backup_name);

        if (deleteBackupsError) {
          console.error('Error deleting backup records for', backup.backup_name, deleteBackupsError);
          throw deleteBackupsError;
        }

        // Best-effort cleanup of associated backup_jobs records
        const { error: deleteJobsError } = await supabase
          .from('backup_jobs')
          .delete()
          .eq('backup_name', backup.backup_name);

        if (deleteJobsError) {
          console.warn('Error deleting backup job for', backup.backup_name, deleteJobsError);
        }
      }

      toast.success(`Deleted all backups except "${keepBackupName}".`);
      await loadBackups();
    } catch (error) {
      console.error('Error deleting backups:', error);
      toast.error('Failed to delete backups', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsDeleting(false);
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

          {/* Live Backup Progress */}
          {activeBackupName && (
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Backup In Progress</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePauseBackup}
                  disabled={isPausing}
                  className="gap-2"
                >
                  {isPausing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Pause className="h-4 w-4" />
                  )}
                  Pause Backup
                </Button>
              </div>
              <BackupProgress 
                backupName={activeBackupName} 
                onComplete={() => {
                  setActiveBackupName(null);
                  setActiveJobId(null);
                  loadBackups();
                }}
              />
            </div>
          )}

          {/* Paused Backups */}
          {pausedJobs.length > 0 && (
            <Card className="mb-6 border-2 border-amber-500/30 bg-amber-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <Pause className="h-5 w-5" />
                  Paused Backups
                </CardTitle>
                <CardDescription>
                  Resume these backups to continue from where they left off
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pausedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
                  >
                    <div className="flex-1">
                      <p className="font-semibold font-mono text-sm">
                        {job.backup_name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {job.backup_description || 'No description'}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>
                          {job.processed_articles.toLocaleString()} / {job.total_articles.toLocaleString()} articles
                        </span>
                        <span>•</span>
                        <span>
                          {Math.round((job.processed_articles / job.total_articles) * 100)}% complete
                        </span>
                        <span>•</span>
                        <span>
                          Paused {formatDistanceToNow(new Date(job.paused_at!), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleResumeBackup(job)}
                      disabled={isCreatingBackup}
                      className="gap-2"
                    >
                      {isCreatingBackup && activeJobId === job.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      Resume
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

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
                          <span>{backup.article_count.toLocaleString()} articles</span>
                          <span>•</span>
                          <span className="font-semibold text-primary">
                            {formatBytes(backup.size_bytes)}
                          </span>
                          <span>•</span>
                          <span>
                            Created {formatDistanceToNow(new Date(backup.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        {/* Visual size indicator */}
                        <div className="mt-3 space-y-1">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Storage Used</span>
                            <span className="font-mono">{formatBytes(backup.size_bytes)}</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${Math.min(100, (backup.size_bytes / (1024 * 1024 * 1024)) * 10)}%` 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAllExcept(backup.backup_name)}
                          disabled={isDeleting || processingBackup !== null}
                          className="gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950"
                          title="Delete all other backups and keep only this one"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Database className="h-4 w-4" />
                          )}
                          Keep Only This
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExportBackup(backup.backup_name)}
                          disabled={processingBackup === backup.backup_name || isDeleting}
                          className="gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                          title="Export this backup as a JSON file"
                        >
                          <Download className="h-4 w-4" />
                          Export JSON
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore(backup.backup_name)}
                          disabled={processingBackup === backup.backup_name || isDeleting}
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
                            isDeleting ||
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
