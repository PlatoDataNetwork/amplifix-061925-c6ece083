import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileJson, Sparkles, Tags, Loader2, Eye, X } from "lucide-react";
import SharedHeader from "@/components/SharedHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface JsonArticle {
  post_id: number;
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  date?: string;
  metadata?: any;
}

interface ProcessedResult {
  formatted?: string;
  tags?: string[];
  error?: string;
}

export default function JsonTester() {
  const { toast } = useToast();
  const [jsonInput, setJsonInput] = useState("");
  const [parsedData, setParsedData] = useState<JsonArticle[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [previewArticle, setPreviewArticle] = useState<JsonArticle | null>(null);
  const [loadingFeed, setLoadingFeed] = useState(false);

  const handleLoadAerospaceFeed = async () => {
    setLoadingFeed(true);
    try {
      const response = await fetch('https://platodata.ai/aerospace/json/');
      if (!response.ok) throw new Error('Failed to fetch aerospace feed');
      
      const data = await response.json();
      setJsonInput(JSON.stringify(data, null, 2));
      
      toast({
        title: "Feed Loaded",
        description: "Aerospace JSON feed loaded successfully. Click 'Parse JSON' to process.",
      });
    } catch (error) {
      toast({
        title: "Load Failed",
        description: error instanceof Error ? error.message : "Failed to load aerospace feed",
        variant: "destructive",
      });
    } finally {
      setLoadingFeed(false);
    }
  };

  const handleParseJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      let articles: JsonArticle[] = [];

      // Normalize article format (handle both id and post_id)
      const normalizeArticle = (article: any): JsonArticle => ({
        post_id: article.post_id || article.id,
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        slug: article.slug,
        date: article.date,
        metadata: article.metadata || {
          author: article.author,
          source: article.source,
          categories: article.categories
        }
      });

      // Handle different JSON structures
      if (Array.isArray(parsed)) {
        articles = parsed.map(normalizeArticle);
      } else if (parsed.articles && Array.isArray(parsed.articles)) {
        articles = parsed.articles.map(normalizeArticle);
      } else if (parsed.id || parsed.post_id) {
        articles = [normalizeArticle(parsed)];
      } else {
        throw new Error("Invalid JSON structure. Expected an array of articles, an object with 'articles' array, or a single article object.");
      }

      // Validate required fields
      const invalidArticles = articles.filter(a => !a.post_id || !a.title || (!a.content && !a.excerpt));
      if (invalidArticles.length > 0) {
        throw new Error(`${invalidArticles.length} article(s) missing required fields (post_id/id, title, and content/excerpt)`);
      }

      setParsedData(articles);
      setSelectedIndex(null);
      setResult(null);
      toast({
        title: "JSON Parsed Successfully",
        description: `Found ${articles.length} article(s)`,
      });
    } catch (error) {
      toast({
        title: "Parse Error",
        description: error instanceof Error ? error.message : "Invalid JSON format",
        variant: "destructive",
      });
      setParsedData([]);
    }
  };

  const handleTestFormat = async (index: number) => {
    setProcessing(true);
    setSelectedIndex(index);
    setResult(null);

    try {
      const article = parsedData[index];
      const { data, error } = await supabase.functions.invoke('test-format-json', {
        body: { 
          content: article.content || article.excerpt || "",
          title: article.title 
        }
      });

      if (error) throw error;

      setResult({ formatted: data.formatted });
      toast({
        title: "Formatting Complete",
        description: "AI formatting test successful",
      });
    } catch (error) {
      console.error('Format test error:', error);
      setResult({ error: error instanceof Error ? error.message : "Formatting failed" });
      toast({
        title: "Formatting Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleTestTags = async (index: number) => {
    setProcessing(true);
    setSelectedIndex(index);
    setResult(null);

    try {
      const article = parsedData[index];
      const { data, error } = await supabase.functions.invoke('test-extract-tags', {
        body: { 
          content: article.content || article.excerpt || "",
          title: article.title 
        }
      });

      if (error) throw error;

      setResult({ tags: data.tags });
      toast({
        title: "Tag Extraction Complete",
        description: `Extracted ${data.tags.length} tags`,
      });
    } catch (error) {
      console.error('Tag extraction error:', error);
      setResult({ error: error instanceof Error ? error.message : "Tag extraction failed" });
      toast({
        title: "Tag Extraction Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <FileJson className="w-10 h-10 text-primary" />
                JSON Formatter & Tag Tester
              </h1>
              <p className="text-muted-foreground text-lg">
                Test AI formatting and tag extraction on JSON data without affecting the database
              </p>
            </div>
            <Button 
              onClick={handleLoadAerospaceFeed}
              disabled={loadingFeed}
              size="lg"
              variant="outline"
              className="shrink-0"
            >
              {loadingFeed ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FileJson className="w-4 h-4 mr-2" />
              )}
              Load Aerospace Feed
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* JSON Input Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Input JSON</h2>
              {jsonInput && (
                <span className="text-sm text-muted-foreground">
                  {(jsonInput.length / 1024).toFixed(1)} KB
                </span>
              )}
            </div>
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='Paste your JSON here. Format: {"articles": [{"post_id": 123, "title": "...", "content": "..."}]} or an array of articles. Or click "Load Aerospace Feed" above.'
              className="min-h-[400px] font-mono text-sm"
            />
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={handleParseJson} 
                className="flex-1"
                disabled={!jsonInput.trim()}
              >
                <FileJson className="w-4 h-4 mr-2" />
                Parse JSON
              </Button>
              {jsonInput && (
                <Button 
                  onClick={() => {
                    setJsonInput("");
                    setParsedData([]);
                    setSelectedIndex(null);
                    setResult(null);
                  }}
                  variant="outline"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </Card>

          {/* Parsed Data Preview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Parsed Articles</h2>
              {parsedData.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      for (let i = 0; i < Math.min(5, parsedData.length); i++) {
                        await handleTestFormat(i);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                      }
                    }}
                    disabled={processing}
                  >
                    Test First 5
                  </Button>
                </div>
              )}
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {parsedData.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <FileJson className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No articles parsed yet</p>
                  <p className="text-sm mt-2">Load the aerospace feed or paste JSON to get started</p>
                </div>
              ) : (
                parsedData.map((article, index) => (
                  <Card 
                    key={index} 
                    className={`p-4 cursor-pointer transition-all ${
                      selectedIndex === index ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Post ID: {article.post_id}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewArticle(article);
                        }}
                        className="flex-1"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestFormat(index);
                        }}
                        disabled={processing}
                        className="flex-1"
                      >
                        {processing && selectedIndex === index ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3 mr-1" />
                        )}
                        Format
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestTags(index);
                        }}
                        disabled={processing}
                        className="flex-1"
                      >
                        {processing && selectedIndex === index ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Tags className="w-3 h-3 mr-1" />
                        )}
                        Extract Tags
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Results Section */}
        {result && selectedIndex !== null && (
          <Card className="p-6 mt-6">
            <h2 className="text-2xl font-bold mb-4">Test Results</h2>
            
            {result.error && (
              <Alert variant="destructive">
                <AlertDescription>{result.error}</AlertDescription>
              </Alert>
            )}

            {result.formatted && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Original Content Preview:</h3>
                  <div className="bg-muted p-4 rounded-lg text-sm max-h-[200px] overflow-y-auto">
                    {parsedData[selectedIndex].content?.substring(0, 500)}...
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Formatted Content:</h3>
                  <div 
                    className="bg-muted p-4 rounded-lg text-sm max-h-[400px] overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: result.formatted }}
                  />
                </div>
              </div>
            )}

            {result.tags && (
              <div>
                <h3 className="font-semibold mb-2">Extracted Tags ({result.tags.length}):</h3>
                <div className="flex flex-wrap gap-2">
                  {result.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Article Preview Dialog */}
        <Dialog open={!!previewArticle} onOpenChange={(open) => !open && setPreviewArticle(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-8">
                  <DialogTitle className="text-2xl font-bold mb-2">
                    {previewArticle?.title}
                  </DialogTitle>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>Post ID: {previewArticle?.post_id}</span>
                    {previewArticle?.date && (
                      <span>Date: {new Date(previewArticle.date).toLocaleDateString()}</span>
                    )}
                    {previewArticle?.metadata?.author && (
                      <span>Author: {previewArticle.metadata.author}</span>
                    )}
                  </div>
                </div>
              </div>
            </DialogHeader>
            
            <ScrollArea className="h-[calc(90vh-120px)] px-6 py-4">
              {previewArticle?.excerpt && (
                <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Excerpt</h3>
                  <p className="text-sm">{previewArticle.excerpt}</p>
                </div>
              )}

              {previewArticle?.content && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <h3 className="font-semibold mb-3">Content</h3>
                  <div 
                    dangerouslySetInnerHTML={{ __html: previewArticle.content }}
                    className="text-sm leading-relaxed"
                  />
                </div>
              )}

              {previewArticle?.metadata && (
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold mb-3 text-sm">Metadata</h3>
                  <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                    {JSON.stringify(previewArticle.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </ScrollArea>

            <div className="px-6 py-4 border-t flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setPreviewArticle(null)}
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
              <Button
                onClick={() => {
                  const index = parsedData.findIndex(a => a.post_id === previewArticle?.post_id);
                  if (index !== -1) {
                    handleTestFormat(index);
                    setPreviewArticle(null);
                  }
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Test Format
              </Button>
              <Button
                onClick={() => {
                  const index = parsedData.findIndex(a => a.post_id === previewArticle?.post_id);
                  if (index !== -1) {
                    handleTestTags(index);
                    setPreviewArticle(null);
                  }
                }}
              >
                <Tags className="w-4 h-4 mr-2" />
                Extract Tags
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
