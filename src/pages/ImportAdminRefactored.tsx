import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainHeader from '@/components/MainHeader';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { usePlatoVerticals } from '@/hooks/usePlatoVerticals';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Play } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ImportAdminRefactored() {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminCheck();
  const { verticals, isLoading: verticalsLoading } = usePlatoVerticals();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [urls, setUrls] = useState<Record<string, string>>({});

  // Timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading || verticalsLoading) {
        setLoadingTimeout(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [loading, verticalsLoading]);

  // Redirect if not admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  // Initialize URLs from verticals
  useEffect(() => {
    if (verticals.length > 0) {
      const initialUrls: Record<string, string> = {};
      verticals.forEach(v => {
        initialUrls[v.slug] = v.url;
      });
      setUrls(initialUrls);
    }
  }, [verticals]);

  if ((loading || verticalsLoading) && !loadingTimeout) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (loadingTimeout) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Loading timeout. Please refresh the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const handleUrlChange = (slug: string, url: string) => {
    setUrls(prev => ({ ...prev, [slug]: url }));
  };

  const handleImport = async (slug: string, name: string) => {
    try {
      toast.info(`Starting import for ${name}...`);
      
      const { data, error } = await supabase.functions.invoke('import-articles', {
        body: { 
          vertical: slug,
          customJsonUrl: urls[slug]
        }
      });

      if (error) throw error;
      
      toast.success(`${name} import completed! ${data?.insertedArticles || 0} articles imported.`);
    } catch (error: any) {
      toast.error(`Import failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Import JSON URLs</h1>
          <p className="text-muted-foreground">
            Configure JSON feed URLs for each vertical and start imports
          </p>
        </div>

        {/* Verticals List */}
        <div className="space-y-3">
          {verticals.map((vertical) => (
            <Card key={vertical.slug}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label htmlFor={`url-${vertical.slug}`} className="block text-sm font-medium mb-2">
                      {vertical.name}
                    </label>
                    <input
                      id={`url-${vertical.slug}`}
                      type="url"
                      placeholder="https://platodata.ai/cannabis/json/"
                      value={urls[vertical.slug] || ''}
                      onChange={(e) => handleUrlChange(vertical.slug, e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <Button
                    onClick={() => handleImport(vertical.slug, vertical.name)}
                    disabled={!urls[vertical.slug]?.trim()}
                    className="mt-6"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
