import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Folder, Users, Rss, TrendingUp } from 'lucide-react';

const AnalyticsDashboard = () => {
  const { data: verticals, isLoading: verticalsLoading } = useQuery({
    queryKey: ['analytics-verticals'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_vertical_article_counts');
      if (error) throw error;
      return data;
    },
  });

  const { data: articlesCount } = useQuery({
    queryKey: ['analytics-total-articles'],
    queryFn: async () => {
      const { count, error } = await supabase.from('articles').select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: recentArticles } = useQuery({
    queryKey: ['analytics-recent-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, vertical_slug, published_at')
        .order('published_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <p className="text-muted-foreground">Content analytics and insights</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{articlesCount?.toLocaleString() || '...'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Verticals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{verticals?.length || '...'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg Articles/Vertical</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {verticals?.length ? Math.round((articlesCount || 0) / verticals.length).toLocaleString() : '...'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Top Verticals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {verticalsLoading ? (
              <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8" />)}</div>
            ) : (
              <div className="space-y-3">
                {verticals?.slice(0, 10).map((v) => {
                  const total = verticals.reduce((a, b) => a + Number(b.article_count), 0);
                  const pct = ((Number(v.article_count) / total) * 100).toFixed(1);
                  return (
                    <div key={v.vertical_slug} className="flex items-center gap-3">
                      <span className="text-sm font-medium flex-1 truncate">{v.vertical_slug}</span>
                      <span className="text-sm text-muted-foreground">{Number(v.article_count).toLocaleString()}</span>
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Recent Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentArticles?.map((a) => (
                <div key={a.id} className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.vertical_slug} • {new Date(a.published_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
