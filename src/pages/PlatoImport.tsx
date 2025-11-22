import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";

interface VerticalResult {
  vertical: string;
  slug: string;
  imported: number;
  skipped: number;
  errors: number;
  duration: number;
  status: 'completed' | 'failed' | 'partial' | 'in-progress';
}

const PlatoImport = () => {
  const navigate = useNavigate();
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<{
    phase: string;
    message: string;
    currentVertical?: string;
    totalVerticals?: number;
    processedCount?: number;
    imported?: number;
    skipped?: number;
    errors?: number;
    percentComplete?: number;
    lastResult?: VerticalResult;
  } | null>(null);
  const [verticalResults, setVerticalResults] = useState<VerticalResult[]>([]);
  const [finalResults, setFinalResults] = useState<any>(null);

  const startImport = async () => {
    setImporting(true);
    setProgress(null);
    setVerticalResults([]);
    setFinalResults(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Authentication required');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('User not found');
        return;
      }

      // Subscribe to real-time progress
      const progressChannel = supabase
        .channel(`plato-import-${user.id}`)
        .on('broadcast', { event: 'plato-import-progress' }, (payload) => {
          console.log('📡 Progress update:', payload);
          setProgress(payload.payload);
          
          // Add completed verticals to results list
          if (payload.payload.lastResult) {
            setVerticalResults(prev => {
              const newResults = [...prev];
              const existingIndex = newResults.findIndex(r => r.slug === payload.payload.lastResult.slug);
              if (existingIndex >= 0) {
                newResults[existingIndex] = payload.payload.lastResult;
              } else {
                newResults.push(payload.payload.lastResult);
              }
              return newResults;
            });
          }
        })
        .subscribe();

      toast.info('Starting Plato import for all verticals...');

      const { data, error } = await supabase.functions.invoke('import-plato-verticals', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      await supabase.removeChannel(progressChannel);

      if (error) throw error;

      setFinalResults(data);

      toast.success('Plato import completed!', {
        description: `Imported ${data.totalImported} articles from ${data.totalVerticals} verticals`,
        duration: 10000
      });

    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setImporting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      'in-progress': { variant: "secondary", label: "In Progress" },
      completed: { variant: "default", label: "Completed" },
      failed: { variant: "destructive", label: "Failed" },
      partial: { variant: "outline", label: "Partial" },
    };

    const config = variants[status] || variants.completed;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const exportResults = () => {
    const csv = [
      'Vertical,Slug,Imported,Skipped,Errors,Duration (ms),Status',
      ...verticalResults.map(r => 
        `${r.vertical},${r.slug},${r.imported},${r.skipped},${r.errors},${r.duration},${r.status}`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plato-import-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />
      
      <div className="pt-24 container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => navigate('/admin/import')}
                variant="outline"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Import
              </Button>
              <h1 className="text-4xl font-bold">Plato Import Dashboard</h1>
            </div>
          </div>

          {/* Main Import Card */}
          <Card className="mb-8 border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                🚀 Import All Plato Verticals
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Automatically import articles from all 227 Plato verticals. New verticals like Chainwire will be added automatically.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={startImport}
                disabled={importing}
                className="w-full h-14 text-lg"
                size="lg"
              >
                {importing ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  'Start Full Plato Import'
                )}
              </Button>

              {importing && progress && (
                <div className="space-y-4">
                  {/* Overall Progress */}
                  <div className="space-y-3 p-4 bg-background rounded-lg border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{progress.message}</span>
                      <span className="text-sm text-muted-foreground">{progress.percentComplete || 0}%</span>
                    </div>
                    <Progress value={progress.percentComplete || 0} className="h-2" />
                  </div>

                  {/* Current Status */}
                  {progress.currentVertical && (
                    <div className="p-4 bg-background rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">Currently Processing</p>
                      <p className="text-lg font-bold text-blue-500">{progress.currentVertical}</p>
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 bg-background rounded-lg border text-center">
                      <p className="text-xs text-muted-foreground mb-1">Processed</p>
                      <p className="text-2xl font-bold text-primary">
                        {progress.processedCount || 0} / {progress.totalVerticals || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-background rounded-lg border text-center">
                      <p className="text-xs text-muted-foreground mb-1">Imported</p>
                      <p className="text-2xl font-bold text-green-500">
                        {progress.imported || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-background rounded-lg border text-center">
                      <p className="text-xs text-muted-foreground mb-1">Skipped</p>
                      <p className="text-2xl font-bold text-muted-foreground">
                        {progress.skipped || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-background rounded-lg border text-center">
                      <p className="text-xs text-muted-foreground mb-1">Errors</p>
                      <p className="text-2xl font-bold text-red-500">
                        {progress.errors || 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {finalResults && (
                <div className="p-4 bg-background rounded-lg border space-y-3">
                  <h3 className="font-semibold text-lg">Import Complete! 🎉</h3>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Verticals</p>
                      <p className="text-2xl font-bold">{finalResults.totalVerticals}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Imported</p>
                      <p className="text-2xl font-bold text-green-500">{finalResults.totalImported}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Skipped</p>
                      <p className="text-2xl font-bold text-muted-foreground">{finalResults.totalSkipped}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Errors</p>
                      <p className="text-2xl font-bold text-red-500">{finalResults.totalErrors}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Duration: {Math.round(finalResults.duration / 1000)}s
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vertical Results Table */}
          {verticalResults.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    📊 Vertical Import Results
                    <Badge variant="outline">{verticalResults.length} verticals</Badge>
                  </CardTitle>
                  <Button
                    onClick={exportResults}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto max-h-[600px] overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background">
                      <TableRow>
                        <TableHead>Vertical</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Imported</TableHead>
                        <TableHead className="text-right">Skipped</TableHead>
                        <TableHead className="text-right">Errors</TableHead>
                        <TableHead className="text-right">Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...verticalResults].reverse().map((result) => (
                        <TableRow key={result.slug}>
                          <TableCell className="font-medium">{result.vertical}</TableCell>
                          <TableCell>{getStatusBadge(result.status)}</TableCell>
                          <TableCell className="text-right text-green-600 font-semibold">
                            {result.imported}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {result.skipped}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {result.errors > 0 ? result.errors : '-'}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {(result.duration / 1000).toFixed(1)}s
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PlatoImport;
