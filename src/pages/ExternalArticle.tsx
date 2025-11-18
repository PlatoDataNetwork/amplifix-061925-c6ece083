import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { useRSSFeed } from "@/hooks/useRSSFeed";
import { usePlatoDataFeed } from "@/hooks/usePlatoDataFeed";
import { usePlatoVerticals } from "@/hooks/usePlatoVerticals";
import { useLanguage } from "@/hooks/useLanguage";
const sanitizeText = (text?: string | null) => {
  if (!text) return "";
  return text
    .replace(/<a\b[^>]*>/gi, "")
    .replace(/<\/a>/gi, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/Source:?:?\s*/gi, "")
    .replace(/Link:?:?\s*/gi, "")
    .replace(/---/g, "")
    .replace(/\*/g, "")
    .trim();
};

const ExternalArticle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { verticals } = usePlatoVerticals();
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  useLanguage(); // Enable translation

  // Try to load from cache first
  useEffect(() => {
    if (!id) return;
    
    const loadArticle = async () => {
      try {
        const cached = sessionStorage.getItem(`article_${id}`);
        if (cached) {
          const parsedArticle = JSON.parse(cached);
          setArticle(parsedArticle);
          
          // Load tags from database using the article's UUID, not the post_id from URL
          const { supabase } = await import("@/integrations/supabase/client");
          const articleUuid = parsedArticle.id;
          
          const { data: articleTags } = await supabase
            .from('article_tags')
            .select('tags(name)')
            .eq('article_id', articleUuid);
          
          if (articleTags && articleTags.length > 0) {
            const tagNames = articleTags.map((at: any) => at.tags.name);
            setTags(tagNames);
          } else {
            // If no tags exist, trigger tag extraction using UUID
            await supabase.functions.invoke('extract-article-tags', {
              body: { articleId: articleUuid }
            });
            
            // Reload tags after extraction
            const { data: newTags } = await supabase
              .from('article_tags')
              .select('tags(name)')
              .eq('article_id', articleUuid);
            
            if (newTags && newTags.length > 0) {
              const tagNames = newTags.map((at: any) => at.tags.name);
              setTags(tagNames);
            }
          }
          
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.error('Failed to load article:', e);
      }
      
      // If not in cache, we'll show not found
      setIsLoading(false);
    };
    
    loadArticle();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SEOHead title="Loading Article..." />
        <MainHeader />
        <div className="pt-24 container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

if (!article) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead title="Article Not Found" />
      <MainHeader />
      <div className="pt-24 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/intel')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Intelligence
          </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead 
        title={`${sanitizeText(article.title)} - AmplifiX Intelligence`}
        description={sanitizeText(article.excerpt)}
      />
      <MainHeader />

      <article className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="max-w-4xl mx-auto mb-6">
            <Button 
              onClick={() => navigate('/intel')} 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Intelligence
            </Button>
          </div>

          {/* Article Header */}
          <header className="max-w-4xl mx-auto mb-8 border-b border-border pb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded text-xs font-medium uppercase tracking-wide">
                {article.category || 'AI Intelligence'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
              {sanitizeText(article.title)}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time>{article.date}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{article.read_time}</span>
              </div>
            </div>
          </header>

          {/* Article Image */}
          {article.image && article.image !== '/lovable-uploads/naoris-hero-new.png' && (
            <figure className="max-w-4xl mx-auto mb-12">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </figure>
          )}

          {/* Article Content */}
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
              <div 
                className="text-foreground leading-relaxed text-lg"
                style={{ 
                  fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
                  lineHeight: '1.8',
                  fontSize: '1.125rem'
                }}
                dangerouslySetInnerHTML={{ __html: sanitizeText(article.content || article.excerpt) }}
              />
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <footer className="border-t border-border pt-8 mt-12">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                  Related Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string) => (
                    <button
                      key={tag}
                      className="px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary text-sm font-medium text-foreground transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </footer>
            )}
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default ExternalArticle;
