import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock, Share2, Twitter, Linkedin, Facebook, Mail, Link as LinkIcon } from "lucide-react";
import { usePlatoVerticals } from "@/hooks/usePlatoVerticals";
import { useLanguage } from "@/hooks/useLanguage";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { toast } from "sonner";
import { sanitizeText, formatArticleTags, formatExternalArticleContent, ARTICLE_CONTENT_CLASSES } from "@/utils/articleFormatting";
import { getCurrentLanguage } from "@/utils/language";
import { applyClientSideTranslation } from "@/utils/gtranslate";
import { extractIdFromSlug, generateArticleUrl } from "@/utils/slugify";
import defaultArticleImage from "@/assets/default-article-image.jpg";

const ExternalArticle = () => {
  const { id, slugWithId, param } = useParams<{ id?: string; slugWithId?: string; param?: string }>();
  // Extract the actual article ID from either param
  const articleId = id || (slugWithId ? extractIdFromSlug(slugWithId) : undefined) || (param ? extractIdFromSlug(param) : undefined);
  const navigate = useNavigate();
  const location = useLocation();
  const { verticals } = usePlatoVerticals();
  const { isAdmin } = useAdminCheck();
  const [article, setArticle] = useState<any>(null);
  const [translation, setTranslation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  useLanguage(); // Enable translation

  // Determine language prefix from current path (e.g. /uk/intel/...)
  const pathParts = location.pathname.split("/").filter(Boolean);
  const languagePrefix = pathParts[0];
  const isLanguagePath = languagePrefix && languagePrefix.length === 2 && languagePrefix !== "intel";
  const langPrefix = isLanguagePath ? `/${languagePrefix}` : "";
  const currentLang = isLanguagePath ? languagePrefix : 'en';

  // Get display content - use translation if available, otherwise original
  const displayTitle = translation?.translated_title || article?.title;
  const displayExcerpt = translation?.translated_excerpt || article?.excerpt;
  const displayContent = translation?.translated_content || article?.content;

  const shareArticle = (platform: string) => {
    const url = window.location.href;
    const title = displayTitle ? sanitizeText(displayTitle) : '';
    const text = displayExcerpt ? sanitizeText(displayExcerpt) : '';

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

  // Get vertical display name
  const verticalDisplayName = useMemo(() => {
    if (!article?.vertical_slug || !verticals) return '';
    const vertical = verticals.find(v => v.slug === article.vertical_slug);
    return vertical?.name || article.vertical_slug.toUpperCase().replace(/-/g, '/');
  }, [article?.vertical_slug, verticals]);

  // Try to load from cache first
  useEffect(() => {
    if (!articleId) return;
    
    const loadArticle = async () => {
      try {
        // Clear any cached version to get fresh data
        sessionStorage.removeItem(`article_${articleId}`);
        
        const { supabase } = await import("@/integrations/supabase/client");
        
        // Check if ID is a UUID (contains hyphens) or a post_id (numeric)
        const isUUID = articleId.includes('-');
        
        // Load directly from database
        let dbArticle: any;
        if (isUUID) {
          // Fetch by UUID
          const { data } = await supabase
            .from('articles')
            .select('*')
            .eq('id', articleId)
            .maybeSingle();
          dbArticle = data;
        } else {
          // Fetch by post_id
          const { data } = await supabase
            .from('articles')
            .select('*')
            .eq('post_id', parseInt(articleId))
            .maybeSingle();
          dbArticle = data;
        }

        // If we loaded by post_id but this record has no external_url, try to
        // find a duplicate cannabis article (same title & vertical) that DOES
        // have external_url populated and prefer that for display so we can
        // show the true external source instead of Plato.
        if (!isUUID && dbArticle && !dbArticle.external_url) {
          const { data: altArticles } = await supabase
            .from('articles')
            .select('*')
            .eq('vertical_slug', dbArticle.vertical_slug)
            .eq('title', dbArticle.title)
            .not('external_url', 'is', null)
            .limit(1);

          if (altArticles && altArticles.length > 0) {
            const alt = altArticles[0];
            dbArticle = { ...alt, post_id: dbArticle.post_id ?? alt.post_id };
          }
        }

        if (!dbArticle) {
          console.warn(`No matching article found in database for ${isUUID ? 'id' : 'post_id'}:`, id);
          setIsLoading(false);
          return;
        }

        // Use the fresh data from database (possibly swapped to the alt record)
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
            body: { articleId: dbArticle.post_id ?? articleId }
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
  }, [articleId]);

  // Fetch server-side translation if available
  useEffect(() => {
    if (!article?.id || currentLang === 'en') {
      setTranslation(null);
      return;
    }

    const fetchTranslation = async () => {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data } = await supabase
          .from('article_translations')
          .select('*')
          .eq('article_id', article.id)
          .eq('language_code', currentLang)
          .maybeSingle();
        
        if (data) {
          console.log(`Found server-side translation for ${currentLang}`);
          setTranslation(data);
        } else {
          setTranslation(null);
        }
      } catch (e) {
        console.error('Failed to fetch translation:', e);
        setTranslation(null);
      }
    };

    fetchTranslation();
  }, [article?.id, currentLang]);

  // Fall back to GTranslate only if no server-side translation exists
  useEffect(() => {
    if (isLoading || !article) return;
    // Skip GTranslate if we have a server-side translation
    if (translation) return;

    const lang = getCurrentLanguage();
    if (!lang || lang === "en") return;

    // Let the centralized helper handle cookie + apply + UI scrub.
    void applyClientSideTranslation(lang);
  }, [isLoading, article?.id, article?.content, translation]);

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
          <h1 className="text-3xl font-bold mb-4 translate">Article Not Found</h1>
          <p className="text-muted-foreground mb-6 translate">The article you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(`${langPrefix}/intel`)} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="translate">Back to Intelligence</span>
          </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Generate canonical URL with slug format
  const canonicalUrl = article?.title && article?.post_id 
    ? `https://amplifix.net${generateArticleUrl(article.title, article.post_id)}`
    : undefined;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead 
        title={`${sanitizeText(displayTitle || '')} - AmplifiX Intelligence`}
        description={sanitizeText(displayExcerpt || '')}
        canonicalUrl={canonicalUrl}
      />
      <MainHeader />

      <article className="pt-24 container mx-auto py-8 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => navigate(`${langPrefix}/intel/${article.vertical_slug || ''}`)}
                className="px-4 py-2 bg-card border border-border text-sm text-muted-foreground hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="translate">Back to Intelligence</span>
              </button>
              {verticalDisplayName && (
                <Link
                  to={`${langPrefix}/intel/${article.vertical_slug}`}
                  className="px-4 py-2 bg-card border border-border text-sm text-muted-foreground hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors"
                >
                  {verticalDisplayName}
                </Link>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-6 pb-4 border-b border-border translate">
              {sanitizeText(displayTitle || '')}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 text-muted-foreground text-sm mb-2">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="translate">
                    {article.author === 'PlatoData' || article.author === 'Plato Data' ? 'Plato Data Intelligence' : article.author}
                  </span>
                </div>
                <div className="flex items-center gap-2 notranslate">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(article.published_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
                  {(article.post_id || article.id) && (
                    <span className="text-muted-foreground/60">| ID: {article.post_id || article.id}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="notranslate">3</span> <span className="translate">Min Read</span>
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
              
            </div>
          </div>

          {/* Article Image - Always show default if no image */}
          <div className="mb-4">
            <img 
              src={article.image && article.image !== '/lovable-uploads/naoris-hero-new.png' ? article.image : defaultArticleImage} 
              alt={sanitizeText(displayTitle || '')}
              className="w-full rounded-xl border border-border"
              onError={(e) => {
                e.currentTarget.src = defaultArticleImage;
              }}
            />
          </div>

           {/* Article Content - Prose Typography */}
          <div 
            className={`${ARTICLE_CONTENT_CLASSES} mb-8 prose-article translate
              [&_h1]:mt-10 [&_h1]:mb-5 [&_h1]:text-3xl [&_h1]:md:text-4xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:text-foreground [&_h1]:tracking-tight
              [&_h2]:mt-10 [&_h2]:mb-5 [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-foreground [&_h2]:tracking-tight [&_h2]:border-b [&_h2]:border-border/50 [&_h2]:pb-3
              [&_h3]:mt-8 [&_h3]:mb-4 [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-semibold [&_h3]:leading-snug [&_h3]:text-foreground
              [&_h4]:mt-6 [&_h4]:mb-3 [&_h4]:text-lg [&_h4]:md:text-xl [&_h4]:font-semibold [&_h4]:text-foreground
              [&_h5]:mt-5 [&_h5]:mb-2 [&_h5]:text-base [&_h5]:md:text-lg [&_h5]:font-medium [&_h5]:text-foreground
              [&_h6]:mt-4 [&_h6]:mb-2 [&_h6]:text-base [&_h6]:font-medium [&_h6]:text-foreground/80 [&_h6]:uppercase [&_h6]:tracking-wide
              [&_p]:mb-5 [&_p]:leading-[1.8] [&_p]:text-foreground/85 [&_p]:text-base [&_p]:md:text-lg
              [&_strong]:font-semibold [&_strong]:text-foreground [&_b]:font-semibold [&_b]:text-foreground
              [&_em]:italic [&_i]:italic
              [&_u]:underline [&_u]:underline-offset-2
              [&_a]:text-highlight-blue [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-highlight-blue/40 [&_a]:hover:decoration-highlight-blue [&_a]:transition-all [&_a]:duration-200
              [&_ul]:my-6 [&_ul]:pl-6 [&_ul]:list-disc [&_ul]:space-y-3 [&_ul]:marker:text-highlight-blue
              [&_ol]:my-6 [&_ol]:pl-6 [&_ol]:list-decimal [&_ol]:space-y-3 [&_ol]:marker:text-highlight-blue [&_ol]:marker:font-semibold
              [&_li]:leading-[1.7] [&_li]:text-foreground/85 [&_li]:pl-2
              [&_blockquote]:my-8 [&_blockquote]:pl-6 [&_blockquote]:py-4 [&_blockquote]:border-l-4 [&_blockquote]:border-highlight-blue [&_blockquote]:bg-highlight-blue/5 [&_blockquote]:rounded-r-lg [&_blockquote]:italic [&_blockquote]:text-foreground/80 [&_blockquote_p]:mb-0 [&_blockquote_p]:text-lg
              [&_pre]:my-6 [&_pre]:p-5 [&_pre]:bg-muted [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-border
              [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:bg-muted [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:text-foreground/90
              [&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:rounded-lg [&_table]:overflow-hidden [&_table]:border [&_table]:border-border
              [&_th]:border [&_th]:border-border [&_th]:p-4 [&_th]:bg-muted [&_th]:font-semibold [&_th]:text-left [&_th]:text-foreground
              [&_td]:border [&_td]:border-border [&_td]:p-4 [&_td]:text-foreground/85
              [&_tr:hover]:bg-muted/30
              [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:my-6 [&_img]:shadow-md
              [&_hr]:my-10 [&_hr]:border-border/50
              [&_figure]:my-8
              [&_figcaption]:text-sm [&_figcaption]:text-muted-foreground [&_figcaption]:mt-3 [&_figcaption]:text-center [&_figcaption]:italic
              [&_mark]:bg-highlight-blue/20 [&_mark]:px-1 [&_mark]:rounded
              [&_sup]:text-xs [&_sub]:text-xs
              [&_abbr]:underline [&_abbr]:decoration-dotted [&_abbr]:underline-offset-2 [&_abbr]:cursor-help
            `}
            dangerouslySetInnerHTML={{
              __html: (() => {
                // Use translated content if available
                const rawContent = displayContent || displayExcerpt || "";
                
                // Remove Plato source links before processing
                const contentWithoutSourceLinks = rawContent
                  .replace(/<ul class="plato-post-bottom-links">[\s\S]*?<\/ul>/gi, '')
                  .replace(/<div class="plato-post-bottom-links">[\s\S]*?<\/div>/gi, '')
                  .replace(/Source Link:[\s\S]*?<\/a>/gi, '');

                // Remove existing Published footer paragraph to avoid duplication
                const contentWithoutPublished = contentWithoutSourceLinks.replace(
                  /<p class="text-sm text-muted-foreground mt-6 pt-4 border-t border-border">[\s\S]*?Published:[\s\S]*?<\/p>/gi,
                  ''
                );
                
                // Check if content has HTML tags
                return /<\/?[a-z][\s\S]*>/i.test(contentWithoutPublished)
                  ? contentWithoutPublished
                  : formatExternalArticleContent(contentWithoutPublished);
              })(),
            }}
          />

          {/* Published + Source */}
          <div className="mb-6 pb-6 border-b border-border">
            <p className="text-sm text-muted-foreground">
              {(() => {
                const isAviationOrAerospace =
                  article.vertical_slug === 'aerospace' || article.vertical_slug === 'aviation';
                const publishedAt = article.published_at ? new Date(article.published_at) : null;
                const formattedDate = publishedAt
                  ? publishedAt.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : null;

                // Check for source URL - try multiple fields
                let sourceUrl = null;
                
                // Try external_url first (should be the actual source)
                if (article.external_url) {
                  sourceUrl = article.external_url;
                }
                
                // Try metadata fields
                if (!sourceUrl && article.metadata) {
                  sourceUrl = article.metadata.source || 
                             article.metadata.sourceLink || 
                             article.metadata.sourceURL ||
                             article.metadata.original_url;
                  
                  // Handle arrays
                  if (Array.isArray(sourceUrl)) {
                    sourceUrl = sourceUrl[0];
                  }
                }
                
                // Check if it's a Plato link (should not be used as external source)
                const isPlatoLink = sourceUrl && (
                  sourceUrl.includes('platodata.ai') ||
                  sourceUrl.includes('platodata.io') ||
                  sourceUrl.includes('osint.platodata.io')
                );
                
                // Display logic based on source availability
                const sourceNode = sourceUrl && !isPlatoLink ? (
                  // Has external source - show as link with hostname
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-400 transition-colors underline"
                  >
                    {(() => {
                      try {
                        return new URL(sourceUrl).hostname.replace('www.', '');
                      } catch {
                        return sourceUrl;
                      }
                    })()}
                  </a>
                ) : (
                  // Original Plato content - show as Plato Data Intelligence
                  <a
                    href="https://platodata.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-400 transition-colors font-medium"
                  >
                    Plato Data Intelligence
                  </a>
                );

                return (
                  <>
                    {formattedDate && <>Published: {formattedDate} | </>}
                    <span className="translate">Source:</span>{' '}
                    {sourceNode}
                  </>
                );
              })()}
            </p>
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

          {/* Related Topics */}
          {(tags.length > 0 || article.vertical_slug) && (
            <div className="pt-4">
              <h3 className="text-sm font-semibold mb-3 translate">Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                {formatArticleTags(tags, article.vertical_slug, verticalDisplayName).map((tagData) => (
                  <span 
                    key={tagData.key}
                    className="px-4 py-2 bg-card border border-border text-sm text-muted-foreground hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors cursor-pointer translate"
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
