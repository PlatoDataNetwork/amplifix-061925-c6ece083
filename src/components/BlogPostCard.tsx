
import { Button } from "@/components/ui/button";
import { User, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

interface BlogPostCardProps {
  post: BlogPost;
  articleLink?: string;
  buttonText?: string;
}

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

const cacheArticle = (post: BlogPost) => {
  try {
    sessionStorage.setItem(`article_${post.id}`, JSON.stringify(post));
  } catch (e) {
    console.error('Failed to cache article:', e);
  }
};

const BlogPostCard = ({ post, articleLink, buttonText = "Read Full Article" }: BlogPostCardProps) => {
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

  return (
    <article className="bg-card rounded-xl border border-border overflow-hidden hover:border-blue-500/30 transition-colors">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-blue-500/20 text-blue-500 px-2 py-1 rounded text-sm">{post.category}</span>
          <span className="text-muted-foreground text-sm">{post.readTime}</span>
        </div>
        <h3 className="text-xl font-bold mb-3 line-clamp-2">{sanitizeText(post.title)}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-3">{sanitizeText(post.excerpt)}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">{post.author}</span>
          </div>
          <span className="text-muted-foreground text-sm">{post.date}</span>
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
