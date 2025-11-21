import { useState } from "react";
import { Button } from "@/components/ui/button";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Download, FileText, Globe, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

const SitemapGenerator = () => {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const [generatedFiles, setGeneratedFiles] = useState<any[]>([]);
  const [sitemapIndexUrl, setSitemapIndexUrl] = useState('');

  const generateAllSitemaps = async () => {
    try {
      setGenerating(true);
      setProgress(0);
      setGeneratedFiles([]);
      setSitemapIndexUrl('');
      
      toast.info('Starting sitemap generation in batches of 1000 articles...');

      const { data, error } = await supabase.functions.invoke('generate-batched-sitemaps');

      if (error) throw error;

      setGeneratedFiles(data.files || []);
      setSitemapIndexUrl(data.sitemapIndexUrl || '');
      setTotalBatches(data.batchCount || 0);
      setProgress(100);

      toast.success(`Generated ${data.batchCount} sitemap files with ${data.totalArticles} articles!`);
    } catch (error) {
      console.error('Error generating sitemaps:', error);
      toast.error('Failed to generate sitemaps');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead 
        title="Sitemap Generator - AmplifiX"
        description="Generate language-specific sitemaps for better SEO"
      />
      <MainHeader />

      <div className="pt-24 container mx-auto py-8 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Sitemap Generator</h1>
            <p className="text-muted-foreground text-lg">
              Generate dynamic sitemaps in English with all articles from the database, batched in files of 1000 URLs for optimal SEO performance.
            </p>
          </div>

          {/* Generate All Button */}
          <div className="mb-8 p-6 bg-card border border-border rounded-lg">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                Generate English Sitemaps (Batched)
              </h2>
              <p className="text-muted-foreground mb-4">
                Generate sitemaps in batches of 1000 articles for optimal performance
              </p>
              <Button 
                onClick={generateAllSitemaps}
                disabled={generating}
                size="lg"
                className="w-full md:w-auto"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Generate All Sitemaps
                  </>
                )}
              </Button>
            </div>

            {generating && (
              <div className="mt-4">
                <Progress value={progress} className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  Processing articles in batches of 1000...
                </p>
              </div>
            )}

            {sitemapIndexUrl && (
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-500 mb-2">Sitemaps Generated Successfully!</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Generated {totalBatches} sitemap files. Submit this URL to Google Search Console:
                    </p>
                    <div className="p-3 bg-background border border-border rounded font-mono text-sm">
                      {sitemapIndexUrl}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Generated Files List */}
          {generatedFiles.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Generated Files</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedFiles.map((file, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-card border border-border rounded-lg flex items-center justify-between hover:border-blue-500/30 transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold">{file.filename}</h3>
                      <p className="text-sm text-muted-foreground">{file.urlCount} URLs</p>
                    </div>
                    <Button 
                      onClick={() => {
                        const blob = new Blob([file.content], { type: 'application/xml' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = file.filename;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                      }}
                      variant="ghost"
                      size="sm"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-6 bg-muted/30 border border-border rounded-lg">
            <h3 className="font-semibold mb-2">How to use generated sitemaps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Click "Generate All Sitemaps" to create batched sitemaps (1000 articles each)</li>
              <li>Download all generated XML files using the download buttons</li>
              <li>Upload the XML files to your server&apos;s root directory</li>
              <li>Submit <code>http://amplifix.net/sitemap_index.xml</code> to Google Search Console</li>
              <li>Regenerate sitemaps whenever you add significant new content</li>
            </ol>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SitemapGenerator;
