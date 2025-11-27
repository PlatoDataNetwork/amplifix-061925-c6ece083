import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProcessingStats {
  totalArticles: number;
  totalAPICalls: number;
  averageCallsPerArticle: number;
  trend: 'improving' | 'stable' | 'worsening';
}

export const CostEstimator = () => {
  const [remainingCredits, setRemainingCredits] = useState<string>("");
  const [showEstimate, setShowEstimate] = useState(false);

  // Get processing stats from last 7 days
  const { data: usageData } = useQuery({
    queryKey: ["ai-usage-stats"],
    queryFn: async () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('ai_credit_usage')
        .select('*')
        .gte('date', weekAgoStr)
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchInterval: 60000,
  });

  // Get recent AI processing jobs to correlate articles with API calls
  const { data: processingJobs } = useQuery({
    queryKey: ["recent-processing-jobs"],
    queryFn: async () => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('ai_processing_jobs')
        .select('vertical_slug, created_at, status')
        .gte('created_at', weekAgo.toISOString())
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Calculate average articles processed per completed job
  const { data: articlesPerJob } = useQuery({
    queryKey: ["articles-per-job", processingJobs],
    queryFn: async () => {
      if (!processingJobs || processingJobs.length === 0) return 0;

      const verticals = [...new Set(processingJobs.map(j => j.vertical_slug))];
      let totalArticles = 0;

      for (const vertical of verticals) {
        const { count } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('vertical_slug', vertical)
          .not('metadata->ai_processed', 'is', null);

        totalArticles += count || 0;
      }

      return totalArticles;
    },
    enabled: !!processingJobs && processingJobs.length > 0,
  });

  const calculateStats = (): ProcessingStats | null => {
    if (!usageData || usageData.length === 0) return null;

    const totalAPICalls = usageData.reduce((sum, item) => sum + item.api_calls, 0);
    const totalArticles = articlesPerJob || 0;

    if (totalArticles === 0) {
      return {
        totalArticles: 0,
        totalAPICalls,
        averageCallsPerArticle: 0,
        trend: 'stable'
      };
    }

    const averageCallsPerArticle = totalAPICalls / totalArticles;

    // Calculate trend by comparing first half vs second half of the week
    const midpoint = Math.floor(usageData.length / 2);
    const recentData = usageData.slice(0, midpoint);
    const olderData = usageData.slice(midpoint);

    const recentAvg = recentData.length > 0 
      ? recentData.reduce((sum, item) => sum + item.api_calls, 0) / recentData.length
      : 0;
    const olderAvg = olderData.length > 0
      ? olderData.reduce((sum, item) => sum + item.api_calls, 0) / olderData.length
      : 0;

    let trend: 'improving' | 'stable' | 'worsening' = 'stable';
    if (recentAvg < olderAvg * 0.9) trend = 'improving';
    else if (recentAvg > olderAvg * 1.1) trend = 'worsening';

    return {
      totalArticles,
      totalAPICalls,
      averageCallsPerArticle,
      trend
    };
  };

  const stats = calculateStats();
  const credits = parseFloat(remainingCredits) || 0;
  const estimatedArticles = stats && credits > 0 && stats.averageCallsPerArticle > 0
    ? Math.floor(credits / stats.averageCallsPerArticle)
    : 0;

  const handleCalculate = () => {
    if (credits > 0) {
      setShowEstimate(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Cost Estimator</CardTitle>
        </div>
        <CardDescription>
          Predict processing capacity based on historical usage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Historical Stats */}
        {stats && stats.totalArticles > 0 && (
          <div className="space-y-3 p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">7-Day Statistics</span>
              <div className="flex items-center gap-1">
                {stats.trend === 'improving' && <TrendingDown className="h-4 w-4 text-green-500" />}
                {stats.trend === 'worsening' && <TrendingUp className="h-4 w-4 text-red-500" />}
                <span className="text-xs text-muted-foreground capitalize">{stats.trend}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{stats.totalArticles}</div>
                <div className="text-xs text-muted-foreground">Articles Processed</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalAPICalls}</div>
                <div className="text-xs text-muted-foreground">API Calls Made</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.averageCallsPerArticle.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">Calls per Article</div>
              </div>
            </div>
          </div>
        )}

        {!stats || stats.totalArticles === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No recent processing data available.</p>
            <p className="text-sm mt-2">Process some articles to see cost estimates.</p>
          </div>
        ) : (
          <>
            {/* Credit Input */}
            <div className="space-y-2">
              <Label htmlFor="credits">Current Credit Balance</Label>
              <div className="flex gap-2">
                <Input
                  id="credits"
                  type="number"
                  placeholder="Enter remaining credits"
                  value={remainingCredits}
                  onChange={(e) => setRemainingCredits(e.target.value)}
                  min="0"
                  step="100"
                />
                <Button onClick={handleCalculate} disabled={!credits}>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Check your credit balance in your Lovable workspace settings
              </p>
            </div>

            {/* Estimate Results */}
            {showEstimate && credits > 0 && (
              <div className="space-y-4 p-4 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Estimated Processing Capacity</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Estimated Articles</span>
                      <span className="text-3xl font-bold text-primary">{estimatedArticles}</span>
                    </div>
                    <Progress value={Math.min((estimatedArticles / 1000) * 100, 100)} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-lg bg-background">
                      <div className="text-muted-foreground">Cost per Article</div>
                      <div className="text-lg font-semibold">
                        {stats.averageCallsPerArticle.toFixed(2)} credits
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-background">
                      <div className="text-muted-foreground">Total Budget</div>
                      <div className="text-lg font-semibold">
                        {credits.toLocaleString()} credits
                      </div>
                    </div>
                  </div>

                  {stats.trend === 'improving' && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400 text-sm">
                      <TrendingDown className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p>
                        Your processing efficiency is improving! Recent articles are using fewer credits on average.
                      </p>
                    </div>
                  )}
                  
                  {stats.trend === 'worsening' && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 text-red-700 dark:text-red-400 text-sm">
                      <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p>
                        Processing costs are increasing. Consider using a cheaper model or optimizing prompts.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
