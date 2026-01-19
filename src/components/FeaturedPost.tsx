
import { Button } from "@/components/ui/button";
import { User, Calendar, ArrowRight, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useJsonData } from "@/hooks/useJsonData";
import { useLanguage } from "@/hooks/useLanguage";

interface FeaturedPostItem {
  badge: string;
  category: string;
  title: string;
  description: string;
  author: string;
  date: string;
  button_text: string;
  link: string;
  icon?: string;
}

interface BlogData {
  blog: {
    featured_post: FeaturedPostItem;
    featured_posts?: FeaturedPostItem[];
  };
}

const FeaturedPost = () => {
  const { data: blogData } = useJsonData<BlogData>('blog-intel.json');
  const { currentLanguage } = useLanguage();
  const langPrefix = currentLanguage && currentLanguage !== "en" ? `/${currentLanguage}` : "";
  
  const featuredPost = blogData?.blog.featured_post;
  const featuredPosts = blogData?.blog.featured_posts || [];

  // Combine the main featured post with additional featured posts
  const allFeaturedPosts = featuredPost ? [featuredPost, ...featuredPosts] : featuredPosts;

  if (allFeaturedPosts.length === 0) return null;

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'trending':
        return <TrendingUp className="h-16 w-16 md:h-24 md:w-24 text-blue-500" />;
      case 'shield':
      default:
        return <Shield className="h-16 w-16 md:h-24 md:w-24 text-blue-500" />;
    }
  };

  return (
    <section className="mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {allFeaturedPosts.map((post, index) => (
          <div 
            key={index}
            className="bg-gradient-to-r from-blue-500/10 to-blue-500/10 p-6 md:p-8 rounded-2xl border border-blue-500/20"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm translate">{post.badge}</span>
                <span className="text-muted-foreground text-sm translate">{post.category}</span>
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold mb-4 translate">{post.title}</h2>
              
              <p className="text-muted-foreground mb-6 line-clamp-3 translate">
                {post.description}
              </p>
              
              <div className="flex items-center gap-4 md:gap-6 mb-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm translate">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm translate">{post.date}</span>
                </div>
              </div>
              
              <div className="mt-auto">
                <Button className="bg-gradient-to-r from-blue-500 to-blue-500 text-xs md:text-sm" asChild>
                  <Link to={`${langPrefix}${post.link}`}>
                    <span className="translate">{post.button_text}</span> <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedPost;
