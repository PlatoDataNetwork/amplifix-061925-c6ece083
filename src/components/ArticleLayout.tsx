import { ReactNode, useEffect, useState } from "react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { User, Calendar, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { useJsonData } from "@/hooks/useJsonData";
import { useNavigate } from "react-router-dom";
import { formatExternalArticleContent, ARTICLE_CONTENT_CLASSES } from "@/utils/articleFormatting";

interface ArticleLayoutProps {
  title: string | ReactNode;
  description: string;
  category: string;
  author: string;
  date: string;
  readTime?: string;
  children: ReactNode;
}

const ArticleLayout = ({
  title,
  description,
  category,
  author,
  date,
  readTime = "5 min read",
  children,
}: ArticleLayoutProps) => {
  const { data: blogData } = useJsonData<any>('blog.json');
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  const handleTagClick = (tag: string) => {
    const userLang = document.documentElement.getAttribute("data-user-lang") || "en";
    const prefix = userLang && userLang !== "en" ? `/${userLang}` : "";
    navigate(`${prefix}/intel?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
        <div 
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <MainHeader />
      
      <main className="container mx-auto px-4 py-4 max-w-3xl">
        {/* Back Navigation */}
        <LanguageAwareLink to="/intel">
          <Button variant="ghost" size="sm" className="mb-4 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="translate">Back to Intel</span>
          </Button>
        </LanguageAwareLink>
        
        {/* Article Header */}
        <header className="mb-4">
          {/* Category Badge */}
          <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3 translate">
            {category}
          </span>
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight translate">
            {title}
          </h1>
          
          {/* Description */}
          {description && (
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed translate">
              {description}
            </p>
          )}
          
          {/* Enhanced Metadata */}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium translate">{author}</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <time className="translate">{date}</time>
            </div>
            
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="translate">{readTime}</span>
            </div>
          </div>
        </header>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4" />
        
        {/* Article Content */}
        <article className={`prose prose-base md:prose-lg max-w-none dark:prose-invert translate ${ARTICLE_CONTENT_CLASSES.replace('text-foreground leading-relaxed whitespace-pre-wrap', '')}`}>
          {children}
        </article>
        
        {/* Popular Tags Section */}
        {blogData?.blog?.popular_tags && (
          <>
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-6" />
            <div className="mb-6">
              <h3 className="text-base font-semibold mb-3">
                {blogData.blog.popular_tags.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {blogData.blog.popular_tags.tags.map((tag: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleTagClick(tag)}
                    className="px-3 py-1.5 bg-muted/50 hover:bg-muted text-sm rounded-md transition-colors border border-border/50"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        
        {/* Bottom Navigation */}
        <div className="pt-4 border-t border-border/50">
          <LanguageAwareLink to="/intel">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="translate">Back to All Articles</span>
            </Button>
          </LanguageAwareLink>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleLayout;
