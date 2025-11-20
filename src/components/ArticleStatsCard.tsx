import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useArticleStats } from "@/hooks/useArticleStats";
import { FileText, CheckCircle2, Archive, TrendingUp } from "lucide-react";

const ArticleStatsCard = () => {
  const { stats, isLoading, error } = useArticleStats();

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">Error loading statistics: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArticles.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.articlesWithContent.toLocaleString()} with content
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Formatted Articles</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.formattedArticles.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              With proper paragraph structure
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Backup Count</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.backupCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Stored before formatting
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.formattingSuccessRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Articles formatted successfully
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Formatting Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {stats.formattedArticles.toLocaleString()} of {stats.totalArticles.toLocaleString()} articles formatted
              </span>
              <span className="font-medium">{stats.formattingSuccessRate}%</span>
            </div>
            <Progress value={stats.formattingSuccessRate} className="h-2" />
            {stats.articlesWithoutContent > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Note: {stats.articlesWithoutContent.toLocaleString()} articles have no content to format
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleStatsCard;
