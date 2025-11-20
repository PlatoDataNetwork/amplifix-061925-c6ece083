import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useArticleComparison } from "@/hooks/useArticleComparison";
import { useRecentArticles } from "@/hooks/useRecentArticles";
import { ArrowLeft, Search, Maximize2, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const ArticleComparison = () => {
  const navigate = useNavigate();
  const [articleId, setArticleId] = useState("");
  const [searchId, setSearchId] = useState<string | null>(null);
  const [isReformatting, setIsReformatting] = useState(false);
  const { article, backup, isLoading, error } = useArticleComparison(searchId);
  const { articles: recentArticles, isLoading: loadingArticles } = useRecentArticles(20);

  const handleSearch = () => {
    if (articleId.trim()) {
      setSearchId(articleId.trim());
    }
  };

  const handleSelectArticle = (value: string) => {
    setArticleId(value);
    setSearchId(value);
  };

  const handleReformat = async () => {
    if (!searchId) return;
    
    setIsReformatting(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.functions.invoke('reformat-single-article', {
        body: { articleId: searchId }
      });

      if (error) throw error;

      toast.success('Article reformatted successfully! Refreshing...');
      
      // Refresh the page after a brief delay
      setTimeout(() => {
        setSearchId(null);
        setSearchId(searchId);
      }, 1000);
    } catch (error: any) {
      console.error('Error reformatting article:', error);
      toast.error('Failed to reformat article: ' + error.message);
    } finally {
      setIsReformatting(false);
    }
  };

  const renderContent = (content: string | null, isFormatted: boolean) => {
    if (!content) return <p className="text-muted-foreground italic">No content</p>;
    
    return (
      <div 
        className={`prose prose-sm max-w-none ${isFormatted ? 'text-foreground' : 'text-muted-foreground'}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MainHeader />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/articles/format")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Formatter
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Article Comparison Tool</h1>
          <p className="text-muted-foreground">
            Compare original and formatted article content for quality assurance
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Article</CardTitle>
            <CardDescription>Select a recent article or enter an article ID to compare formatting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Recent Article</label>
              <Select onValueChange={handleSelectArticle} value={articleId}>
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Choose from recent articles..." />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {loadingArticles ? (
                    <SelectItem value="loading" disabled>Loading articles...</SelectItem>
                  ) : recentArticles.length > 0 ? (
                    recentArticles.map((article) => (
                      <SelectItem key={article.id} value={article.id}>
                        <div className="flex flex-col py-1">
                          <span className="font-medium">{article.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {article.vertical_slug} • {new Date(article.published_at).toLocaleDateString()}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>No articles found</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 border-t" />
              <span className="text-sm text-muted-foreground">OR</span>
              <div className="flex-1 border-t" />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Enter Article ID</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter article UUID"
                  value={articleId}
                  onChange={(e) => setArticleId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        )}

        {!isLoading && article && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                  <div className="flex gap-2">
                    <Badge variant="secondary">{article.vertical_slug}</Badge>
                    {article.author && <Badge variant="outline">{article.author}</Badge>}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={handleReformat}
                      disabled={isReformatting}
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${isReformatting ? "animate-spin" : ""}`} />
                      {isReformatting ? "Reformatting..." : "Reformat This Article"}
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Maximize2 className="mr-2 h-4 w-4" />
                          Full Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{article.title}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <div className="flex gap-2 mb-4">
                            <Badge variant="secondary">{article.vertical_slug}</Badge>
                            {article.author && <Badge variant="outline">{article.author}</Badge>}
                            <Badge variant="outline">{new Date(article.published_at).toLocaleDateString()}</Badge>
                          </div>
                          <div 
                            className="prose prose-sm lg:prose-base max-w-none text-foreground"
                            dangerouslySetInnerHTML={{ __html: article.content || '' }}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Original Content
                    {backup && (
                      <Badge variant="secondary" className="text-xs">
                        Backup from {new Date(backup.created_at).toLocaleDateString()}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {backup ? "Content before formatting" : "No backup available"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="max-h-[600px] overflow-y-auto">
                  {backup ? renderContent(backup.content, false) : (
                    <p className="text-muted-foreground italic">No backup found for this article</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Formatted Content
                    <Badge variant="default" className="text-xs">Current</Badge>
                  </CardTitle>
                  <CardDescription>Content after formatting</CardDescription>
                </CardHeader>
                <CardContent className="max-h-[600px] overflow-y-auto">
                  {renderContent(article.content, true)}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ArticleComparison;
