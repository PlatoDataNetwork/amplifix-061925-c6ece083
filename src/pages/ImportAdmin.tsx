import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePlatoVerticals } from "@/hooks/usePlatoVerticals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ImportAdmin = () => {
  const navigate = useNavigate();
  const [importing, setImporting] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, any>>({});
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [totalArticles, setTotalArticles] = useState(0);
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

  // Get missing verticals
  const missingVerticals = verticals.filter(v => !metrics[v.slug]);
  const importedVerticals = verticals.filter(v => metrics[v.slug]);

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalArticles.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">Articles in database</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Verticals with Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{Object.keys(metrics).length}</div>
                <p className="text-xs text-muted-foreground mt-1">Verticals that have content</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Verticals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{verticals.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Verticals in directory</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Content Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {verticals.length > 0 ? Math.round((Object.keys(metrics).length / verticals.length) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">% of verticals with articles</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Missing Verticals Alert */}
          {missingVerticals.length > 0 && (
            <>
              <Card className="mb-8 border-yellow-500/50 bg-yellow-500/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    ⚠️ Missing Verticals ({missingVerticals.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    The following verticals from your directory haven't been imported yet:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {missingVerticals.map((vertical) => (
                      <div key={vertical.slug} className="text-sm px-3 py-2 bg-background border border-border rounded">
                        {vertical.name}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">
                  Not Yet Imported ({missingVerticals.length})
                </h2>
                <div className="grid gap-4">
                  {missingVerticals.map((vertical) => (
                    <div key={vertical.slug} className="bg-card border border-border rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-semibold">{vertical.name}</h3>
                            <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                              No articles
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{vertical.url}</p>
                        </div>
                        <Button
                          onClick={() => importVertical(vertical.name, vertical.slug)}
                          disabled={importing !== null}
                          size="lg"
                          variant="default"
                        >
                          {importing === vertical.name ? 'Importing...' : 'Import Now'}
                        </Button>
                      </div>
                      
                      {results[vertical.name] && (
                        <div className="mt-4 p-4 bg-muted rounded">
                          <p className="text-sm">
                            ✅ Imported: {results[vertical.name].insertedArticles} articles
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Duration: {(results[vertical.name].duration / 1000).toFixed(1)}s
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
          <div className="mb-4">
            <h2 className="text-2xl font-bold">
              Imported Verticals ({importedVerticals.length})
            </h2>
          </div>
          
          <div className="grid gap-4 mb-8">
            {verticalsLoading ? (
              <div className="text-center py-8">Loading verticals...</div>
            ) : (
              importedVerticals.map((vertical) => (
                <div key={vertical.slug} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-semibold">{vertical.name}</h2>
                        {metrics[vertical.slug] && (
                          <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                            {metrics[vertical.slug].toLocaleString()} articles
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{vertical.url}</p>
                    </div>
                    <Button
                      onClick={() => importVertical(vertical.name, vertical.slug)}
                      disabled={importing !== null}
                      size="lg"
                    >
                      {importing === vertical.name ? 'Importing...' : 'Import'}
                    </Button>
                  </div>
                  
                  {results[vertical.name] && (
                    <div className="mt-4 p-4 bg-muted rounded">
                      <p className="text-sm">
                        ✅ Imported: {results[vertical.name].insertedArticles} articles
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Duration: {(results[vertical.name].duration / 1000).toFixed(1)}s
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
            
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold">ACN Newswire</h2>
                  <p className="text-muted-foreground">Import from RSS Feed</p>
                </div>
                <Button
                  onClick={importACN}
                  disabled={importing !== null}
                  size="lg"
                >
                  {importing === 'ACN' ? 'Importing...' : 'Import All'}
                </Button>
              </div>
              
              {results.ACN && (
                <div className="mt-4 p-4 bg-muted rounded">
                  <p className="text-sm">
                    ✅ Imported: {results.ACN.insertedArticles} articles
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Duration: {(results.ACN.duration / 1000).toFixed(1)}s
                  </p>
                </div>
              )}
            </div>
          </div>

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