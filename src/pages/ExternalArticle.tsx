import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock, Share2, Twitter, Linkedin, Facebook, Mail, Link as LinkIcon } from "lucide-react";
import { useRSSFeed } from "@/hooks/useRSSFeed";
import { usePlatoDataFeed } from "@/hooks/usePlatoDataFeed";
import { usePlatoVerticals } from "@/hooks/usePlatoVerticals";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
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
    // Normalize newlines and remove extra blank space/indentation
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^[ \t]+/gm, "")
    .trim();
};

const formatArticleContent = (text?: string | null) => {
  if (!text) return "";
  let cleaned = text
    .replace(/<a\b[^>]*>/gi, "")
    .replace(/<\/a>/gi, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/Source:?:?\s*/gi, "")
    .replace(/Link:?:?\s*/gi, "")
    .replace(/---/g, "")
    .replace(/\r\n/g, "\n");

  // Convert markdown-style headings (**Heading**) on their own line to <h2>
  cleaned = cleaned.replace(/^\s*\*\*(.+?)\*\*\s*$/gm, "<h2>$1<\/h2>");

  // Convert remaining bold markers to <strong>
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, "<strong>$1<\/strong>");
  
  // Make question headers bold (lines ending with ?)
  cleaned = cleaned.replace(/^\s*([A-Z][^?\n]+\?)\s*$/gm, "<h2>$1</h2>");
  
  // Make title-case section headers bold (lines with multiple capital letters, likely headers)
  cleaned = cleaned.replace(/^\s*([A-Z][A-Za-z\s]+(?:Prototypes|Features|Questions|Air|Dream)[A-Za-z\s]*)\s*$/gm, (match) => {
    // Don't double-wrap if already wrapped
    if (match.includes('<h2>') || match.includes('<strong>')) return match;
    // Check if it has multiple capital letters (likely a title)
    const capitalCount = (match.match(/[A-Z]/g) || []).length;
    if (capitalCount >= 3) {
      return `<h2>${match.trim()}</h2>`;
    }
    return match;
  });
  
  // Make numbered list headers bold ONLY (e.g., "1. Lightweight Design")
  cleaned = cleaned.replace(/^(\d+\.\s+[A-Z][A-Za-z\s]+)\s*$/gm, "<strong>$1</strong>");

  // Normalize multiple blank lines
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  // Remove leading indentation
  cleaned = cleaned.replace(/^[ \t]+/gm, "").trim();

  const paragraphs = cleaned
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return paragraphs
    .map((p) => {
      if (/^<h[1-6]\b|^<ul\b|^<ol\b|^<li\b|^<p\b|^<hr\b/i.test(p)) {
        return p;
      }
      return `<p>${p}<\/p>`;
    })
    .join("\n");
};

const ExternalArticle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { verticals } = usePlatoVerticals();
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  useLanguage(); // Enable translation

  const shareArticle = (platform: string) => {
    const url = window.location.href;
    const title = article?.title ? sanitizeText(article.title) : '';
    const text = article?.excerpt ? sanitizeText(article.excerpt) : '';

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          toast.success('Link copied to clipboard!');
        });
        break;
    }
  };

  // Try to load from cache first
  useEffect(() => {
    if (!id) return;
    
    const loadArticle = async () => {
      try {
        // Clear any cached version to get fresh data
        sessionStorage.removeItem(`article_${id}`);
        
        const { supabase } = await import("@/integrations/supabase/client");
        
        // Load directly from database
        const { data: dbArticle } = await supabase
          .from('articles')
          .select('*')
          .eq('post_id', parseInt(id))
          .maybeSingle();

        if (!dbArticle) {
          console.warn("No matching article found in database for post_id", id);
          setIsLoading(false);
          return;
        }

        // Use the fresh data from database
        setArticle(dbArticle);
        const articleUuid = dbArticle.id;
        
        const { data: articleTags } = await supabase
          .from('article_tags')
          .select('tags(name)')
          .eq('article_id', articleUuid);
        
        if (articleTags && articleTags.length > 0) {
          const tagNames = articleTags.map((at: any) => at.tags.name);
          setTags(tagNames);
        } else {
          // If no tags exist, trigger tag extraction using the article's database ID
          await supabase.functions.invoke('extract-article-tags', {
            body: { articleId: dbArticle.post_id ?? id }
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
      } catch (e) {
        console.error('Failed to load article:', e);
        setIsLoading(false);
      }
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

      <article className="pt-24 container mx-auto py-8 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-transparent border border-blue-500 text-blue-500 px-3 py-1 text-sm">
                AR/VR
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-6 pb-4 border-b border-border">
              {sanitizeText(article.title)}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 text-muted-foreground text-sm mb-2">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>3 Min Read</span>
                </div>
                
                {/* Share Section Inline */}
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  <button
                    onClick={() => shareArticle('twitter')}
                    className="p-2 rounded-lg bg-card border border-border hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => shareArticle('linkedin')}
                    className="p-2 rounded-lg bg-card border border-border hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => shareArticle('facebook')}
                    className="p-2 rounded-lg bg-card border border-border hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => shareArticle('email')}
                    className="p-2 rounded-lg bg-card border border-border hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-colors"
                    aria-label="Share via Email"
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => shareArticle('copy')}
                    className="p-2 rounded-lg bg-card border border-border hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-colors"
                    aria-label="Copy Link"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Back Button - Right Aligned */}
              <Button 
                onClick={() => navigate('/intel')} 
                variant="ghost" 
                className="ml-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Intelligence
              </Button>
            </div>
          </div>

          {/* Article Image */}
          {article.image && article.image !== '/lovable-uploads/naoris-hero-new.png' && (
            <div className="mb-4">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full rounded-xl border border-border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-invert max-w-none mb-2">
            <div 
              className="text-foreground leading-relaxed whitespace-pre-wrap [&>*]:mb-2 [&>h2]:mt-6 [&>h2]:mb-2 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:leading-tight [&>h3]:mt-4 [&>h3]:text-xl [&>h3]:font-bold"
              dangerouslySetInnerHTML={{ __html: formatArticleContent(article.content || article.excerpt) }}
            />
          </div>

          {/* AmplifiX Branding */}
          <div className="mb-6 text-center pt-2">
            <p className="text-2xl font-bold text-foreground">
              AmplifiX is Powered by{' '}
              <a 
                href="https://platodata.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 transition-colors"
              >
                Plato Data Intelligence<span className="text-blue-500">.</span>
              </a>
            </p>
          </div>

          {/* Tags */}
          {(tags.length > 0 || article.vertical_slug) && (
            <div className="pt-4">
              <h3 className="text-sm font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  // Create a Set to track unique single words (case-insensitive)
                  const uniqueTags = new Set<string>();
                  const allTags = [...tags];
                  
                  // Add vertical as first tag if it exists - display as AR-VR
                  if (article.vertical_slug) {
                    allTags.unshift('AR-VR');
                  }
                  
                  return allTags
                    .map((tag: string, index: number) => {
                      const singleWord = tag.split(/[\s-]+/)[0];
                      const lowerWord = singleWord.toLowerCase();
                      
                      // For the first tag (vertical), skip uniqueness check
                      if (index === 0 && article.vertical_slug) {
                        return (
                          <span 
                            key="vertical-tag"
                            className="px-4 py-2 bg-card border border-border text-sm text-muted-foreground hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors cursor-pointer"
                          >
                            #AR-VR
                          </span>
                        );
                      }
                      
                      // Skip if we've already seen this word
                      if (uniqueTags.has(lowerWord)) {
                        return null;
                      }
                      
                      uniqueTags.add(lowerWord);
                      
                      return (
                        <span 
                          key={tag}
                          className="px-4 py-2 bg-card border border-border text-sm text-muted-foreground hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors cursor-pointer"
                        >
                          #{singleWord}
                        </span>
                      );
                    })
                    .filter(Boolean);
                })()}
              </div>
            </div>
          )}

        </div>
      </article>

      <Footer />
    </div>
  );
};

export default ExternalArticle;
