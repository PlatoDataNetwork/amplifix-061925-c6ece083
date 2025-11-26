import { useState, useEffect } from 'react';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface VerticalInfo {
  vertical_slug: string;
  article_count: number;
}

export default function PlatoSourceStats() {
  const { isAdmin, loading: authLoading } = useAdminCheck();
  const navigate = useNavigate();
  const [verticals, setVerticals] = useState<VerticalInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingVertical, setProcessingVertical] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    fetchVerticals();
  }, []);

  const fetchVerticals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_vertical_article_counts');

      if (error) throw error;

      setVerticals(data || []);
    } catch (error) {
      console.error('Error fetching verticals:', error);
      toast.error('Failed to load verticals');
    } finally {
      setLoading(false);
    }
  };

  const processVertical = async (verticalSlug: string) => {
    setProcessingVertical(verticalSlug);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to perform this action');
      }

      const vertical = verticals.find(v => v.vertical_slug === verticalSlug);
      
      toast.info('Processing Started', {
        description: `Updating articles in ${verticalSlug.replace(/-/g, ' ')} (${vertical?.article_count.toLocaleString()} articles)...`,
      });

      const { data, error: functionError } = await supabase.functions.invoke(
        'update-plato-sources',
        {
          body: { vertical: verticalSlug },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (functionError) throw functionError;

      if (data.success) {
        toast.success('✓ Update Complete', {
          description: `Updated ${data.stats.updated} articles in ${verticalSlug.replace(/-/g, ' ')}`,
        });
      } else {
        throw new Error(data.error || 'Update failed');
      }
    } catch (err: any) {
      console.error('Update error:', err);
      toast.error('Update Failed', {
        description: err.message,
      });
    } finally {
      setProcessingVertical(null);
    }
  };

  if (authLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Plato Source Update</h1>
        <p className="text-muted-foreground">Process verticals to standardize source attribution to <span className="text-primary font-semibold">"Plato Data Intelligence"</span></p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Verticals</CardTitle>
            <CardDescription>Click Process to update source attribution for each vertical</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vertical</TableHead>
                  <TableHead className="text-right">Total Articles</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verticals.map((vertical) => (
                  <TableRow key={vertical.vertical_slug}>
                    <TableCell className="font-medium capitalize">
                      {vertical.vertical_slug.replace(/-/g, ' ')}
                    </TableCell>
                    <TableCell className="text-right">{vertical.article_count.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => processVertical(vertical.vertical_slug)}
                        disabled={processingVertical !== null}
                        size="sm"
                      >
                        {processingVertical === vertical.vertical_slug ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-3 w-3" />
                            Process
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
