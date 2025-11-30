import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { usePlatoVerticals } from '@/hooks/usePlatoVerticals';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Database, Zap, Download, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface VerticalStats {
  slug: string;
  name: string;
  beforeCount: number;
  currentCount: number;
  importing: boolean;
  aiProcessing: boolean;
  importComplete: boolean;
  aiComplete: boolean;
  importProgress?: {
    totalProcessed: number;
    importedCount: number;
    skippedCount: number;
    errorCount: number;
    currentPage: number;
  };
  duplicateOnlyMode?: boolean;
  lastImportedCount?: number;
  noChangeCounter?: number;
  stalled?: boolean;
  stalledPolls?: number;
  lastProgressSignature?: string;
}

interface GlobalStats {
  totalArticlesBefore: number;
  totalArticlesCurrent: number;
  verticalsImported: number;
  verticalsAIProcessed: number;
}

export default function BulkImportAdmin() {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminCheck();
  const { verticals, isLoading: verticalsLoading } = usePlatoVerticals();
  const [verticalStats, setVerticalStats] = useState<VerticalStats[]>([]);
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalArticlesBefore: 0,
    totalArticlesCurrent: 0,
    verticalsImported: 0,
    verticalsAIProcessed: 0
  });
  const [initializing, setInitializing] = useState(true);
  const [activeImportSlug, setActiveImportSlug] = useState<string | null>(null);

  // Initialize stats on load
  useEffect(() => {
    if (verticals.length > 0 && initializing) {
      initializeStats();
    }
  }, [verticals]);


  // Poll import_history for the active import to show realtime stats
  useEffect(() => {
    if (!activeImportSlug) return;

    const interval = setInterval(async () => {
      const { data, error } = await supabase
        .from('import_history')
        .select('total_processed, imported_count, skipped_count, error_count, status, started_at')
        .eq('vertical_slug', activeImportSlug)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching import progress:', error);
        return;
      }

      if (!data) return;

      setVerticalStats(prev =>
        prev.map(s => {
          if (s.slug !== activeImportSlug) return s;

          const isImporting = data.status === 'in_progress';
          const isCompleted = data.status === 'completed';

          const prevProgress = s.importProgress;
          const prevSignature = s.lastProgressSignature ?? '';
          const currentSignature = `${data.total_processed ?? 0}|${data.imported_count ?? 0}|${data.skipped_count ?? 0}|${data.error_count ?? 0}`;

          const hasAnyProgress = currentSignature !== prevSignature;
          const stalledPolls = hasAnyProgress ? 0 : (s.stalledPolls ?? 0) + 1;
          const stalled = stalledPolls >= 5; // ~15 seconds with no progress

          const previousImported = prevProgress?.importedCount ?? (data.imported_count ?? 0);
          const previousTotal = prevProgress?.totalProcessed ?? (data.total_processed ?? 0);

          const isDuplicateProgress =
            (data.imported_count ?? 0) === previousImported &&
            (data.total_processed ?? 0) > previousTotal;

          const noChangeCounter = isDuplicateProgress ? (s.noChangeCounter ?? 0) + 1 : 0;
          const duplicateOnlyMode = isDuplicateProgress && noChangeCounter >= 3;

          return {
            ...s,
            // Treat a stalled import as no longer "importing" so the spinner stops
            importing: isImporting && !stalled,
            importComplete: isCompleted,
            importProgress: {
              totalProcessed: data.total_processed ?? 0,
              importedCount: data.imported_count ?? 0,
              skippedCount: data.skipped_count ?? 0,
              errorCount: data.error_count ?? 0,
              currentPage: Math.max(1, Math.ceil((data.total_processed ?? 0) / 20)),
            },
            duplicateOnlyMode,
            lastImportedCount: data.imported_count ?? 0,
            noChangeCounter,
            stalled,
            stalledPolls,
            lastProgressSignature: currentSignature,
          };
        }),
      );

      if (['completed', 'failed', 'cancelled'].includes(data.status)) {
        setActiveImportSlug(null);
        updateCurrentCounts();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeImportSlug]);

  const initializeStats = async () => {
    setInitializing(true);
    
    // Sort verticals alphabetically
    const sortedVerticals = [...verticals].sort((a, b) => 
      a.name.localeCompare(b.name)
    );

    // Get current article counts for all verticals
    const statsPromises = sortedVerticals.map(async (v) => {
      const { count } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', v.slug);

      return {
        slug: v.slug,
        name: v.name,
        beforeCount: count || 0,
        currentCount: count || 0,
        importing: false,
        aiProcessing: false,
        importComplete: false,
        aiComplete: false
      };
    });

    const stats = await Promise.all(statsPromises);
    setVerticalStats(stats);

    const totalBefore = stats.reduce((sum, s) => sum + s.beforeCount, 0);
    setGlobalStats({
      totalArticlesBefore: totalBefore,
      totalArticlesCurrent: totalBefore,
      verticalsImported: 0,
      verticalsAIProcessed: 0
    });

    setInitializing(false);
  };

  const updateCurrentCounts = async () => {
    const updatedStats = await Promise.all(
      verticalStats.map(async (stat) => {
        const { count } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('vertical_slug', stat.slug);

        return {
          ...stat,
          currentCount: count || 0
        };
      })
    );

    setVerticalStats(updatedStats);

    const totalCurrent = updatedStats.reduce((sum, s) => sum + s.currentCount, 0);
    const imported = updatedStats.filter(s => s.importComplete).length;
    const aiProcessed = updatedStats.filter(s => s.aiComplete).length;

    setGlobalStats(prev => ({
      ...prev,
      totalArticlesCurrent: totalCurrent,
      verticalsImported: imported,
      verticalsAIProcessed: aiProcessed
    }));
  };

  const handleImport = async (slug: string, resumeImportId?: string) => {
    setVerticalStats(prev =>
      prev.map(s =>
        s.slug === slug
          ? {
              ...s,
              importing: true,
              importComplete: false,
              importProgress: undefined,
              duplicateOnlyMode: false,
              lastImportedCount: 0,
              noChangeCounter: 0,
              stalled: false,
              stalledPolls: 0,
              lastProgressSignature: undefined,
            }
          : s,
      ),
    );

    // Track this slug as the active import for realtime polling
    setActiveImportSlug(slug);

    try {
      // Ensure we have a valid session before making the call
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Authentication required. Please log in again.');
      }

      toast.info(resumeImportId ? `Resuming import for ${slug}...` : `Starting fast import for ${slug}...`);

      const { data, error } = await supabase.functions.invoke(`import-${slug}-fast`, {
        body: { resumeImportId },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        // Handle specific auth errors
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          throw new Error('Session expired. Please refresh the page and log in again.');
        }
        throw error;
      }

      toast.success(resumeImportId ? `Import resumed for ${slug}!` : `Import started for ${slug}!`, {
        description: data.message,
        duration: 5000
      });
    } catch (error: any) {
      console.error(`Import error for ${slug}:`, error);
      toast.error(`Import failed for ${slug}`, {
        description: error.message || 'Unknown error'
      });
      
      setVerticalStats(prev =>
        prev.map(s => s.slug === slug ? { ...s, importing: false } : s)
      );
      
      setActiveImportSlug(null);
    }
  };

  const getLatestImportHistory = async (slug: string) => {
    const { data, error } = await supabase
      .from('import_history')
      .select('*')
      .eq('vertical_slug', slug)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching import history:', error);
      return null;
    }

    return data;
  };

  const handleFixStuck = async (slug: string) => {
    try {
      // Hard-stop: mark *all* in-progress imports for this vertical as cancelled/failed
      const { data: inProgress, error: fetchError } = await supabase
        .from('import_history')
        .select('*')
        .eq('vertical_slug', slug)
        .eq('status', 'in_progress');

      if (fetchError) {
        console.error('Error fetching in-progress imports:', fetchError);
        toast.error('Failed to check stuck imports', { description: fetchError.message });
        return;
      }

      if (!inProgress || inProgress.length === 0) {
        toast.info('No running imports found for this vertical');
      } else {
        const nowIso = new Date().toISOString();
        
        // Update each in-progress import individually to preserve its metadata
        for (const row of inProgress) {
          await supabase
            .from('import_history')
            .update({
              status: 'failed',
              cancelled: true,
              completed_at: row.completed_at ?? nowIso,
              metadata: {
                ...(row.metadata as any ?? {}),
                failureReason: 'Import manually cancelled from Bulk Import Admin',
              },
            })
            .eq('id', row.id);
        }

        toast.success(`Stopped all running imports for ${slug}`, {
          description: 'Background tasks will wind down shortly.',
        });
      }

      // Immediately clear any active polling + UI state for this vertical
      setActiveImportSlug(null);
      setVerticalStats(prev =>
        prev.map(s =>
          s.slug === slug
            ? {
                ...s,
                importing: false,
                importComplete: false,
                importProgress: undefined,
                duplicateOnlyMode: false,
                stalled: false,
                stalledPolls: 0,
                lastProgressSignature: undefined,
              }
            : s,
        ),
      );
    } catch (error: any) {
      console.error('Error fixing stuck import:', error);
      toast.error('Failed to fix stuck import', {
        description: error.message || 'Unknown error',
      });
    }
  };

  const handleAIProcessing = async (slug: string) => {
    setVerticalStats(prev =>
      prev.map(s => s.slug === slug ? { ...s, aiProcessing: true } : s)
    );

    try {
      // Ensure we have a valid session before making the call
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Authentication required. Please log in again.');
      }

      toast.info(`Starting AI processing for ${slug}...`);

      const { data, error } = await supabase.functions.invoke('start-ai-processing', {
        body: { 
          verticalSlug: slug,
          fastMode: false,
          skipTags: false
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        // Handle specific auth errors
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          throw new Error('Session expired. Please refresh the page and log in again.');
        }
        throw error;
      }

      toast.success(`AI processing started for ${slug}!`, {
        description: `Processing ${data.articlesToProcess || 0} articles`,
        duration: 5000
      });

      setVerticalStats(prev =>
        prev.map(s => s.slug === slug 
          ? { ...s, aiProcessing: false, aiComplete: true } 
          : s
        )
      );
    } catch (error: any) {
      console.error(`AI processing error for ${slug}:`, error);
      toast.error(`AI processing failed for ${slug}`, {
        description: error.message || 'Unknown error'
      });
      
      setVerticalStats(prev =>
        prev.map(s => s.slug === slug ? { ...s, aiProcessing: false } : s)
      );
    }
  };

  if (loading || verticalsLoading || initializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const progressPercent = globalStats.totalArticlesBefore > 0
    ? ((globalStats.totalArticlesCurrent - globalStats.totalArticlesBefore) / globalStats.totalArticlesBefore) * 100
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Bulk Import Dashboard</h1>
          <p className="text-muted-foreground">
            Import and process all verticals from Platodata.ai
          </p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Database className="h-4 w-4" />
                Articles Before
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{globalStats.totalArticlesBefore.toLocaleString()}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Download className="h-4 w-4" />
                Articles Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {globalStats.totalArticlesCurrent.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                +{(globalStats.totalArticlesCurrent - globalStats.totalArticlesBefore).toLocaleString()} imported
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Imported
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {globalStats.verticalsImported}/{verticalStats.length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="h-4 w-4" />
                AI Processed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">
                {globalStats.verticalsAIProcessed}/{verticalStats.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        {progressPercent > 0 && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Overall Progress</span>
                  <span className="text-muted-foreground">{progressPercent.toFixed(1)}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verticals Grid */}
        <div className="grid grid-cols-1 gap-4">
          {verticalStats.map((stat) => (
            <Card key={stat.slug}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{stat.name}</CardTitle>
                    {stat.importComplete && (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Imported
                      </Badge>
                    )}
                    {stat.aiComplete && (
                      <Badge variant="secondary" className="gap-1">
                        <Zap className="h-3 w-3" />
                        AI Done
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Before: <span className="font-semibold">{stat.beforeCount.toLocaleString()}</span>
                    </span>
                    <span className="text-sm text-muted-foreground">→</span>
                    <span className="text-sm font-semibold text-green-600">
                      Now: {stat.currentCount.toLocaleString()}
                    </span>
                    {stat.currentCount > stat.beforeCount && (
                      <Badge variant="outline" className="text-xs">
                        +{(stat.currentCount - stat.beforeCount).toLocaleString()}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Import Progress Details - Show if progress exists */}
                {stat.importProgress && (
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Import Progress</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Page {stat.importProgress.currentPage}</span>
                        {stat.importing && (
                          <Loader2
                            className={`h-3 w-3 ${stat.stalled
                              ? 'text-destructive animate-pulse'
                              : stat.duplicateOnlyMode
                                ? 'text-muted-foreground/50 animate-spin'
                                : 'text-primary animate-spin'
                            }`}
                          />
                        )}
                      </div>
                    </div>
                    
                    {/* Duplicate-only mode alert */}
                    {stat.duplicateOnlyMode && stat.importing && !stat.stalled && (
                      <div className="flex items-center gap-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs">
                        <AlertCircle className="h-3 w-3 text-blue-600 flex-shrink-0" />
                        <span className="text-blue-600 font-medium">
                          Processing duplicates - will continue to find new articles (don't stop!)
                        </span>
                      </div>
                    )}

                    {/* Stalled import alert */}
                    {stat.stalled && stat.importing && (
                      <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs">
                        <AlertCircle className="h-3 w-3 text-destructive flex-shrink-0" />
                        <span className="text-destructive font-medium">
                          No progress detected – import may be stalled
                        </span>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Processed:</span>
                        <p className="font-semibold">{stat.importProgress.totalProcessed.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-green-600">Imported:</span>
                        <p className="font-semibold text-green-600">{stat.importProgress.importedCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-yellow-600">Skipped:</span>
                        <p className="font-semibold text-yellow-600">{stat.importProgress.skippedCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-red-600">Errors:</span>
                        <p className="font-semibold text-red-600">{stat.importProgress.errorCount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleImport(stat.slug)}
                    disabled={stat.importing || stat.importComplete}
                    variant="default"
                    size="sm"
                    className="flex-1"
                  >
                    {stat.importing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : stat.importComplete ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Import Complete
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Start Import
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={async () => {
                      const history = await getLatestImportHistory(stat.slug);
                      if (history?.id) {
                        // Immediately show the latest known progress on this card
                        setVerticalStats(prev =>
                          prev.map(s =>
                            s.slug === stat.slug
                              ? {
                                  ...s,
                                  importing: history.status === 'in_progress',
                                  importComplete: history.status === 'completed',
                                  importProgress: {
                                    totalProcessed: history.total_processed ?? 0,
                                    importedCount: history.imported_count ?? 0,
                                    skippedCount: history.skipped_count ?? 0,
                                    errorCount: history.error_count ?? 0,
                                    currentPage: Math.max(1, Math.ceil((history.total_processed ?? 0) / 20)),
                                  },
                                  duplicateOnlyMode: false,
                                  lastImportedCount: history.imported_count ?? 0,
                                  noChangeCounter: 0,
                                }
                              : s,
                          ),
                        );

                        setActiveImportSlug(stat.slug);
                        toast.info(`Tracking latest import for ${stat.slug}...`);
                      } else {
                        toast.error('No import history found to resume');
                      }
                    }}
                    disabled={stat.importing}
                    variant="outline"
                    size="sm"
                  >
                    Resume
                  </Button>

                  <Button
                    onClick={() => handleFixStuck(stat.slug)}
                    disabled={!stat.importing}
                    variant="destructive"
                    size="sm"
                    title={stat.duplicateOnlyMode ? "Import is finding duplicates but making progress - let it continue to reach new articles" : "Stop stuck import"}
                  >
                    Fix Stuck
                  </Button>

                  <Button
                    onClick={() => handleAIProcessing(stat.slug)}
                    disabled={!stat.importComplete || stat.aiProcessing || stat.aiComplete}
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                  >
                    {stat.aiProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : stat.aiComplete ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        AI Complete
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start AI Processing
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
