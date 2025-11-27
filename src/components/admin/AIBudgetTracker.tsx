import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, TrendingUp, DollarSign, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CostEstimator } from "./CostEstimator";

interface AIUsageData {
  date: string;
  vertical_slug: string;
  model_used: string;
  api_calls: number;
  failed_calls: number;
  error_402_count: number;
}

export const AIBudgetTracker = () => {
  const { data: todayUsage, isLoading } = useQuery({
    queryKey: ["ai-usage-today"],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('ai_credit_usage')
        .select('*')
        .eq('date', today);

      if (error) throw error;
      return data as AIUsageData[];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: weekUsage } = useQuery({
    queryKey: ["ai-usage-week"],
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
      return data as AIUsageData[];
    },
    refetchInterval: 60000,
  });

  if (isLoading) {
    return <div className="text-muted-foreground">Loading usage data...</div>;
  }

  const todayCalls = todayUsage?.reduce((sum, item) => sum + item.api_calls, 0) || 0;
  const todayFailures = todayUsage?.reduce((sum, item) => sum + item.failed_calls, 0) || 0;
  const today402Errors = todayUsage?.reduce((sum, item) => sum + item.error_402_count, 0) || 0;
  
  const weekCalls = weekUsage?.reduce((sum, item) => sum + item.api_calls, 0) || 0;
  const week402Errors = weekUsage?.reduce((sum, item) => sum + item.error_402_count, 0) || 0;

  const successRate = todayCalls > 0 ? ((todayCalls - todayFailures) / todayCalls) * 100 : 100;
  const hasLowCredits = today402Errors > 0;

  return (
    <div className="space-y-4">
      {hasLowCredits && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Low AI Credits</AlertTitle>
          <AlertDescription>
            You've hit {today402Errors} payment required error{today402Errors > 1 ? 's' : ''} today. 
            Please add credits to your Lovable AI workspace to continue processing.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's API Calls</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCalls}</div>
            <p className="text-xs text-muted-foreground">
              {todayFailures} failed • {today402Errors} credit errors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
            <Progress value={successRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">7-Day Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weekCalls}</div>
            <p className="text-xs text-muted-foreground">
              {week402Errors} credit errors this week
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>By Vertical</CardTitle>
          <CardDescription>Today's usage breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {todayUsage && todayUsage.length > 0 ? (
              todayUsage.map((item) => (
                <div key={item.vertical_slug} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{item.vertical_slug}</p>
                    <p className="text-xs text-muted-foreground">{item.model_used}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{item.api_calls} calls</p>
                    {item.error_402_count > 0 && (
                      <p className="text-xs text-destructive">{item.error_402_count} credit errors</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No usage data for today</p>
            )}
          </div>
        </CardContent>
      </Card>

      <CostEstimator />
    </div>
  );
};
