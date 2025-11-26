import { useState, useEffect } from 'react';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Play, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface VerticalStats {
  vertical_slug: string;
  total_articles: number;
  updated_articles: number;
  skipped_articles: number;
  urls_cleared: number;
  needs_update: number;
}

export default function PlatoSourceStats() {
  const { isAdmin, loading: authLoading } = useAdminCheck();
  const navigate = useNavigate();
  const [verticalStats, setVerticalStats] = useState<VerticalStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingVertical, setProcessingVertical] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('vertical_slug, content, external_url');

      if (error) throw error;

      const statsMap = new Map<string, { 
        total: number; 
        updated: number; 
        skipped: number;
        urlsCleared: number;
        needsUpdate: number;
      }>();

      data?.forEach((article) => {
        const stats = statsMap.get(article.vertical_slug) || { 
          total: 0, 
          updated: 0, 
          skipped: 0,
          urlsCleared: 0,
          needsUpdate: 0
        };
        stats.total++;

        const hasNewSource = article.content?.includes('Plato Data Intelligence');
        const hasOldSource = article.content?.includes('platodata.ai') || 
                           article.content?.includes('platodata.network') ||
                           article.content?.includes('plato.ai') ||
                           article.content?.includes('Zephyrnet');

        // Check if external_url was cleared (null) or still has old source
        const urlLower = article.external_url?.toLowerCase() || '';
        const hasOldUrl = urlLower.includes('platodata') || 
                         urlLower.includes('zephyrnet') || 
                         urlLower.includes('plato');
        
        if (!article.external_url && hasNewSource) {
          stats.urlsCleared++;
        }

        if (hasNewSource && !hasOldSource && !hasOldUrl) {
          stats.updated++;
        } else if (hasOldSource || hasOldUrl) {
          stats.needsUpdate++;
        } else {
          stats.skipped++;
        }

        statsMap.set(article.vertical_slug, stats);
      });

      const statsArray = Array.from(statsMap.entries()).map(([vertical_slug, stats]) => ({
        vertical_slug,
        total_articles: stats.total,
        updated_articles: stats.updated,
        skipped_articles: stats.skipped,
        urls_cleared: stats.urlsCleared,
        needs_update: stats.needsUpdate,
      })).sort((a, b) => b.total_articles - a.total_articles);

      setVerticalStats(statsArray);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const processVertical = async (verticalSlug: string) => {
    setProcessingVertical(verticalSlug);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to perform this action');
      }

      const vertical = verticalStats.find(v => v.vertical_slug === verticalSlug);
      
      toast.info('Processing Started', {
        description: `Updating ${vertical?.total_articles.toLocaleString()} articles in ${verticalSlug.replace(/-/g, ' ')}...`,
      });

      const { data, error: functionError } = await supabase.functions.invoke(
        'update-plato-sources',
        {
          body: { vertical: verticalSlug },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (functionError) throw functionError;

      if (data.success) {
        toast.success('✓ Update Complete', {
          description: `Updated ${data.stats.updated} articles in ${verticalSlug.replace(/-/g, ' ')}`,
        });
        
        // Refresh stats
        await fetchStats();
      } else {
        throw new Error(data.error || 'Update failed');
      }
    } catch (err: any) {
      console.error('Update error:', err);
      toast.error('Update Failed', {
        description: err.message,
      });
    } finally {
      setProcessingVertical(null);
    }
  };

  if (authLoading || !isAdmin) {
    return null;
  }

  return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Plato Source Update Statistics</h1>
            <p className="text-muted-foreground">Track article source attribution updates across all verticals</p>
          </div>
          <Button onClick={fetchStats} variant="outline" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Stats
          </Button>
        </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Verticals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{verticalStats.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Content categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {verticalStats.reduce((sum, v) => sum + v.total_articles, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Across all verticals</p>
              </CardContent>
            </Card>

            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-600">✓ DB Updated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {verticalStats.reduce((sum, v) => sum + v.updated_articles, 0).toLocaleString()}
                </div>
                <p className="text-xs text-green-600/80 mt-1">Plato Data Intelligence</p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-600">URLs Cleared</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {verticalStats.reduce((sum, v) => sum + v.urls_cleared, 0).toLocaleString()}
                </div>
                <p className="text-xs text-blue-600/80 mt-1">Old sources removed</p>
              </CardContent>
            </Card>

            <Card className="border-red-500/20 bg-red-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-red-600">Needs Update</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {verticalStats.reduce((sum, v) => sum + v.needs_update, 0).toLocaleString()}
                </div>
                <p className="text-xs text-red-600/80 mt-1">Still showing old sources</p>
              </CardContent>
            </Card>
          </div>

          {/* Status Alert */}
          {verticalStats.reduce((sum, v) => sum + v.updated_articles, 0) > 0 && (
            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center gap-2">
                  <span className="text-2xl">✓</span> Database Update Confirmed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  <strong>{verticalStats.reduce((sum, v) => sum + v.updated_articles, 0).toLocaleString()}</strong> articles have been successfully updated in the database.
                </p>
                <p className="text-sm">
                  All updated articles now display: <code className="bg-green-500/10 px-2 py-1 rounded text-green-600">Source: Plato Data Intelligence.</code>
                </p>
                <p className="text-sm">
                  <strong>{verticalStats.reduce((sum, v) => sum + v.urls_cleared, 0).toLocaleString()}</strong> external URLs have been cleared from old sources.
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Statistics by Vertical</CardTitle>
              <CardDescription>Breakdown of updated vs skipped articles per vertical - Process individual verticals</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vertical</TableHead>
                    <TableHead className="text-right">Total Articles</TableHead>
                    <TableHead className="text-right">DB Updated</TableHead>
                    <TableHead className="text-right">URLs Cleared</TableHead>
                    <TableHead className="text-right">Needs Update</TableHead>
                    <TableHead className="text-right">Success %</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verticalStats.map((stat) => (
                    <TableRow key={stat.vertical_slug}>
                      <TableCell className="font-medium capitalize">
                        {stat.vertical_slug.replace(/-/g, ' ')}
                      </TableCell>
                      <TableCell className="text-right">{stat.total_articles.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <span className="text-green-600 font-semibold">{stat.updated_articles.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-blue-600">{stat.urls_cleared.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={stat.needs_update > 0 ? "destructive" : "secondary"}>
                          {stat.needs_update.toLocaleString()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {((stat.updated_articles / stat.total_articles) * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => processVertical(stat.vertical_slug)}
                          disabled={processingVertical !== null}
                          size="sm"
                          variant={stat.needs_update > 0 ? "default" : "outline"}
                        >
                          {processingVertical === stat.vertical_slug ? (
                            <>
                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-3 w-3" />
                              Process
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Totals Row */}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right">
                      {verticalStats.reduce((sum, v) => sum + v.total_articles, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {verticalStats.reduce((sum, v) => sum + v.updated_articles, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-blue-600">
                      {verticalStats.reduce((sum, v) => sum + v.urls_cleared, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {verticalStats.reduce((sum, v) => sum + v.needs_update, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {((verticalStats.reduce((sum, v) => sum + v.updated_articles, 0) / 
                        verticalStats.reduce((sum, v) => sum + v.total_articles, 0)) * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
