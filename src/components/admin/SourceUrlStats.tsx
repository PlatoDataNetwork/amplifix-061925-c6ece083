import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SourceUrlStatsProps {
  verticalSlug: string;
}

interface Stats {
  total: number;
  withUrl: number;
  withoutUrl: number;
  percentage: number;
  sampleUrls: Array<{ title: string; url: string }>;
}

export const SourceUrlStats = ({ verticalSlug }: SourceUrlStatsProps) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);

      // Count total articles
      const { count: total } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', verticalSlug);

      // Count articles with external_url
      const { count: withUrl } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('vertical_slug', verticalSlug)
        .not('external_url', 'is', null)
        .neq('external_url', '');

      // Get sample URLs
      const { data: samples } = await supabase
        .from('articles')
        .select('title, external_url')
        .eq('vertical_slug', verticalSlug)
        .not('external_url', 'is', null)
        .neq('external_url', '')
        .order('created_at', { ascending: false })
        .limit(5);

      const totalCount = total || 0;
      const withUrlCount = withUrl || 0;
      const withoutUrlCount = totalCount - withUrlCount;
      const percentage = totalCount > 0 ? Math.round((withUrlCount / totalCount) * 100) : 0;

      setStats({
        total: totalCount,
        withUrl: withUrlCount,
        withoutUrl: withoutUrlCount,
        percentage,
        sampleUrls: samples?.map(s => ({ title: s.title, url: s.external_url! })) || []
      });
    } catch (error) {
      console.error('Error loading source URL stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();

    // Refresh every 10 seconds
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, [verticalSlug]);

  if (loading && !stats) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Source URL Extraction Stats
          </span>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={loadStats}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : '🔄 Refresh'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-background rounded-lg border">
            <p className="text-xs text-muted-foreground mb-1">Total Articles</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border">
            <p className="text-xs text-muted-foreground mb-1">With Source URL</p>
            <p className="text-2xl font-bold text-green-500">{stats.withUrl}</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border">
            <p className="text-xs text-muted-foreground mb-1">Missing URL</p>
            <p className="text-2xl font-bold text-orange-500">{stats.withoutUrl}</p>
          </div>
          <div className="text-center p-4 bg-background rounded-lg border">
            <p className="text-xs text-muted-foreground mb-1">Coverage</p>
            <p className="text-2xl font-bold text-blue-500">{stats.percentage}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Source URL Coverage</span>
            <span className="font-semibold">{stats.percentage}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>

        {/* Sample URLs */}
        {stats.sampleUrls.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Recent Extracted Sources:</p>
            <div className="space-y-2">
              {stats.sampleUrls.map((sample, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-muted rounded-lg text-sm space-y-1"
                >
                  <p className="font-medium line-clamp-1">{sample.title}</p>
                  <a 
                    href={sample.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline flex items-center gap-1 line-clamp-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {sample.url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.withUrl === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <p className="text-sm">No source URLs extracted yet.</p>
            <p className="text-xs mt-1">Run "Reprocess & Extract Sources" to populate external URLs.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
