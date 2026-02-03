import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Folder, Users, Rss } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardView = () => {
  // Fetch total articles count
  const { data: articlesCount, isLoading: articlesLoading } = useQuery({
    queryKey: ["management-articles-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch unique verticals count
  const { data: verticalsData, isLoading: verticalsLoading } = useQuery({
    queryKey: ["management-verticals-count"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_vertical_article_counts");
      if (error) throw error;
      return data?.length || 0;
    },
  });

  // Fetch users count
  const { data: usersCount, isLoading: usersLoading } = useQuery({
    queryKey: ["management-users-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch import schedules count (as proxy for RSS feeds)
  const { data: feedsCount, isLoading: feedsLoading } = useQuery({
    queryKey: ["management-feeds-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("import_schedules")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const stats = [
    {
      title: "Total Articles",
      value: articlesCount,
      loading: articlesLoading,
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Verticals",
      value: verticalsData,
      loading: verticalsLoading,
      icon: Folder,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Users",
      value: usersCount,
      loading: usersLoading,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Import Schedules",
      value: feedsCount,
      loading: feedsLoading,
      icon: Rss,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the AmplifiX Management Dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">
                  {stat.value?.toLocaleString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Use the sidebar to navigate to different management sections:
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li><strong>Content:</strong> Manage articles, formatting, and backups</li>
              <li><strong>Import:</strong> Import articles from various sources</li>
              <li><strong>Settings:</strong> User management, showcase, sitemaps</li>
              <li><strong>Analytics:</strong> View stats, CRM, and security</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm">All systems operational</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Database connected • Edge functions active
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
