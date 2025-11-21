import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import { Database, Users, FileText, Shield, Activity, Clock, LogOut, Archive, GitCompare, Map, Languages, Briefcase } from 'lucide-react';

interface SystemStats {
  totalUsers: number;
  totalAdmins: number;
  totalModerators: number;
  totalArticles: number;
  recentUsers: Array<{ email: string; created_at: string }>;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total users count
        const { count: totalUsers } = await supabase
          .from('user_roles')
          .select('user_id', { count: 'exact', head: true });

        // Fetch admin count
        const { count: totalAdmins } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'admin');

        // Fetch moderator count
        const { count: totalModerators } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'moderator');

        // Fetch total articles
        const { count: totalArticles } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true });

        // Fetch recent users (last 5)
        const { data: recentUsersData } = await supabase.auth.admin.listUsers();
        const recentUsers = (recentUsersData?.users || [])
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map(user => ({
            email: user.email || 'Unknown',
            created_at: user.created_at
          }));

        setStats({
          totalUsers: totalUsers || 0,
          totalAdmins: totalAdmins || 0,
          totalModerators: totalModerators || 0,
          totalArticles: totalArticles || 0,
          recentUsers
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: Users,
      action: () => navigate('/admin/users'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Article Import',
      description: 'Import and process all articles',
      icon: Database,
      action: () => navigate('/admin/import'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Article Editor',
      description: 'Edit and update article content',
      icon: FileText,
      action: () => navigate('/admin/articles'),
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Bulk Formatter',
      description: 'Apply formatting to all articles',
      icon: Activity,
      action: () => navigate('/admin/articles/format'),
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Article Backups',
      description: 'Manage article backups and restore',
      icon: Archive,
      action: () => navigate('/admin/articles/backups'),
      color: 'from-yellow-500 to-amber-500'
    },
    {
      title: 'Article Comparison',
      description: 'Compare article versions',
      icon: GitCompare,
      action: () => navigate('/admin/articles/comparison'),
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Sitemap Generator',
      description: 'Generate language-specific sitemaps',
      icon: Map,
      action: () => navigate('/admin/sitemaps'),
      color: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'Translation Manager',
      description: 'Generate AI translations for all languages',
      icon: Languages,
      action: () => navigate('/admin/translations'),
      color: 'from-teal-500 to-cyan-500'
    },
    {
      title: 'Showcase Manager',
      description: 'Manage company showcases and thumbnails',
      icon: Briefcase,
      action: () => navigate('/admin/showcase'),
      color: 'from-sky-500 to-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                sessionStorage.removeItem('admin_authenticated');
                window.location.href = '/';
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout from Admin
            </Button>
          </div>
          <p className="text-muted-foreground">
            System overview and management tools
          </p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalUsers}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Registered accounts
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrators</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalAdmins}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Admin roles assigned
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Moderators</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalModerators}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Moderator roles assigned
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.totalArticles}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Published articles
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action) => (
                  <Button
                    key={action.title}
                    onClick={action.action}
                    variant="outline"
                    className="w-full justify-start h-auto p-4 hover:bg-accent"
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} mr-4`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{action.title}</div>
                      <div className="text-sm text-muted-foreground">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent User Registrations</CardTitle>
              <CardDescription>Latest users who joined the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : stats?.recentUsers && stats.recentUsers.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentUsers.map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{user.email}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No recent registrations
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
