import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileJson, Sparkles, Tags, Loader2 } from "lucide-react";
import SharedHeader from "@/components/SharedHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  const handleParseJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      let articles: JsonArticle[] = [];

      // Handle different JSON structures
      if (Array.isArray(parsed)) {
        articles = parsed;
      } else if (parsed.articles && Array.isArray(parsed.articles)) {
        articles = parsed.articles;
      } else if (parsed.post_id) {
        articles = [parsed];
      } else {
        throw new Error("Invalid JSON structure. Expected an array of articles or an object with 'articles' array.");
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
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <FileJson className="w-10 h-10 text-primary" />
            JSON Formatter & Tag Tester
          </h1>
          <p className="text-muted-foreground text-lg">
            Test AI formatting and tag extraction on JSON data without affecting the database
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* JSON Input Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Input JSON</h2>
            <Textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='Paste your JSON here. Format: {"articles": [{"post_id": 123, "title": "...", "content": "..."}]} or an array of articles'
              className="min-h-[400px] font-mono text-sm"
            />
            <Button 
              onClick={handleParseJson} 
              className="w-full mt-4"
              disabled={!jsonInput.trim()}
            >
              <FileJson className="w-4 h-4 mr-2" />
              Parse JSON
            </Button>
          </Card>

          {/* Parsed Data Preview */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Parsed Articles</h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {parsedData.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <FileJson className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No articles parsed yet</p>
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
      </div>
    </div>
  );
}
