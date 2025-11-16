
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

const BlogPostCard = ({ post, articleLink, buttonText = "Read Full Article" }: BlogPostCardProps) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Security": return <Shield className="h-16 w-16 text-blue-500" />;
      case "Technology": return <Zap className="h-16 w-16 text-blue-500" />;
      case "Analytics": return <Globe className="h-16 w-16 text-blue-500" />;
      case "AI": return <Zap className="h-16 w-16 text-blue-500" />;
      default: return <Globe className="h-16 w-16 text-blue-500" />;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!articleLink) {
      e.preventDefault();
    }
  };

  return (
    <article className="bg-card rounded-xl border border-border overflow-hidden hover:border-blue-500/30 transition-colors">
      <div className="bg-muted h-48 flex items-center justify-center">
        {getCategoryIcon(post.category)}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-blue-500/20 text-blue-500 px-2 py-1 rounded text-sm">{post.category}</span>
          <span className="text-muted-foreground text-sm">{post.readTime}</span>
        </div>
        <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>
        <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">{post.author}</span>
          </div>
          <span className="text-muted-foreground text-sm">{post.date}</span>
        </div>
        {articleLink && (
          articleLink.startsWith('http') ? (
            <Button variant="link" className="text-blue-500 mt-4 p-0" asChild>
              <a href={articleLink} target="_blank" rel="noopener noreferrer">
                {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          ) : (
            <Button variant="link" className="text-blue-500 mt-4 p-0" asChild>
              <Link to={articleLink}>
                {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )
        )}
      </div>
    </article>
  );
};

export default BlogPostCard;
