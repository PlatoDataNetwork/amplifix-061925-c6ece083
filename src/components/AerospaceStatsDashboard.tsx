import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, FileText, Link, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useAerospaceStats } from "@/hooks/useAerospaceStats";
import { formatDistanceToNow } from "date-fns";

export const AerospaceStatsDashboard = () => {
  const { stats, isLoading, error, refresh } = useAerospaceStats();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8 text-destructive">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const urlBackfillPercentage =
    stats.totalArticles > 0
      ? ((stats.articlesWithExternalUrls / stats.totalArticles) * 100).toFixed(1)
      : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Aerospace Statistics</h2>
        <Button onClick={refresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArticles.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Aerospace articles in database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">External URLs</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.articlesWithExternalUrls.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {urlBackfillPercentage}% have source URLs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need Backfill</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.articlesNeedingBackfill.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Articles with PlatoData URLs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing URLs</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.articlesWithoutUrls.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Articles without any URL</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AI Processing Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {stats.aiProcessingJobs.progress.toFixed(1)}%
                </span>
              </div>
              <Progress value={stats.aiProcessingJobs.progress} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">{stats.aiProcessingJobs.inProgress}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">{stats.aiProcessingJobs.completed}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium">{stats.aiProcessingJobs.failed}</p>
                  <p className="text-xs text-muted-foreground">Failed</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{stats.aiProcessingJobs.total}</p>
                  <p className="text-xs text-muted-foreground">Total Jobs</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Import</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.latestImport ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge
                    variant={
                      stats.latestImport.status === "completed"
                        ? "default"
                        : stats.latestImport.status === "failed"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {stats.latestImport.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Articles Imported</span>
                  <span className="text-sm">{stats.latestImport.importedCount.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Started</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(stats.latestImport.startedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                {stats.latestImport.completedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Completed</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(stats.latestImport.completedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No import history available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
