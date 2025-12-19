import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FileText, TrendingUp, Activity, RefreshCw } from 'lucide-react';

interface VerticalStats {
  vertical_slug: string;
  article_count: number;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#0088fe',
];

const IntelStatsDashboard = () => {
  const [stats, setStats] = useState<VerticalStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [realtimeActive, setRealtimeActive] = useState(false);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_vertical_article_counts');
      
      if (error) throw error;
      
      setStats(data || []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Set up real-time subscription for new articles
    const channel = supabase
      .channel('intel-stats-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'articles'
        },
        (payload) => {
          console.log('New article inserted:', payload.new);
          const newVertical = (payload.new as { vertical_slug: string }).vertical_slug;
          
          setStats(prev => {
            const updated = [...prev];
            const index = updated.findIndex(s => s.vertical_slug === newVertical);
            if (index >= 0) {
              updated[index] = {
                ...updated[index],
                article_count: updated[index].article_count + 1
              };
            } else {
              updated.push({ vertical_slug: newVertical, article_count: 1 });
            }
            return updated.sort((a, b) => b.article_count - a.article_count);
          });
          setLastUpdate(new Date());
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'articles'
        },
        (payload) => {
          console.log('Article deleted:', payload.old);
          const oldVertical = (payload.old as { vertical_slug: string }).vertical_slug;
          
          setStats(prev => {
            const updated = [...prev];
            const index = updated.findIndex(s => s.vertical_slug === oldVertical);
            if (index >= 0) {
              updated[index] = {
                ...updated[index],
                article_count: Math.max(0, updated[index].article_count - 1)
              };
            }
            return updated.sort((a, b) => b.article_count - a.article_count);
          });
          setLastUpdate(new Date());
        }
      )
      .subscribe((status) => {
        setRealtimeActive(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const totalArticles = useMemo(() => 
    stats.reduce((sum, s) => sum + s.article_count, 0), 
    [stats]
  );

  const totalVerticals = stats.length;

  const topVerticals = useMemo(() => 
    stats.slice(0, 10), 
    [stats]
  );

  const chartData = useMemo(() => 
    stats.map(s => ({
      name: s.vertical_slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      articles: s.article_count,
      slug: s.vertical_slug
    })),
    [stats]
  );

  const pieData = useMemo(() => 
    topVerticals.map(s => ({
      name: s.vertical_slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: s.article_count
    })),
    [topVerticals]
  );

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Activity className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold">Intel Statistics</h1>
              </div>
              <p className="text-muted-foreground">
                Real-time article statistics across all verticals
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={realtimeActive ? "default" : "secondary"} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${realtimeActive ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
                {realtimeActive ? 'Live Updates Active' : 'Connecting...'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <FileText className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-32" />
              ) : (
                <>
                  <div className="text-4xl font-bold text-primary">{formatNumber(totalArticles)}</div>
                  <p className="text-sm text-muted-foreground mt-1">Across all verticals</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-2/10 to-chart-2/5 border-chart-2/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Verticals</CardTitle>
              <TrendingUp className="h-5 w-5 text-chart-2" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <>
                  <div className="text-4xl font-bold" style={{ color: 'hsl(var(--chart-2))' }}>{totalVerticals}</div>
                  <p className="text-sm text-muted-foreground mt-1">Active categories</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average per Vertical</CardTitle>
              <RefreshCw className="h-5 w-5 text-chart-3" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-24" />
              ) : (
                <>
                  <div className="text-4xl font-bold" style={{ color: 'hsl(var(--chart-3))' }}>
                    {formatNumber(Math.round(totalArticles / (totalVerticals || 1)))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Articles per vertical</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Articles by Vertical</CardTitle>
              <CardDescription>Distribution of articles across all {totalVerticals} verticals</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      interval={0} 
                      height={100}
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatNumber(value)}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatNumber(value), 'Articles']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Bar 
                      dataKey="articles" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Pie Chart - Top 10 */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Verticals</CardTitle>
              <CardDescription>Distribution of the top categories</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [formatNumber(value), 'Articles']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Top Verticals List */}
          <Card>
            <CardHeader>
              <CardTitle>Vertical Breakdown</CardTitle>
              <CardDescription>All {totalVerticals} verticals ranked by article count</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                  {stats.map((stat, index) => (
                    <div
                      key={stat.vertical_slug}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-6">
                          #{index + 1}
                        </span>
                        <span className="font-medium capitalize">
                          {stat.vertical_slug.replace(/-/g, ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{formatNumber(stat.article_count)}</span>
                        <span className="text-xs text-muted-foreground">
                          ({((stat.article_count / totalArticles) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default IntelStatsDashboard;
