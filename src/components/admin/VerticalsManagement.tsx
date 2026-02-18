import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { FolderTree } from 'lucide-react';

const VerticalsManagementInline = () => {
  const { data: verticals, isLoading } = useQuery({
    queryKey: ['verticals-management'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_vertical_article_counts');
      if (error) throw error;
      return data;
    },
  });

  const totalArticles = verticals?.reduce((acc, v) => acc + Number(v.article_count), 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Verticals</h2>
        <p className="text-muted-foreground">
          {verticals?.length || 0} verticals • {totalArticles.toLocaleString()} total articles
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {verticals?.map((v) => (
            <Card key={v.vertical_slug}>
              <CardContent className="flex items-center gap-3 p-4">
                <FolderTree className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">{v.vertical_slug}</p>
                  <p className="text-sm text-muted-foreground">
                    {Number(v.article_count).toLocaleString()} articles
                  </p>
                </div>
                <Badge variant="secondary">{((Number(v.article_count) / totalArticles) * 100).toFixed(1)}%</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerticalsManagementInline;
