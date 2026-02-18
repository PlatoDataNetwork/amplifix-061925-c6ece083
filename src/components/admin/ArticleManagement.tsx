import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Search, FileText, ExternalLink, Trash2, Edit, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const PAGE_SIZE = 20;

interface ArticleManagementProps {
  onEditArticle?: (id: string) => void;
}

const ArticleManagement = ({ onEditArticle }: ArticleManagementProps) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [verticalFilter, setVerticalFilter] = useState<string>('all');
  const [page, setPage] = useState(0);

  const { data: verticals } = useQuery({
    queryKey: ['article-verticals'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_article_verticals');
      if (error) throw error;
      return data;
    },
  });

  const { data: articlesData, isLoading } = useQuery({
    queryKey: ['admin-articles', search, verticalFilter, page],
    queryFn: async () => {
      let query = supabase
        .from('articles')
        .select('id, title, vertical_slug, author, published_at, image_url, external_url', { count: 'exact' })
        .order('published_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (verticalFilter && verticalFilter !== 'all') {
        query = query.eq('vertical_slug', verticalFilter);
      }
      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { articles: data, total: count || 0 };
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success('Article deleted');
    },
    onError: (err) => toast.error(`Delete failed: ${err.message}`),
  });

  const totalPages = Math.ceil((articlesData?.total || 0) / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Article Management</h2>
        <p className="text-muted-foreground">
          {articlesData?.total?.toLocaleString()} articles total
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-9"
          />
        </div>
        <Select value={verticalFilter} onValueChange={(v) => { setVerticalFilter(v); setPage(0); }}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Verticals" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Verticals</SelectItem>
            {verticals?.map((v) => (
              <SelectItem key={v.vertical_slug} value={v.vertical_slug}>
                {v.vertical_slug} ({v.article_count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="divide-y">
              {articlesData?.articles?.map((article) => (
                <div key={article.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                  {article.image_url && (
                    <img
                      src={article.image_url}
                      alt=""
                      className="h-12 w-12 rounded object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{article.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {article.vertical_slug}
                      </Badge>
                      {article.author && <span>{article.author}</span>}
                      <span>{new Date(article.published_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {article.external_url && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={article.external_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {onEditArticle && (
                      <Button variant="ghost" size="icon" onClick={() => onEditArticle(article.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Article</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{article.title}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMutation.mutate(article.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
              {!articlesData?.articles?.length && (
                <div className="p-8 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No articles found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleManagement;
