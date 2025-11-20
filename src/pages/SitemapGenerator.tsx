import { useState } from "react";
import { Button } from "@/components/ui/button";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Download, FileText, Globe } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const languages = [
  { code: 'en', name: 'English', domain: 'amplifix.net' },
  { code: 'es', name: 'Spanish', domain: 'es.amplifix.net' },
  { code: 'fr', name: 'French', domain: 'fr.amplifix.net' },
  { code: 'de', name: 'German', domain: 'de.amplifix.net' },
  { code: 'it', name: 'Italian', domain: 'it.amplifix.net' },
  { code: 'pt', name: 'Portuguese', domain: 'pt.amplifix.net' },
  { code: 'zh', name: 'Chinese', domain: 'zh.amplifix.net' },
  { code: 'ja', name: 'Japanese', domain: 'ja.amplifix.net' },
  { code: 'ko', name: 'Korean', domain: 'ko.amplifix.net' },
  { code: 'ar', name: 'Arabic', domain: 'ar.amplifix.net' },
  { code: 'ru', name: 'Russian', domain: 'ru.amplifix.net' },
  { code: 'hi', name: 'Hindi', domain: 'hi.amplifix.net' },
  { code: 'nl', name: 'Dutch', domain: 'nl.amplifix.net' },
  { code: 'sv', name: 'Swedish', domain: 'sv.amplifix.net' },
  { code: 'tr', name: 'Turkish', domain: 'tr.amplifix.net' },
];

const SitemapGenerator = () => {
  const [generating, setGenerating] = useState(false);

  const generateSitemap = async (langCode: string) => {
    try {
      setGenerating(true);
      const { data, error } = await supabase.functions.invoke('generate-sitemaps', {
        body: { lang: langCode },
      });

      if (error) throw error;

      // Create blob and download
      const blob = new Blob([data], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sitemap-${langCode}.xml`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Sitemap for ${langCode.toUpperCase()} generated successfully`);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      toast.error('Failed to generate sitemap');
    } finally {
      setGenerating(false);
    }
  };

  const generateSitemapIndex = async () => {
    try {
      setGenerating(true);
      const { data, error } = await supabase.functions.invoke('generate-sitemaps', {
        body: { type: 'index' },
      });

      if (error) throw error;

      const blob = new Blob([data], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap-index.xml';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Sitemap index generated successfully');
    } catch (error) {
      console.error('Error generating sitemap index:', error);
      toast.error('Failed to generate sitemap index');
    } finally {
      setGenerating(false);
    }
  };

  const generateAllSitemaps = async () => {
    setGenerating(true);
    for (const lang of languages) {
      await generateSitemap(lang.code);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    await generateSitemapIndex();
    setGenerating(false);
    toast.success('All sitemaps generated successfully!');
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
              Generate dynamic sitemaps for each language version of your site, including all articles from the database.
            </p>
          </div>

          {/* Generate All Button */}
          <div className="mb-8 p-6 bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  Generate All Sitemaps
                </h2>
                <p className="text-muted-foreground">
                  Generate sitemaps for all {languages.length} supported languages plus the sitemap index
                </p>
              </div>
              <Button 
                onClick={generateAllSitemaps}
                disabled={generating}
                size="lg"
              >
                <Download className="mr-2 h-4 w-4" />
                Generate All
              </Button>
            </div>
          </div>

          {/* Sitemap Index */}
          <div className="mb-8 p-6 bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Sitemap Index
                </h2>
                <p className="text-muted-foreground">
                  Master sitemap that references all language-specific sitemaps
                </p>
              </div>
              <Button 
                onClick={generateSitemapIndex}
                disabled={generating}
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Generate Index
              </Button>
            </div>
          </div>

          {/* Individual Language Sitemaps */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Language-Specific Sitemaps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {languages.map(lang => (
                <div 
                  key={lang.code}
                  className="p-4 bg-card border border-border rounded-lg flex items-center justify-between hover:border-blue-500/30 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold">{lang.name}</h3>
                    <p className="text-sm text-muted-foreground">{lang.domain}</p>
                  </div>
                  <Button 
                    onClick={() => generateSitemap(lang.code)}
                    disabled={generating}
                    variant="ghost"
                    size="sm"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-6 bg-muted/30 border border-border rounded-lg">
            <h3 className="font-semibold mb-2">How to use generated sitemaps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Click "Generate All" to create all sitemaps at once</li>
              <li>Upload the generated XML files to your <code>/public</code> directory</li>
              <li>Submit sitemap-index.xml to Google Search Console</li>
              <li>Sitemaps are automatically updated with latest articles from database</li>
              <li>Regenerate sitemaps whenever you add new content</li>
            </ol>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SitemapGenerator;
