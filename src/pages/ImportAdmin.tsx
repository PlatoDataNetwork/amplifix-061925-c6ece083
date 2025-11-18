import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePlatoVerticals } from "@/hooks/usePlatoVerticals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ImportAdmin = () => {
  const navigate = useNavigate();
  const [importing, setImporting] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, any>>({});
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [totalArticles, setTotalArticles] = useState(0);
  const [sortBy, setSortBy] = useState<'name' | 'count'>('count');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { verticals, isLoading: verticalsLoading } = usePlatoVerticals();
  
  useEffect(() => {
    loadMetrics();
  }, []);
  
  const loadMetrics = async () => {
    try {
      // Get total articles
      const { count: total } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });
      
      setTotalArticles(total || 0);
      
      // Get articles per vertical
      const { data: verticalCounts } = await supabase
        .from('articles')
        .select('vertical_slug');
      
      if (verticalCounts) {
        const counts: Record<string, number> = {};
        verticalCounts.forEach(article => {
          counts[article.vertical_slug] = (counts[article.vertical_slug] || 0) + 1;
        });
        setMetrics(counts);
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  // Prepare verticals with their article counts
  const verticalsWithCounts = verticals.map(v => ({
    ...v,
    articleCount: metrics[v.slug] || 0
  }));

  // Sort verticals
  const sortedVerticals = [...verticalsWithCounts].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortOrder === 'asc'
        ? a.articleCount - b.articleCount
        : b.articleCount - a.articleCount;
    }
  });

  const toggleSort = (column: 'name' | 'count') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const importVertical = async (vertical: string, verticalSlug: string) => {
    setImporting(vertical);
    
    try {
      const { data, error } = await supabase.functions.invoke('import-articles', {
        body: { vertical: verticalSlug }
      });

      if (error) throw error;

      setResults(prev => ({ ...prev, [vertical]: data }));
      toast.success(`${vertical} import completed!`, {
        description: `Imported ${data.insertedArticles} articles`
      });
      await loadMetrics(); // Refresh metrics after import
    } catch (error) {
      console.error(`Error importing ${vertical}:`, error);
      toast.error(`Failed to import ${vertical}`, {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setImporting(null);
    }
  };

  const importACN = async () => {
    setImporting('ACN');
    
    try {
      const { data, error } = await supabase.functions.invoke('import-acn');

      if (error) throw error;

      setResults(prev => ({ ...prev, ACN: data }));
      toast.success('ACN import completed!', {
        description: `Imported ${data.insertedArticles} articles`
      });
      await loadMetrics(); // Refresh metrics after import
    } catch (error) {
      console.error('Error importing ACN:', error);
      toast.error('Failed to import ACN', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setImporting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />
      
      <div className="pt-24 container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Article Import Admin</h1>
            <Button 
              onClick={() => navigate('/admin/users')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              User Management
            </Button>
          </div>
          
          {/* Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalArticles.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Across all verticals</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Verticals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{verticals.length}</div>
                <p className="text-xs text-muted-foreground mt-1">In directory</p>
              </CardContent>
            </Card>
          </div>
          
          {/* All Verticals Table */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">All Verticals Directory</CardTitle>
            </CardHeader>
            <CardContent>
              {verticalsLoading ? (
                <div className="text-center py-8">Loading verticals...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          onClick={() => toggleSort('name')}
                          className="flex items-center gap-1 px-0 hover:bg-transparent"
                        >
                          Vertical Name
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          onClick={() => toggleSort('count')}
                          className="flex items-center gap-1 px-0 hover:bg-transparent"
                        >
                          Article Count
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedVerticals.map((vertical, index) => (
                      <TableRow key={vertical.slug}>
                        <TableCell className="font-medium text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{vertical.name}</span>
                            {vertical.articleCount === 0 && (
                              <span className="px-2 py-0.5 text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-full border border-yellow-500/20">
                                No articles
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`text-lg font-bold ${vertical.articleCount > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                            {vertical.articleCount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => importVertical(vertical.name, vertical.slug)}
                            disabled={importing !== null}
                            size="sm"
                            variant={vertical.articleCount === 0 ? "default" : "outline"}
                          >
                            {importing === vertical.name ? 'Importing...' : vertical.articleCount === 0 ? 'Import' : 'Re-import'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              {results && Object.keys(results).length > 0 && (
                <div className="mt-6 space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">Recent Import Results:</h3>
                  {Object.entries(results).map(([name, data]: [string, any]) => (
                    <div key={name} className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">
                        ✅ {name}: Imported {data.insertedArticles} articles ({(data.duration / 1000).toFixed(1)}s)
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ACN Newswire Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">ACN Newswire</CardTitle>
              <p className="text-sm text-muted-foreground">Import articles from ACN Newswire RSS Feed</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Additional article source for comprehensive coverage
                </div>
                <Button
                  onClick={importACN}
                  disabled={importing !== null}
                  size="lg"
                >
                  {importing === 'ACN' ? 'Importing...' : 'Import ACN Newswire'}
                </Button>
              </div>
              
              {results.ACN && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">
                    ✅ Imported: {results.ACN.insertedArticles} articles
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Duration: {(results.ACN.duration / 1000).toFixed(1)}s
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Note:</h3>
            <p className="text-sm text-muted-foreground">
              Imports may take several minutes for large datasets. The function will process
              articles in batches and store them in the database. Once imported, articles will
              load instantly from the database instead of external APIs.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ImportAdmin;