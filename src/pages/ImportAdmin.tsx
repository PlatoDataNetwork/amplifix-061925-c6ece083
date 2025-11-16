import { useState } from "react";
import { Button } from "@/components/ui/button";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ImportAdmin = () => {
  const [importing, setImporting] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, any>>({});

  const importVertical = async (vertical: string, verticalSlug: string) => {
    setImporting(vertical);
    
    try {
      const { data, error } = await supabase.functions.invoke('import-articles', {
        body: { vertical: verticalSlug }
      });

      if (error) throw error;

      setResults(prev => ({ ...prev, [vertical]: data }));
      toast.success(`${vertical} import completed!`, {
        description: `Imported ${data.insertedArticles} articles`
      });
    } catch (error) {
      console.error(`Error importing ${vertical}:`, error);
      toast.error(`Failed to import ${vertical}`, {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setImporting(null);
    }
  };

  const importACN = async () => {
    setImporting('ACN');
    
    try {
      const { data, error } = await supabase.functions.invoke('import-acn');

      if (error) throw error;

      setResults(prev => ({ ...prev, ACN: data }));
      toast.success('ACN import completed!', {
        description: `Imported ${data.insertedArticles} articles`
      });
    } catch (error) {
      console.error('Error importing ACN:', error);
      toast.error('Failed to import ACN', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setImporting(null);
    }
  };

  const verticals = [
    { name: 'AI Intelligence', slug: 'artificial-intelligence' },
    { name: 'Blockchain', slug: 'blockchain' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />
      
      <div className="pt-24 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Article Import Admin</h1>
          
          <div className="grid gap-4 mb-8">
            {verticals.map((vertical) => (
              <div key={vertical.slug} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold">{vertical.name}</h2>
                    <p className="text-muted-foreground">Import from PlatoData API</p>
                  </div>
                  <Button
                    onClick={() => importVertical(vertical.name, vertical.slug)}
                    disabled={importing !== null}
                    size="lg"
                  >
                    {importing === vertical.name ? 'Importing...' : 'Import All'}
                  </Button>
                </div>
                
                {results[vertical.name] && (
                  <div className="mt-4 p-4 bg-muted rounded">
                    <p className="text-sm">
                      ✅ Imported: {results[vertical.name].insertedArticles} articles
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Duration: {(results[vertical.name].duration / 1000).toFixed(1)}s
                    </p>
                  </div>
                )}
              </div>
            ))}
            
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold">ACN Newswire</h2>
                  <p className="text-muted-foreground">Import from RSS Feed</p>
                </div>
                <Button
                  onClick={importACN}
                  disabled={importing !== null}
                  size="lg"
                >
                  {importing === 'ACN' ? 'Importing...' : 'Import All'}
                </Button>
              </div>
              
              {results.ACN && (
                <div className="mt-4 p-4 bg-muted rounded">
                  <p className="text-sm">
                    ✅ Imported: {results.ACN.insertedArticles} articles
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Duration: {(results.ACN.duration / 1000).toFixed(1)}s
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Note:</h3>
            <p className="text-sm text-muted-foreground">
              Imports may take several minutes for large datasets. The function will process
              articles in batches and store them in the database. Once imported, articles will
              load instantly from the database instead of external APIs.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ImportAdmin;