import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Globe, FileText, RefreshCw, Download } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'Arabic' },
  { code: 'bn', name: 'Bengali' },
  { code: 'da', name: 'Danish' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'es', name: 'Spanish' },
  { code: 'et', name: 'Estonian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'he', name: 'Hebrew' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'sv', name: 'Swedish' },
  { code: 'tr', name: 'Turkish' },
  { code: 'zh', name: 'Chinese' },
];

const BATCH_SIZE = 1000;
const SUPABASE_URL = 'https://rfkdcmvzvxcsoecoeddi.supabase.co';

export default function SitemapAdmin() {
  const [selectedVertical, setSelectedVertical] = useState<string | null>(null);

  const { data: verticalCounts, isLoading: verticalsLoading, refetch } = useQuery({
    queryKey: ['vertical-article-counts'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_vertical_article_counts');
      if (error) throw error;
      return data as Array<{ vertical_slug: string; article_count: number }>;
    },
  });

  const totalArticles = verticalCounts?.reduce((sum, v) => sum + Number(v.article_count), 0) || 0;

  const getVerticalBatches = (count: number) => Math.ceil(count / BATCH_SIZE);

  const openSitemap = (url: string) => {
    window.open(url, '_blank');
  };

  const downloadSitemap = async (url: string, filename: string) => {
    try {
      toast.loading(`Downloading ${filename}...`, { id: filename });
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch sitemap');
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success(`Downloaded ${filename}`, { id: filename });
    } catch (error) {
      toast.error(`Failed to download ${filename}`, { id: filename });
    }
  };

  const getCannabisSitemapUrl = (lang: string, batch: number) => 
    `${SUPABASE_URL}/functions/v1/serve-cannabis-sitemap?lang=${lang}&batch=${batch}`;

  const getCannabisSitemapIndexUrl = () => 
    `${SUPABASE_URL}/functions/v1/serve-cannabis-sitemap?index=true`;

  const getLanguageSitemapUrl = (lang: string) => 
    `${SUPABASE_URL}/functions/v1/serve-language-sitemap?lang=${lang}`;

  const getMainSitemapUrl = (batch: number) => 
    `${SUPABASE_URL}/functions/v1/serve-sitemap?batch=${batch}`;

  const cannabisVertical = verticalCounts?.find(v => v.vertical_slug === 'cannabis');
  const cannabisBatches = cannabisVertical ? getVerticalBatches(Number(cannabisVertical.article_count)) : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead 
        title="Sitemap Admin | AmplifiX"
        description="Admin dashboard for managing and testing sitemaps"
      />
      <MainHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sitemap Admin</h1>
            <p className="text-muted-foreground mt-1">
              View and test all generated sitemaps with article counts
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalArticles.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Verticals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{verticalCounts?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{SUPPORTED_LANGUAGES.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cannabis Batches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cannabisBatches}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="download" className="space-y-6">
          <TabsList>
            <TabsTrigger value="download">Download Sitemaps</TabsTrigger>
            <TabsTrigger value="cannabis">Cannabis Sitemaps</TabsTrigger>
            <TabsTrigger value="language">Language Sitemaps</TabsTrigger>
            <TabsTrigger value="verticals">All Verticals</TabsTrigger>
          </TabsList>

          {/* Download Sitemaps Tab */}
          <TabsContent value="download" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Cannabis Sitemaps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Download XML sitemaps for each language. Each batch contains up to {BATCH_SIZE.toLocaleString()} articles.
                  Total: {cannabisVertical ? Number(cannabisVertical.article_count).toLocaleString() : 0} cannabis articles.
                </p>
                
                {/* Download Index */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-6">
                  <div>
                    <p className="font-medium">Sitemap Index</p>
                    <p className="text-sm text-muted-foreground">
                      Master index linking all {cannabisBatches * SUPPORTED_LANGUAGES.length} sitemaps
                    </p>
                  </div>
                  <Button 
                    onClick={() => downloadSitemap(getCannabisSitemapIndexUrl(), 'cannabis-sitemap-index.xml')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Index
                  </Button>
                </div>

                {/* Download by Language */}
                <div className="space-y-4">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <div key={lang.code} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-base px-3 py-1">
                            {lang.code.toUpperCase()}
                          </Badge>
                          <p className="font-medium">{lang.name}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {cannabisBatches} file{cannabisBatches !== 1 ? 's' : ''} • ~{Math.min(Number(cannabisVertical?.article_count || 0), cannabisBatches * BATCH_SIZE).toLocaleString()} articles
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Array.from({ length: cannabisBatches }, (_, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            onClick={() => downloadSitemap(
                              getCannabisSitemapUrl(lang.code, i),
                              `cannabis-sitemap-${lang.code}-batch-${i + 1}.xml`
                            )}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Batch {i + 1}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cannabis Sitemaps Tab */}
          <TabsContent value="cannabis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Cannabis Sitemap Index
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Sitemap Index</p>
                    <p className="text-sm text-muted-foreground">
                      Contains {cannabisBatches * SUPPORTED_LANGUAGES.length} sitemaps 
                      ({cannabisBatches} batches × {SUPPORTED_LANGUAGES.length} languages)
                    </p>
                  </div>
                  <Button onClick={() => openSitemap(getCannabisSitemapIndexUrl())}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Index
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Cannabis Sitemaps by Language
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <div key={lang.code} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">{lang.name}</p>
                          <Badge variant="secondary" className="mt-1">{lang.code}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {cannabisBatches} batch{cannabisBatches !== 1 ? 'es' : ''}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Array.from({ length: cannabisBatches }, (_, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            onClick={() => openSitemap(getCannabisSitemapUrl(lang.code, i))}
                          >
                            Batch {i + 1}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Language Sitemaps Tab */}
          <TabsContent value="language" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  General Language Sitemaps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  These sitemaps contain static routes and up to 1000 articles per language (all verticals combined)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {SUPPORTED_LANGUAGES.filter(l => l.code !== 'en').map((lang) => (
                    <Button
                      key={lang.code}
                      variant="outline"
                      className="flex flex-col h-auto py-3"
                      onClick={() => openSitemap(getLanguageSitemapUrl(lang.code))}
                    >
                      <span className="font-medium">{lang.name}</span>
                      <Badge variant="secondary" className="mt-1">{lang.code}</Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Verticals Tab */}
          <TabsContent value="verticals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Counts by Vertical</CardTitle>
              </CardHeader>
              <CardContent>
                {verticalsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {verticalCounts?.map((vertical) => {
                      const batches = getVerticalBatches(Number(vertical.article_count));
                      return (
                        <div
                          key={vertical.vertical_slug}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant={vertical.vertical_slug === 'cannabis' ? 'default' : 'secondary'}>
                              {vertical.vertical_slug}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {Number(vertical.article_count).toLocaleString()} articles
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {batches} batch{batches !== 1 ? 'es' : ''} needed
                            </span>
                            {vertical.vertical_slug === 'cannabis' && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Sitemap Ready
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Main Sitemap (All Verticals)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  General sitemap batches containing articles from all verticals
                </p>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: Math.ceil(totalArticles / BATCH_SIZE) }, (_, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      onClick={() => openSitemap(getMainSitemapUrl(i))}
                    >
                      Batch {i + 1}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
