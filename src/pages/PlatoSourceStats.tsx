import { useState, useEffect } from 'react';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VerticalStats {
  vertical_slug: string;
  total_articles: number;
  updated_articles: number;
  skipped_articles: number;
}

interface Article {
  id: string;
  title: string;
  vertical_slug: string;
  content: string;
  updated_at: string;
}

export default function PlatoSourceStats() {
  const { isAdmin, loading: authLoading } = useAdminCheck();
  const navigate = useNavigate();
  const [verticalStats, setVerticalStats] = useState<VerticalStats[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedVertical, setSelectedVertical] = useState<string>('all');
  const [page, setPage] = useState(0);
  const pageSize = 50;

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [searchTitle, selectedVertical, page]);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('vertical_slug, content');

      if (error) throw error;

      const statsMap = new Map<string, { total: number; updated: number; skipped: number }>();

      data?.forEach((article) => {
        const stats = statsMap.get(article.vertical_slug) || { total: 0, updated: 0, skipped: 0 };
        stats.total++;

        const hasNewSource = article.content?.includes('Plato Data Intelligence');
        const hasOldSource = article.content?.includes('platodata.ai') || 
                           article.content?.includes('platodata.network') ||
                           article.content?.includes('plato.ai') ||
                           article.content?.includes('Zephyrnet');

        if (hasNewSource && !hasOldSource) {
          stats.updated++;
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
      })).sort((a, b) => b.total_articles - a.total_articles);

      setVerticalStats(statsArray);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticles = async () => {
    try {
      let query = supabase
        .from('articles')
        .select('id, title, vertical_slug, content, updated_at')
        .order('updated_at', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (selectedVertical !== 'all') {
        query = query.eq('vertical_slug', selectedVertical);
      }

      if (searchTitle) {
        query = query.ilike('title', `%${searchTitle}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const getSourceStatus = (content: string) => {
    const hasNewSource = content?.includes('Plato Data Intelligence');
    const hasOldSource = content?.includes('platodata.ai') || 
                       content?.includes('platodata.network') ||
                       content?.includes('plato.ai') ||
                       content?.includes('Zephyrnet');

    if (hasNewSource && !hasOldSource) {
      return { status: 'Updated', variant: 'default' as const };
    } else if (hasOldSource) {
      return { status: 'Needs Update', variant: 'destructive' as const };
    } else {
      return { status: 'Unknown', variant: 'secondary' as const };
    }
  };

  if (authLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Plato Source Update Statistics</h1>
        <p className="text-muted-foreground">Track article source attribution updates across all verticals</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Verticals</CardTitle>
                <CardDescription>Number of content verticals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{verticalStats.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Articles</CardTitle>
                <CardDescription>Across all verticals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {verticalStats.reduce((sum, v) => sum + v.total_articles, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Updated Articles</CardTitle>
                <CardDescription>With new source attribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {verticalStats.reduce((sum, v) => sum + v.updated_articles, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Statistics by Vertical</CardTitle>
              <CardDescription>Breakdown of updated vs skipped articles per vertical</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vertical</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Updated</TableHead>
                    <TableHead className="text-right">Needs Update</TableHead>
                    <TableHead className="text-right">Update %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verticalStats.map((stat) => (
                    <TableRow key={stat.vertical_slug}>
                      <TableCell className="font-medium">{stat.vertical_slug}</TableCell>
                      <TableCell className="text-right">{stat.total_articles}</TableCell>
                      <TableCell className="text-right text-green-600">{stat.updated_articles}</TableCell>
                      <TableCell className="text-right text-red-600">{stat.skipped_articles}</TableCell>
                      <TableCell className="text-right">
                        {((stat.updated_articles / stat.total_articles) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
              <CardDescription>Search and filter individual articles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Search by title..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={selectedVertical} onValueChange={setSelectedVertical}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue placeholder="Filter by vertical" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Verticals</SelectItem>
                    {verticalStats.map((stat) => (
                      <SelectItem key={stat.vertical_slug} value={stat.vertical_slug}>
                        {stat.vertical_slug} ({stat.total_articles})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Vertical</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article) => {
                    const { status, variant } = getSourceStatus(article.content);
                    return (
                      <TableRow key={article.id}>
                        <TableCell className="max-w-md truncate">{article.title}</TableCell>
                        <TableCell>{article.vertical_slug}</TableCell>
                        <TableCell>
                          <Badge variant={variant}>{status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(article.updated_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span>Page {page + 1}</span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={articles.length < pageSize}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
