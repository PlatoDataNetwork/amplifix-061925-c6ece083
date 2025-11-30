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

  // Initialize stats on load
  useEffect(() => {
    if (verticals.length > 0 && initializing) {
      initializeStats();
    }
  }, [verticals]);

  // Real-time updates every 3 seconds
  useEffect(() => {
    if (verticalStats.length === 0) return;
    
    const interval = setInterval(() => {
      updateCurrentCounts();
    }, 3000);

    return () => clearInterval(interval);
  }, [verticalStats]);

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

  const handleImport = async (slug: string) => {
    setVerticalStats(prev =>
      prev.map(s => s.slug === slug ? { ...s, importing: true } : s)
    );

    try {
      toast.info(`Starting fast import for ${slug}...`);

      const { data, error } = await supabase.functions.invoke(`import-${slug}-fast`, {
        body: {}
      });

      if (error) throw error;

      toast.success(`Import complete for ${slug}!`, {
        description: `Imported ${data.imported || 0} articles`,
        duration: 5000
      });

      setVerticalStats(prev =>
        prev.map(s => s.slug === slug 
          ? { ...s, importing: false, importComplete: true } 
          : s
        )
      );

      await updateCurrentCounts();
    } catch (error: any) {
      console.error(`Import error for ${slug}:`, error);
      toast.error(`Import failed for ${slug}`, {
        description: error.message || 'Unknown error'
      });
      
      setVerticalStats(prev =>
        prev.map(s => s.slug === slug ? { ...s, importing: false } : s)
      );
    }
  };

  const handleAIProcessing = async (slug: string) => {
    setVerticalStats(prev =>
      prev.map(s => s.slug === slug ? { ...s, aiProcessing: true } : s)
    );

    try {
      toast.info(`Starting AI processing for ${slug}...`);

      const { data, error } = await supabase.functions.invoke('start-ai-processing', {
        body: { 
          verticalSlug: slug,
          fastMode: false,
          skipTags: false
        }
      });

      if (error) throw error;

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
                <div className="flex gap-3">
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
