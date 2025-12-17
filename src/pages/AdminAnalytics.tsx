import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  Globe, 
  RefreshCw,
  AlertCircle,
  MousePointer
} from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  pageViews: number;
  avgSessionDuration: string;
  bounceRate: string;
  topPages: Array<{ page: string; views: number }>;
  topCountries: Array<{ country: string; users: number }>;
  dailyUsers: Array<{ date: string; users: number }>;
}

const AdminAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: analyticsData, error: fetchError } = await supabase.functions.invoke('fetch-analytics', {
        body: {
          propertyId: '504421609',
          startDate: '30daysAgo',
          endDate: 'today'
        }
      });

      if (fetchError) {
        // Supabase returns a FunctionsHttpError with a Response in `context` for non-2xx.
        let serverError: any = null;
        try {
          if (typeof (fetchError as any)?.context?.json === 'function') {
            serverError = await (fetchError as any).context.json();
          }
        } catch {
          // ignore
        }

        const message = typeof serverError?.error === 'string'
          ? [serverError.error, serverError.hint, serverError.serviceAccountEmail ? `Service account: ${serverError.serviceAccountEmail}` : null]
              .filter(Boolean)
              .join(' — ')
          : fetchError.message;

        throw new Error(message);
      }

      setData(analyticsData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description, 
    trend 
  }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    description: string;
    trend?: { value: string; positive: boolean };
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`h-3 w-3 ${!trend.positive && 'rotate-180'}`} />
            {trend.value}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
              </div>
              <p className="text-muted-foreground">
                Google Analytics insights for AmplifiX • Last 30 days
              </p>
              {lastUpdated && (
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {lastUpdated.toLocaleString()}
                </p>
              )}
            </div>
            <Button onClick={fetchAnalytics} disabled={loading} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <div className="mt-2 text-xs">
                Make sure the Google Analytics API credentials are configured in the edge function secrets.
              </div>
            </AlertDescription>
          </Alert>
        )}

        {loading && !data ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-20 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : data ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Users"
                value={data.totalUsers.toLocaleString()}
                icon={Users}
                description="Unique visitors"
              />
              <StatCard
                title="Active Users"
                value={data.activeUsers.toLocaleString()}
                icon={Eye}
                description="Currently active"
              />
              <StatCard
                title="Page Views"
                value={data.pageViews.toLocaleString()}
                icon={MousePointer}
                description="Total page views"
              />
              <StatCard
                title="Avg. Session"
                value={data.avgSessionDuration}
                icon={Clock}
                description="Time on site"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Top Pages */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Pages</CardTitle>
                  <CardDescription>Most visited pages in the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.topPages.map((page, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 shrink-0">
                            <span className="text-sm font-semibold text-primary">{index + 1}</span>
                          </div>
                          <span className="text-sm truncate">{page.page || '/'}</span>
                        </div>
                        <span className="text-sm font-semibold ml-4">{page.views.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Countries */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Countries</CardTitle>
                  <CardDescription>User distribution by country</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.topCountries.map((country, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{country.country}</span>
                        </div>
                        <span className="text-sm font-semibold">{country.users.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Daily Users Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Active Users</CardTitle>
                <CardDescription>User activity over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-1">
                  {data.dailyUsers.map((day, index) => {
                    const maxUsers = Math.max(...data.dailyUsers.map(d => d.users));
                    const height = (day.users / maxUsers) * 100;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                          style={{ height: `${height}%` }}
                          title={`${day.date}: ${day.users} users`}
                        />
                        <span className="text-xs text-muted-foreground rotate-45 origin-top-left">
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bounce Rate</CardTitle>
                  <CardDescription>Percentage of single-page sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{data.bounceRate}</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Lower is generally better for engagement
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Analytics Integration</CardTitle>
                  <CardDescription>Google Analytics 4 (GA4)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>Connected to G-FQ4G09PD29</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Data is fetched from Google Analytics Data API
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </main>

      <Footer />
    </div>
  );
};

export default AdminAnalytics;
