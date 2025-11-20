import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock, Share2, Twitter, Linkedin, Facebook, Mail, Link as LinkIcon, Edit } from "lucide-react";
import { usePlatoVerticals } from "@/hooks/usePlatoVerticals";
import { useLanguage } from "@/hooks/useLanguage";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { toast } from "sonner";
import { sanitizeText, formatArticleTags } from "@/utils/articleFormatting";

const formatExternalArticleContent = (text?: string | null): string => {
  if (!text) return "";

  const cleaned = sanitizeText(text);
  const lines = cleaned.split("\n");
  const htmlParts: string[] = [];
  let inUnorderedList = false;
  let inOrderedList = false;

  const closeLists = () => {
    if (inUnorderedList) {
      htmlParts.push("</ul>");
      inUnorderedList = false;
    }
    if (inOrderedList) {
      htmlParts.push("</ol>");
      inOrderedList = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      // Blank line: end any open lists but don't create empty paragraphs
      closeLists();
      continue;
    }

    const bulletMatch = line.match(/^[-•]\s+(.*)/);
    const orderedMatch = line.match(/^(\d+)\.\s+(.*)/);

    if (bulletMatch) {
      if (!inUnorderedList) {
        closeLists();
        htmlParts.push("<ul>");
        inUnorderedList = true;
      }
      htmlParts.push(`<li>${bulletMatch[1].trim()}</li>`);
      continue;
    }

    if (orderedMatch) {
      if (!inOrderedList) {
        closeLists();
        htmlParts.push("<ol>");
        inOrderedList = true;
      }
      htmlParts.push(`<li>${orderedMatch[2].trim()}</li>`);
      continue;
    }

    // Regular line: close any lists and start a new paragraph
    closeLists();
    htmlParts.push(`<p>${line}</p>`);
  }

  closeLists();

  return htmlParts.join("\n");
};

const ExternalArticle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { verticals } = usePlatoVerticals();
  const { isAdmin } = useAdminCheck();
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
            <div className="flex items-center gap-2 mb-6">
              <span className="px-4 py-2 bg-card border border-border text-sm text-muted-foreground hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors cursor-pointer">
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
              <div className="flex items-center gap-2 ml-auto">
                {isAdmin && article?.id && (
                  <Button 
                    onClick={() => navigate(`/admin/articles/edit/${article.id}`)} 
                    variant="outline"
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Article
                  </Button>
                )}
                <Button 
                  onClick={() => navigate(`/intel/${article.vertical_slug || ''}`)} 
                  variant="ghost" 
                  className="text-blue-500 hover:text-blue-400"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Intelligence
                </Button>
              </div>
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
               className="text-foreground leading-relaxed whitespace-pre-wrap [&>p]:mb-1 [&>p]:leading-relaxed [&>h2]:mt-4 [&>h2]:mb-2 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:leading-tight [&>h3]:mt-3 [&>h3]:mb-2 [&>h3]:text-xl [&>h3]:font-bold [&>strong]:mt-3 [&>strong]:mb-2 [&>strong]:block [&>ul]:my-4 [&>ul]:space-y-2 [&>ol]:my-4 [&>ol]:space-y-2"
               dangerouslySetInnerHTML={{
                 __html:
                   article.content && /<\/?[a-z][\s\S]*>/i.test(article.content)
                     ? article.content
                     : formatExternalArticleContent(article.content || article.excerpt || ""),
               }}
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
                {formatArticleTags(tags, article.vertical_slug, 'AR-VR').map((tagData) => (
                  <span 
                    key={tagData.key}
                    className="px-4 py-2 bg-card border border-border text-sm text-muted-foreground hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors cursor-pointer"
                  >
                    {tagData.label}
                  </span>
                ))}
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
