
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
}

const BlogPostCard = ({ post, articleLink }: BlogPostCardProps) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Security": return <Shield className="h-16 w-16 text-[#06B6D4]" />;
      case "Technology": return <Zap className="h-16 w-16 text-[#06B6D4]" />;
      case "Analytics": return <Globe className="h-16 w-16 text-[#06B6D4]" />;
      default: return <Globe className="h-16 w-16 text-[#06B6D4]" />;
    }
  };

  return (
    <article className="bg-[#121218] rounded-xl border border-gray-800 overflow-hidden hover:border-[#06B6D4]/30 transition-colors">
      <div className="bg-[#0A0A0A] h-48 flex items-center justify-center">
        {getCategoryIcon(post.category)}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-[#06B6D4]/20 text-[#06B6D4] px-2 py-1 rounded text-sm">{post.category}</span>
          <span className="text-gray-400 text-sm">{post.readTime}</span>
        </div>
        <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>
        <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-gray-400 text-sm">{post.author}</span>
          </div>
          <span className="text-gray-400 text-sm">{post.date}</span>
        </div>
        {articleLink ? (
          <Button variant="link" className="text-[#06B6D4] mt-4 p-0" asChild>
            <Link to={articleLink}>
              Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="link" className="text-[#06B6D4] mt-4 p-0">
            Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </article>
  );
};

export default BlogPostCard;
