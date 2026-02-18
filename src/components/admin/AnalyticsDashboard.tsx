import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Users, Eye, MousePointerClick, RefreshCw, Monitor, Smartphone, Tablet, Globe, FileText, TrendingUp, BarChart3, Calendar, Timer, ArrowDownUp } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface RealtimeData { totalActiveUsers: string; totalPageViews: string; totalConversions: string; totalEvents: string; }
interface DeviceData { device: string; sessions: string; }
interface CountryData { country: string; sessions: string; }
interface HistoricalData { date: string; sessions: string; totalUsers: string; screenPageViews: string; eventCount: string; bounceRate: string; avgDuration: string; }
interface PagesData { page: string; sessions: string; pageViews: string; }
interface CountriesData { country: string; sessions: string; users: string; }

interface GARow { dimensionValues: { value: string }[]; metricValues: { value: string }[]; }
interface GAReport { rows?: GARow[]; totals?: { metricValues: { value: string }[] }[]; rowCount?: number; }

const fetchGAData = async (type: string, params?: Record<string, string>): Promise<GAReport> => {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  if (!token) throw new Error("Not authenticated");
  const queryParams = new URLSearchParams({ type, ...params });
  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ga-realtime?${queryParams}`, {
    headers: { Authorization: `Bearer ${token}`, apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
  });
  if (!res.ok) { const errData = await res.json(); throw new Error(errData.error || "Failed to fetch analytics"); }
  return res.json();
};

const DeviceIcon = ({ device }: { device: string }) => {
  const d = device.toLowerCase();
  if (d === "mobile") return <Smartphone className="w-4 h-4" />;
  if (d === "tablet") return <Tablet className="w-4 h-4" />;
  return <Monitor className="w-4 h-4" />;
};

const formatDateLabel = (dateStr: string) => {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  return `${dateStr.substring(4, 6)}/${dateStr.substring(6, 8)}`;
};

const DATE_RANGES = [
  { label: "Last 7 days", value: "7", startDate: "7daysAgo" },
  { label: "Last 30 days", value: "30", startDate: "30daysAgo" },
  { label: "Last 90 days", value: "90", startDate: "90daysAgo" },
  { label: "Last 365 days", value: "365", startDate: "365daysAgo" },
];

const CHART_COLORS = {
  sessions: "hsl(var(--primary))",
  totalUsers: "hsl(var(--chart-2, 160 60% 45%))",
  screenPageViews: "hsl(var(--chart-3, 30 80% 55%))",
  eventCount: "hsl(var(--chart-4, 280 65% 60%))",
  bounceRate: "hsl(var(--destructive, 0 84% 60%))",
  avgDuration: "hsl(var(--chart-5, 200 70% 50%))",
};

const AnalyticsDashboard = () => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [dateRange, setDateRange] = useState("7");
  const [historicalDimension, setHistoricalDimension] = useState("date");
  const selectedRange = DATE_RANGES.find((r) => r.value === dateRange) || DATE_RANGES[0];

  const { data: realtimeData, isLoading: realtimeLoading, refetch: refetchRealtime, error: realtimeError } = useQuery({
    queryKey: ["ga-realtime"], queryFn: () => fetchGAData("realtime"), refetchInterval: autoRefresh ? 30000 : false, staleTime: 15000,
  });
  const { data: deviceData, isLoading: deviceLoading, refetch: refetchDevice } = useQuery({
    queryKey: ["ga-realtime-device"], queryFn: () => fetchGAData("realtime-overview", { dimension: "deviceCategory" }), refetchInterval: autoRefresh ? 30000 : false, staleTime: 15000,
  });
  const { data: countryData, isLoading: countryLoading, refetch: refetchCountry } = useQuery({
    queryKey: ["ga-realtime-country"], queryFn: () => fetchGAData("realtime-overview", { dimension: "country" }), refetchInterval: autoRefresh ? 30000 : false, staleTime: 15000,
  });
  const { data: historicalData, isLoading: historicalLoading, refetch: refetchHistorical } = useQuery({
    queryKey: ["ga-historical", dateRange, historicalDimension],
    queryFn: () => fetchGAData("historical", { startDate: selectedRange.startDate, endDate: "today", metrics: "sessions,totalUsers,screenPageViews,eventCount,bounceRate,averageSessionDuration", dimension: historicalDimension }),
    staleTime: 60000,
  });
  const { data: historicalPages, isLoading: historicalPagesLoading } = useQuery({
    queryKey: ["ga-historical-pages", dateRange],
    queryFn: () => fetchGAData("historical", { startDate: selectedRange.startDate, endDate: "today", metrics: "sessions,screenPageViews", dimension: "pageTitle" }),
    staleTime: 60000,
  });
  const { data: historicalCountries, isLoading: historicalCountriesLoading } = useQuery({
    queryKey: ["ga-historical-countries", dateRange],
    queryFn: () => fetchGAData("historical", { startDate: selectedRange.startDate, endDate: "today", metrics: "sessions,totalUsers", dimension: "country" }),
    staleTime: 60000,
  });

  const handleRefreshAll = () => { refetchRealtime(); refetchDevice(); refetchCountry(); refetchHistorical(); };

  const totalActiveUsers = realtimeData?.totals?.[0]?.metricValues?.[0]?.value || "0";
  const totalPageViews = realtimeData?.totals?.[0]?.metricValues?.[1]?.value || "0";
  const totalConversions = realtimeData?.totals?.[0]?.metricValues?.[2]?.value || "0";
  const totalEvents = realtimeData?.totals?.[0]?.metricValues?.[3]?.value || "0";

  const chartData = (historicalData?.rows || []).map((row) => ({
    label: historicalDimension === "date" ? formatDateLabel(row.dimensionValues[0].value) : row.dimensionValues[0].value,
    sessions: parseInt(row.metricValues[0]?.value || "0", 10),
    totalUsers: parseInt(row.metricValues[1]?.value || "0", 10),
    screenPageViews: parseInt(row.metricValues[2]?.value || "0", 10),
    eventCount: parseInt(row.metricValues[3]?.value || "0", 10),
    bounceRate: parseFloat(row.metricValues[4]?.value || "0") * 100,
    avgDuration: parseFloat(row.metricValues[5]?.value || "0"),
  }));

  const histTotalSessions = historicalData?.totals?.[0]?.metricValues?.[0]?.value || "0";
  const histTotalUsers = historicalData?.totals?.[0]?.metricValues?.[1]?.value || "0";
  const histTotalPageViews = historicalData?.totals?.[0]?.metricValues?.[2]?.value || "0";
  const histTotalEvents = historicalData?.totals?.[0]?.metricValues?.[3]?.value || "0";
  const histBounceRate = parseFloat(historicalData?.totals?.[0]?.metricValues?.[4]?.value || "0") * 100;
  const histAvgDuration = parseFloat(historicalData?.totals?.[0]?.metricValues?.[5]?.value || "0");
  const formatDuration = (seconds: number) => { const m = Math.floor(seconds / 60); const s = Math.round(seconds % 60); return m > 0 ? `${m}m ${s}s` : `${s}s`; };

  const pagesChartData = (historicalPages?.rows || []).map((row) => ({ page: row.dimensionValues[0].value?.substring(0, 40) || "(not set)", sessions: parseInt(row.metricValues[0]?.value || "0", 10), pageViews: parseInt(row.metricValues[1]?.value || "0", 10) })).sort((a, b) => b.pageViews - a.pageViews).slice(0, 10);
  const countriesChartData = (historicalCountries?.rows || []).map((row) => ({ country: row.dimensionValues[0].value || "(not set)", sessions: parseInt(row.metricValues[0]?.value || "0", 10), users: parseInt(row.metricValues[1]?.value || "0", 10) })).sort((a, b) => b.users - a.users).slice(0, 10);

  const tooltipStyle = { backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--card-foreground))" };

  const StatCard = ({ icon: Icon, value, label, loading, variant = "primary" }: { icon: any; value: string; label: string; loading: boolean; variant?: string }) => (
    <Card><CardContent className="pt-6"><div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg ${variant === "destructive" ? "bg-destructive/10" : "bg-primary/10"} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${variant === "destructive" ? "text-destructive" : "text-primary"}`} />
      </div>
      <div>{loading ? <Skeleton className="h-7 w-16" /> : <p className="text-2xl font-bold text-foreground">{value}</p>}<p className="text-xs text-muted-foreground">{label}</p></div>
    </div></CardContent></Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h2 className="text-2xl font-bold text-foreground">Analytics</h2><p className="text-muted-foreground text-sm mt-1">Real-time & historical data from Google Analytics 4</p></div>
        <div className="flex items-center gap-2">
          <Badge variant={autoRefresh ? "default" : "outline"} className="cursor-pointer" onClick={() => setAutoRefresh(!autoRefresh)}><Activity className="w-3 h-3 mr-1" />{autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}</Badge>
          <Button variant="outline" size="sm" onClick={handleRefreshAll}><RefreshCw className="w-4 h-4 mr-1" />Refresh</Button>
        </div>
      </div>

      {realtimeError && <Card className="border-destructive"><CardContent className="pt-6"><p className="text-destructive text-sm">Error: {(realtimeError as Error).message}</p></CardContent></Card>}

      <Tabs defaultValue="realtime" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <TabsList>
            <TabsTrigger value="realtime" className="gap-1.5"><Activity className="w-4 h-4" />Real-Time</TabsTrigger>
            <TabsTrigger value="historical" className="gap-1.5"><TrendingUp className="w-4 h-4" />Historical</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-1.5">{DATE_RANGES.map((range) => (<Button key={range.value} variant={dateRange === range.value ? "default" : "outline"} size="sm" onClick={() => setDateRange(range.value)}>{range.label}</Button>))}</div>
          </div>
        </div>

        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} value={totalActiveUsers} label="Active Users" loading={realtimeLoading} />
            <StatCard icon={Eye} value={totalPageViews} label="Page Views" loading={realtimeLoading} />
            <StatCard icon={MousePointerClick} value={totalEvents} label="Events" loading={realtimeLoading} />
            <StatCard icon={Activity} value={totalConversions} label="Conversions" loading={realtimeLoading} />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-1"><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><FileText className="w-4 h-4" />Top Pages</CardTitle></CardHeader><CardContent>
              {realtimeLoading ? <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div> : realtimeData?.rows?.length ? <div className="space-y-2 max-h-[300px] overflow-y-auto">{realtimeData.rows.map((row, i) => (<div key={i} className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-muted/50 text-sm"><span className="truncate flex-1 mr-2 text-foreground">{row.dimensionValues[0].value}</span><Badge variant="secondary" className="text-xs shrink-0">{row.metricValues[0].value}</Badge></div>))}</div> : <p className="text-sm text-muted-foreground">No active pages</p>}
            </CardContent></Card>
            <Card><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Monitor className="w-4 h-4" />Devices</CardTitle></CardHeader><CardContent>
              {deviceLoading ? <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div> : deviceData?.rows?.length ? <div className="space-y-2">{deviceData.rows.map((row, i) => (<div key={i} className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-muted/50 text-sm"><div className="flex items-center gap-2"><DeviceIcon device={row.dimensionValues[0].value} /><span className="capitalize text-foreground">{row.dimensionValues[0].value}</span></div><Badge variant="secondary" className="text-xs">{row.metricValues[0].value}</Badge></div>))}</div> : <p className="text-sm text-muted-foreground">No device data</p>}
            </CardContent></Card>
            <Card><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Globe className="w-4 h-4" />Countries</CardTitle></CardHeader><CardContent>
              {countryLoading ? <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div> : countryData?.rows?.length ? <div className="space-y-2 max-h-[300px] overflow-y-auto">{countryData.rows.map((row, i) => (<div key={i} className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-muted/50 text-sm"><span className="text-foreground">{row.dimensionValues[0].value}</span><Badge variant="secondary" className="text-xs">{row.metricValues[0].value}</Badge></div>))}</div> : <p className="text-sm text-muted-foreground">No country data</p>}
            </CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="historical" className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard icon={BarChart3} value={Number(histTotalSessions).toLocaleString()} label="Sessions" loading={historicalLoading} />
            <StatCard icon={Users} value={Number(histTotalUsers).toLocaleString()} label="Total Users" loading={historicalLoading} />
            <StatCard icon={Eye} value={Number(histTotalPageViews).toLocaleString()} label="Page Views" loading={historicalLoading} />
            <StatCard icon={MousePointerClick} value={Number(histTotalEvents).toLocaleString()} label="Events" loading={historicalLoading} />
            <StatCard icon={ArrowDownUp} value={`${histBounceRate.toFixed(1)}%`} label="Bounce Rate" loading={historicalLoading} variant="destructive" />
            <StatCard icon={Timer} value={formatDuration(histAvgDuration)} label="Avg. Session Duration" loading={historicalLoading} />
          </div>

          <Card><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4" />Sessions & Users Trend</CardTitle></CardHeader><CardContent>
            {historicalLoading ? <Skeleton className="h-[300px] w-full" /> : chartData.length ? <ResponsiveContainer width="100%" height={300}><AreaChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="label" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} /><YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} /><Tooltip contentStyle={tooltipStyle} /><Legend /><Area type="monotone" dataKey="sessions" name="Sessions" stroke={CHART_COLORS.sessions} fill={CHART_COLORS.sessions} fillOpacity={0.15} strokeWidth={2} /><Area type="monotone" dataKey="totalUsers" name="Users" stroke={CHART_COLORS.totalUsers} fill={CHART_COLORS.totalUsers} fillOpacity={0.1} strokeWidth={2} /></AreaChart></ResponsiveContainer> : <p className="text-sm text-muted-foreground text-center py-12">No trend data available</p>}
          </CardContent></Card>

          <Card><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Eye className="w-4 h-4" />Page Views & Events Trend</CardTitle></CardHeader><CardContent>
            {historicalLoading ? <Skeleton className="h-[300px] w-full" /> : chartData.length ? <ResponsiveContainer width="100%" height={300}><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="label" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} /><YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} /><Tooltip contentStyle={tooltipStyle} /><Legend /><Line type="monotone" dataKey="screenPageViews" name="Page Views" stroke={CHART_COLORS.screenPageViews} strokeWidth={2} dot={false} /><Line type="monotone" dataKey="eventCount" name="Events" stroke={CHART_COLORS.eventCount} strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer> : <p className="text-sm text-muted-foreground text-center py-12">No trend data available</p>}
          </CardContent></Card>

          <Card><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><ArrowDownUp className="w-4 h-4" />Bounce Rate & Avg. Session Duration</CardTitle></CardHeader><CardContent>
            {historicalLoading ? <Skeleton className="h-[300px] w-full" /> : chartData.length ? <ResponsiveContainer width="100%" height={300}><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="label" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} /><YAxis yAxisId="left" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${v}%`} /><YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${v}s`} /><Tooltip contentStyle={tooltipStyle} formatter={(value: number, name: string) => name === "Bounce Rate" ? `${value.toFixed(1)}%` : `${value.toFixed(1)}s`} /><Legend /><Line yAxisId="left" type="monotone" dataKey="bounceRate" name="Bounce Rate" stroke={CHART_COLORS.bounceRate} strokeWidth={2} dot={false} /><Line yAxisId="right" type="monotone" dataKey="avgDuration" name="Avg. Duration" stroke={CHART_COLORS.avgDuration} strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer> : <p className="text-sm text-muted-foreground text-center py-12">No trend data available</p>}
          </CardContent></Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><FileText className="w-4 h-4" />Top Pages ({selectedRange.label})</CardTitle></CardHeader><CardContent>
              {historicalPagesLoading ? <Skeleton className="h-[300px] w-full" /> : pagesChartData.length ? <ResponsiveContainer width="100%" height={300}><BarChart data={pagesChartData} layout="vertical" margin={{ left: 20 }}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} /><YAxis type="category" dataKey="page" width={140} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="pageViews" name="Page Views" fill={CHART_COLORS.screenPageViews} radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer> : <p className="text-sm text-muted-foreground text-center py-12">No page data</p>}
            </CardContent></Card>
            <Card><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Globe className="w-4 h-4" />Top Countries ({selectedRange.label})</CardTitle></CardHeader><CardContent>
              {historicalCountriesLoading ? <Skeleton className="h-[300px] w-full" /> : countriesChartData.length ? <ResponsiveContainer width="100%" height={300}><BarChart data={countriesChartData} layout="vertical" margin={{ left: 20 }}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} /><YAxis type="category" dataKey="country" width={100} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} /><Tooltip contentStyle={tooltipStyle} /><Bar dataKey="users" name="Users" fill={CHART_COLORS.totalUsers} radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer> : <p className="text-sm text-muted-foreground text-center py-12">No country data</p>}
            </CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
