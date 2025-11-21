import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePlatoVerticals } from "@/hooks/usePlatoVerticals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowUpDown, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTestVertical, setSelectedTestVertical] = useState<string>('');
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [liveImportResults, setLiveImportResults] = useState<Array<{
    vertical: string;
    count: number;
    status: 'importing' | 'success' | 'error';
    timestamp: Date;
  }>>([]);
  const [currentVertical, setCurrentVertical] = useState<string>('');
  const [runningTotal, setRunningTotal] = useState(0);
  const { verticals, isLoading: verticalsLoading } = usePlatoVerticals();
  
  useEffect(() => {
    loadMetrics();
  }, []);
  
  const loadMetrics = async () => {
    try {
      // Get total articles count
      const { count: total } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });
      
      setTotalArticles(total || 0);
      
      // Get article counts per vertical using the database function
      const { data: verticalCounts, error } = await supabase
        .rpc('get_vertical_article_counts');
      
      if (error) {
        console.error('Error fetching vertical counts:', error);
        return;
      }
      
      if (verticalCounts) {
        const counts: Record<string, number> = {};
        verticalCounts.forEach((item: { vertical_slug: string; article_count: number }) => {
          counts[item.vertical_slug] = item.article_count;
        });
        setMetrics(counts);
        console.log('Loaded metrics:', counts);
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

  // Filter by search query
  const filteredVerticals = verticalsWithCounts.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort verticals
  const sortedVerticals = [...filteredVerticals].sort((a, b) => {
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

  const importAndProcessAll = async () => {
    setImporting('all-verticals');
    setProgressStatus('Initializing...');
    setProgressPercent(0);
    setLiveImportResults([]);
    setRunningTotal(0);
    setCurrentVertical('');
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Authentication required');
        return;
      }

      toast.info('Starting import of all verticals...', {
        description: 'Importing one vertical at a time'
      });

      // Get all verticals that have articles to import
      const allVerticals = [
        'aerospace', 'artificial-intelligence', 'ar-vr', 'autism', 'automotive',
        'aviation', 'big-data', 'biotech', 'cannabis', 'carbon', 'cleantech',
        'clinical-trials', 'code', 'crowdfunding', 'blockchain', 'cyber-security',
        'defense', 'ecommerce', 'edtech', 'energy', 'esg', 'esports', 'finance',
        'financefeeds', 'fintech', 'forex', 'gaming', 'hydrogen', 'iot',
        'medical-devices', 'music', 'nano-technology', 'nfts', 'patents',
        'payments', 'private-equity', 'psychedelics', 'quantum', 'real-estate',
        'saas', 'semiconductor', 'seo', 'solar', 'spacs', 'startups',
        'stem-cell', 'supply-chain', 'trading', 'venture-capital', 'waste-management'
      ];

      let totalImported = 0;
      let completed = 0;

      for (const verticalSlug of allVerticals) {
        try {
          // Mark vertical as currently importing
          setCurrentVertical(verticalSlug);
          setProgressStatus(`Importing ${verticalSlug}... (${completed + 1}/${allVerticals.length})`);
          setProgressPercent(Math.floor((completed / allVerticals.length) * 100));
          
          // Add to live results as "importing"
          setLiveImportResults(prev => [...prev, {
            vertical: verticalSlug,
            count: 0,
            status: 'importing',
            timestamp: new Date()
          }]);

          const { data, error } = await supabase.functions.invoke('import-articles', {
            body: { vertical: verticalSlug },
            headers: {
              Authorization: `Bearer ${session.access_token}`
            }
          });

          if (error) {
            console.error(`Error importing ${verticalSlug}:`, error);
            // Update to error status
            setLiveImportResults(prev => prev.map(item => 
              item.vertical === verticalSlug 
                ? { ...item, status: 'error' as const, timestamp: new Date() }
                : item
            ));
            toast.error(`Failed to import ${verticalSlug}`);
          } else if (data) {
            const importedCount = data.insertedArticles || 0;
            totalImported += importedCount;
            
            // Update running total in real-time
            setRunningTotal(totalImported);
            
            // Update to success with count
            setLiveImportResults(prev => prev.map(item => 
              item.vertical === verticalSlug 
                ? { ...item, count: importedCount, status: 'success' as const, timestamp: new Date() }
                : item
            ));
            
            console.log(`Imported ${importedCount} articles from ${verticalSlug}`);
          }

          completed++;
        } catch (error) {
          console.error(`Exception importing ${verticalSlug}:`, error);
          // Update to error status
          setLiveImportResults(prev => prev.map(item => 
            item.vertical === verticalSlug 
              ? { ...item, status: 'error' as const, timestamp: new Date() }
              : item
          ));
        }

        // Small delay between imports to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      setCurrentVertical('');

      setProgressPercent(100);
      setProgressStatus(`Completed! Imported ${totalImported} total articles`);
      
      // Store results for display
      setResults(prev => ({
        ...prev,
        'all-verticals': {
          totalImported,
          totalProcessed: totalImported,
          completedVerticals: completed
        }
      }));
      
      toast.success('All verticals imported!', {
        description: `Successfully imported ${totalImported} articles from ${completed} verticals`
      });
      
      await loadMetrics();

    } catch (error) {
      console.error('Error importing all verticals:', error);
      toast.error('Failed to import articles', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      setProgressStatus('Error occurred');
      setProgressPercent(0);
    } finally {
      setTimeout(() => {
        setImporting(null);
        setProgressStatus('');
        setProgressPercent(0);
        setCurrentVertical('');
      }, 5000);
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

  const testImportVertical = async (limit: number = 5) => {
    if (!selectedTestVertical) {
      toast.error('Please select a vertical to test');
      return;
    }
    
    setImporting('vertical-test');
    
    try {
      const { data, error } = await supabase.functions.invoke('import-articles', {
        body: { 
          vertical: selectedTestVertical,
          limit: limit
        }
      });

      if (error) throw error;

      // Fetch the recently imported articles to display
      const { data: recentArticles } = await supabase
        .from('articles')
        .select('id, title, post_id, external_url')
        .eq('vertical_slug', selectedTestVertical)
        .order('created_at', { ascending: false })
        .limit(limit);

      setResults(prev => ({ 
        ...prev, 
        'vertical-test': {
          ...data,
          articles: recentArticles || []
        }
      }));
      
      toast.success(`${selectedTestVertical} test import completed!`, {
        description: `Imported ${data.insertedArticles} articles`
      });
      await loadMetrics();
    } catch (error) {
      console.error(`Error testing ${selectedTestVertical} import:`, error);
      toast.error(`Failed to test ${selectedTestVertical} import`, {
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

          {/* Import All & Process Section */}
          <Card className="mb-8 border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                🚀 Import All Verticals & Process with AI
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Import articles from all verticals and apply full AI processing (content formatting + 8 tag extraction) to every article
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={importAndProcessAll}
                  disabled={importing !== null}
                  className="w-full h-14 text-lg"
                  size="lg"
                >
                  {importing === 'all-verticals' ? 'Processing...' : 'Import & Process All Articles'}
                </Button>

                {importing === 'all-verticals' && (
                  <div className="space-y-4">
                    {/* Overall Progress */}
                    <div className="space-y-3 p-4 bg-background rounded-lg border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{progressStatus}</span>
                        <span className="text-sm text-muted-foreground">{progressPercent}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>

                    {/* Live Stats */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-background rounded-lg border">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Currently Importing</p>
                        <p className="text-lg font-bold text-blue-500">{currentVertical || 'Initializing...'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Total Articles Imported</p>
                        <p className="text-lg font-bold text-green-500">{runningTotal.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Live Import Feed */}
                    {liveImportResults.length > 0 && (
                      <div className="p-4 bg-background rounded-lg border">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          Live Import Feed
                        </h4>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {[...liveImportResults].reverse().map((result, idx) => (
                            <div 
                              key={`${result.vertical}-${idx}`}
                              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                                result.status === 'importing' 
                                  ? 'bg-blue-500/10 border border-blue-500/20' 
                                  : result.status === 'success'
                                  ? 'bg-green-500/10 border border-green-500/20'
                                  : 'bg-red-500/10 border border-red-500/20'
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className={`w-2 h-2 rounded-full ${
                                  result.status === 'importing'
                                    ? 'bg-blue-500 animate-pulse'
                                    : result.status === 'success'
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                                }`} />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{result.vertical}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {result.timestamp.toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                {result.status === 'importing' ? (
                                  <span className="text-sm text-blue-500 animate-pulse">Importing...</span>
                                ) : result.status === 'success' ? (
                                  <span className="text-sm font-bold text-green-500">
                                    +{result.count.toLocaleString()}
                                  </span>
                                ) : (
                                  <span className="text-sm text-red-500">Error</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {results['all-verticals'] && (
                  <div className="mt-4 p-4 bg-background rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Imported</p>
                        <p className="text-2xl font-bold text-green-500">{results['all-verticals'].totalImported}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">AI Processed</p>
                        <p className="text-2xl font-bold text-blue-500">{results['all-verticals'].totalProcessed}</p>
                      </div>
                    </div>
                    
                    {results['all-verticals'].verticalResults && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Import Results by Vertical:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                          {Object.entries(results['all-verticals'].verticalResults).map(([vertical, count]: [string, any]) => (
                            <div key={vertical} className="p-2 bg-muted rounded">
                              <span className="font-medium">{vertical}:</span> {count}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Test Import Single Vertical Section */}
          <Card className="mb-8 border-blue-500/50">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                🧪 Test Import Single Vertical
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Select any vertical to test import a limited number of articles
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Select Vertical</label>
                    <Select value={selectedTestVertical} onValueChange={setSelectedTestVertical}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a vertical to test..." />
                      </SelectTrigger>
                      <SelectContent>
                        {verticals.map((vertical) => (
                          <SelectItem key={vertical.slug} value={vertical.slug}>
                            {vertical.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button
                    onClick={() => testImportVertical(5)}
                    disabled={importing !== null || !selectedTestVertical}
                    className="flex-1"
                  >
                    {importing === 'vertical-test' ? 'Testing...' : 'Import 5 Test Articles'}
                  </Button>
                  <Button
                    onClick={() => testImportVertical(10)}
                    disabled={importing !== null || !selectedTestVertical}
                    variant="outline"
                    className="flex-1"
                  >
                    {importing === 'vertical-test' ? 'Testing...' : 'Import 10 Test Articles'}
                  </Button>
                  <Button
                    onClick={() => testImportVertical(25)}
                    disabled={importing !== null || !selectedTestVertical}
                    variant="outline"
                    className="flex-1"
                  >
                    {importing === 'vertical-test' ? 'Testing...' : 'Import 25 Test Articles'}
                  </Button>
                </div>

                {results['vertical-test'] && (
                  <div className="mt-4 p-4 bg-muted rounded-lg space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Imported</p>
                        <p className="text-xl font-bold text-green-500">{results['vertical-test'].insertedArticles}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Skipped</p>
                        <p className="text-xl font-bold text-yellow-500">{results['vertical-test'].skippedArticles}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Errors</p>
                        <p className="text-xl font-bold text-red-500">{results['vertical-test'].erroredArticles}</p>
                      </div>
                    </div>
                    
                    {results['vertical-test'].articles && results['vertical-test'].articles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Recently Imported Articles:</h4>
                        <div className="space-y-2">
                          {results['vertical-test'].articles.map((article: any, index: number) => (
                            <div key={article.id} className="p-3 bg-background rounded border border-border">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{index + 1}. {article.title}</p>
                                  <p className="text-xs text-muted-foreground">Post ID: {article.post_id}</p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate(`/intel/article/${article.id}`)}
                                >
                                  View
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* All Verticals Table */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-2xl">All Verticals Directory</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Showing {sortedVerticals.length} of {verticals.length} verticals
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search verticals by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
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
                      <TableHead>Indexed</TableHead>
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
                          <span className="font-semibold">{vertical.name}</span>
                        </TableCell>
                        <TableCell>
                          <span className={`text-lg font-bold ${vertical.articleCount > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                            {vertical.articleCount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          {vertical.articleCount > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              ✓ Indexed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                              Not Indexed
                            </span>
                          )}
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