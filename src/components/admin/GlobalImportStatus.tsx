import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowUpDown } from "lucide-react";

interface VerticalStats {
  vertical_slug: string;
  total_articles: number;
  ai_processed: number;
  last_import: string | null;
  last_ai_processed: string | null;
  import_stats: {
    imported_count: number;
    skipped_count: number;
    error_count: number;
    duration_ms: number | null;
    status: string;
  } | null;
}

type SortField = 'name' | 'articles' | 'ai_processed';
type SortDirection = 'asc' | 'desc';

export const GlobalImportStatus = () => {
  const [stats, setStats] = useState<VerticalStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('articles');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedVertical, setSelectedVertical] = useState('ALL');

  const loadGlobalStats = async () => {
    try {
      const { data: verticals, error } = await supabase
        .rpc('get_vertical_article_counts');

      if (error) throw error;

      // Process verticals in smaller batches to reduce database load
      const batchSize = 5;
      const results: VerticalStats[] = [];
      
      for (let i = 0; i < (verticals || []).length; i += batchSize) {
        const batch = (verticals || []).slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (v: any) => {
          try {
            const { count: aiProcessed } = await supabase
              .from('articles')
              .select('*', { count: 'exact', head: true })
              .eq('vertical_slug', v.vertical_slug)
              .eq('metadata->>ai_processed', 'true');

            const { data: lastImport } = await supabase
              .from('import_history')
              .select('completed_at, imported_count, skipped_count, error_count, duration_ms, status')
              .eq('vertical_slug', v.vertical_slug)
              .eq('status', 'completed')
              .order('completed_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            const { data: lastAiProcessed } = await supabase
              .from('articles')
              .select('updated_at')
              .eq('vertical_slug', v.vertical_slug)
              .eq('metadata->>ai_processed', 'true')
              .order('updated_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            return {
              vertical_slug: v.vertical_slug,
              total_articles: v.article_count,
              ai_processed: aiProcessed || 0,
              last_import: lastImport?.completed_at || null,
              last_ai_processed: lastAiProcessed?.updated_at || null,
              import_stats: lastImport ? {
                imported_count: lastImport.imported_count,
                skipped_count: lastImport.skipped_count,
                error_count: lastImport.error_count,
                duration_ms: lastImport.duration_ms,
                status: lastImport.status
              } : null
            };
          } catch (err) {
            console.warn(`Failed to load stats for ${v.vertical_slug}:`, err);
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults.filter((r): r is VerticalStats => r !== null));
        
        // Small delay between batches to prevent overwhelming the database
        if (i + batchSize < (verticals || []).length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      // Filter out verticals with 0 articles
      const filteredResults = results.filter(stat => stat.total_articles > 0);
      
      setStats(filteredResults);
      if (loading) setLoading(false);
    } catch (error) {
      console.error('Error loading global stats:', error);
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    loadGlobalStats();

    // Refresh every 30 seconds instead of 5 to reduce database load
    const interval = setInterval(() => {
      loadGlobalStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const totalArticles = stats.reduce((sum, s) => sum + s.total_articles, 0);
  const totalAiProcessed = stats.reduce((sum, s) => sum + s.ai_processed, 0);
  const totalVerticals = stats.length;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedStats = [...stats].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case 'name':
        aValue = a.vertical_slug;
        bValue = b.vertical_slug;
        break;
      case 'articles':
        aValue = a.total_articles;
        bValue = b.total_articles;
        break;
      case 'ai_processed':
        aValue = a.ai_processed;
        bValue = b.ai_processed;
        break;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const filteredStats = sortedStats.filter((stat) =>
    selectedVertical === 'ALL' || stat.vertical_slug === selectedVertical
  );

  const verticalOptions = ['ALL', ...stats.map(s => s.vertical_slug).sort()];

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🌐</span>
          Global Import Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg border-2 border-blue-500/20">
            <p className="text-sm text-muted-foreground mb-2">Active Verticals</p>
            <p className="text-4xl font-bold text-blue-500">{totalVerticals}</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg border-2 border-green-500/20">
            <p className="text-sm text-muted-foreground mb-2">Total Articles</p>
            <p className="text-4xl font-bold text-green-500">{totalArticles.toLocaleString()}</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg border-2 border-purple-500/20">
            <p className="text-sm text-muted-foreground mb-2">AI Processed</p>
            <p className="text-4xl font-bold text-purple-500">{totalAiProcessed.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground">Vertical Breakdown</h3>
            <div className="flex gap-2 items-center">
              <Select value={selectedVertical} onValueChange={setSelectedVertical}>
                <SelectTrigger className="w-[200px] h-8 text-xs bg-background">
                  <SelectValue placeholder="Select vertical" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-50">
                  {verticalOptions.map((vertical) => (
                    <SelectItem 
                      key={vertical} 
                      value={vertical}
                      className="text-xs capitalize"
                    >
                      {vertical === 'ALL' ? 'All Verticals' : vertical.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant={sortField === 'name' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSort('name')}
                className="h-8 text-xs"
              >
                Name
                {sortField === 'name' && (
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                )}
              </Button>
              <Button
                variant={sortField === 'articles' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSort('articles')}
                className="h-8 text-xs"
              >
                Articles
                {sortField === 'articles' && (
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                )}
              </Button>
              <Button
                variant={sortField === 'ai_processed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSort('ai_processed')}
                className="h-8 text-xs"
              >
                AI Processed
                {sortField === 'ai_processed' && (
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
          {filteredStats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No verticals found
            </div>
          ) : (
            filteredStats.map((stat) => (
            <div
              key={stat.vertical_slug}
              className="flex flex-col gap-2 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-semibold capitalize">{stat.vertical_slug}</span>
                  <span className="text-xs text-muted-foreground">
                    {stat.total_articles.toLocaleString()} articles
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-500">
                    {stat.ai_processed} AI ✓
                  </span>
                  {stat.last_ai_processed && (
                    <span className="text-xs text-purple-500">
                      AI: {new Date(stat.last_ai_processed).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              {stat.import_stats && (
                <div className="flex items-center gap-4 text-xs border-t border-border/30 pt-2">
                  <span className="text-blue-500">
                    ↓ {stat.import_stats.imported_count} imported
                  </span>
                  <span className="text-yellow-500">
                    ⊘ {stat.import_stats.skipped_count} skipped
                  </span>
                  {stat.import_stats.error_count > 0 && (
                    <span className="text-red-500">
                      ✗ {stat.import_stats.error_count} errors
                    </span>
                  )}
                  {stat.import_stats.duration_ms && (
                    <span className="text-muted-foreground">
                      ⏱ {(stat.import_stats.duration_ms / 1000).toFixed(1)}s
                    </span>
                  )}
                  {stat.last_import && (
                    <span className="text-muted-foreground ml-auto">
                      Last: {new Date(stat.last_import).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
