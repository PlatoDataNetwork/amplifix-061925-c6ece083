
import { Button } from "@/components/ui/button";
import { User, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import defaultArticleImage from "@/assets/default-article-image.jpg";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  image_url?: string;
}

interface BlogPostCardProps {
  post: BlogPost;
  articleLink?: string;
  buttonText?: string;
}

const decodeHtmlEntities = (text: string): string => {
  return text
    // Decode numeric entities (&#8220;, &#8221;, &#8217;, etc.)
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
    // Decode common named entities
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&rdquo;/g, "\u201D")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&ndash;/g, "\u2013");
};

const sanitizeText = (text?: string | null) => {
  if (!text) return "";
  return decodeHtmlEntities(
    text
      .replace(/<a\b[^>]*>/gi, "")
      .replace(/<\/a>/gi, "")
      .replace(/https?:\/\/\S+/gi, "")
      .replace(/\[.*?\]\(.*?\)/g, "")
      .replace(/Source:?:?\s*/gi, "")
      .replace(/Link:?:?\s*/gi, "")
      .replace(/---/g, "")
      .replace(/\*/g, "")
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/^[ \t]+/gm, "")
      .trim()
  );
};

const capitalizeVertical = (text: string) => {
  // Special cases that should be fully uppercase
  const uppercaseWords = ['ar', 'vr', 'ai', 'ipo', 'api', 'ceo', 'cto'];
  
  return text
    .split('-')
    .map(word => {
      const lower = word.toLowerCase();
      return uppercaseWords.includes(lower) 
        ? lower.toUpperCase() 
        : word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' / ');
};

const cacheArticle = (post: BlogPost) => {
  try {
    sessionStorage.setItem(`article_${post.id}`, JSON.stringify(post));
  } catch (e) {
    console.error('Failed to cache article:', e);
  }
};

const BlogPostCard = ({ post, articleLink, buttonText = "Read Full Article" }: BlogPostCardProps) => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  const languagePrefix = pathParts[0];
  const isLanguagePath = languagePrefix && languagePrefix.length === 2 && languagePrefix !== "intel";
  const langPrefix = isLanguagePath ? `/${languagePrefix}` : "";

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Security": return <Shield className="h-16 w-16 text-blue-500" />;
      case "AI": return <Zap className="h-16 w-16 text-blue-500" />;
      case "Analytics": return <Globe className="h-16 w-16 text-blue-500" />;
      default: return <Globe className="h-16 w-16 text-blue-500" />;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!articleLink) {
      e.preventDefault();
    } else {
      cacheArticle(post);
    }
  };

  const thumbnailSrc = post.image_url || post.image || defaultArticleImage;

  return (
    <article className="bg-card rounded-xl border border-border overflow-hidden hover:border-blue-500/30 transition-colors">
      {/* Thumbnail Image */}
      <div className="aspect-video overflow-hidden">
        <img 
          src={thumbnailSrc}
          alt={sanitizeText(post.title)}
          className="w-full h-full object-cover transition-transform hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = defaultArticleImage;
          }}
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Link 
            to={`${langPrefix}/intel/${post.category.toLowerCase().replace(/\//g, '-')}`}
            className="bg-blue-500/20 text-blue-500 px-2 py-1 rounded text-sm translate hover:bg-blue-500 hover:text-white transition-colors"
          >
            {capitalizeVertical(post.category)}
          </Link>
          <span className="text-muted-foreground text-sm notranslate">{post.readTime}</span>
        </div>
        <h3 className="text-xl font-bold mb-3 line-clamp-2 translate">{sanitizeText(post.title)}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-3 translate">{sanitizeText(post.excerpt)}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground text-sm translate">{post.author}</span>
          </div>
          <span className="text-muted-foreground text-sm notranslate">{post.date}</span>
        </div>
        {articleLink ? (
          articleLink.startsWith('http') ? (
            <Button variant="link" className="text-blue-500 mt-4 p-0" asChild>
              <a href={articleLink} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
                {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          ) : (
            <Button variant="link" className="text-blue-500 mt-4 p-0" asChild>
              <Link to={articleLink} onClick={handleClick}>
                {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )
        ) : (
          <Button variant="link" className="text-blue-500 mt-4 p-0" onClick={handleClick}>
            {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </article>
  );
};

export default BlogPostCard;
