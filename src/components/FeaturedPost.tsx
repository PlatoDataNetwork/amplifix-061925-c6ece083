
import { Button } from "@/components/ui/button";
import { User, Calendar, ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useJsonData } from "@/hooks/useJsonData";

interface BlogData {
  blog: {
    featured_post: {
      badge: string;
      category: string;
      title: string;
      description: string;
      author: string;
      date: string;
      button_text: string;
      link: string;
    };
  };
}

const FeaturedPost = () => {
  const { data: blogData } = useJsonData<BlogData>('blog-intel.json');
  const featuredPost = blogData?.blog.featured_post;

  if (!featuredPost) return null;

  return (
    <section className="mb-16">
      <div className="bg-gradient-to-r from-blue-500/10 to-blue-500/10 p-8 rounded-2xl border border-blue-500/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">{featuredPost.badge}</span>
              <span className="text-muted-foreground text-sm">{featuredPost.category}</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">{featuredPost.title}</h2>
            <p className="text-muted-foreground mb-6">
              {featuredPost.description}
            </p>
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{featuredPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{featuredPost.date}</span>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-blue-500 text-xs md:text-sm" asChild>
              <Link to={featuredPost.link}>
                {featuredPost.button_text} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="bg-card p-8 rounded-xl border border-border h-64 flex items-center justify-center">
            <Shield className="h-24 w-24 text-blue-500" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPost;
