
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import MainHeader from "@/components/MainHeader";
import FeaturedPost from "@/components/FeaturedPost";
import BlogPostCard from "@/components/BlogPostCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import RSSFeed from "@/components/RSSFeed";
import { useJsonData } from "@/hooks/useJsonData";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  read_time: string;
  category: string;
  image: string;
}

interface BlogData {
  hero: {
    badge_text: string;
    title: string;
    description: string;
  };
  categories: string[];
  blog_posts: BlogPost[];
  popular_tags: {
    title: string;
    tags: string[];
  };
}

const Blog = () => {
  const { data: blogData } = useJsonData<BlogData>('blog.json');
  const blogPosts = blogData?.blog_posts || [];
  const categories = blogData?.categories || ["All", "Technology", "Analytics", "Security", "Insights", "Updates"];
  const popularTags = blogData?.popular_tags?.tags || ["AI", "Analytics", "Investor Relations", "Corporate Communications", "Intelligence", "Automation", "Data", "Insights", "Technology", "Innovation"];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <MainHeader />

      <div className="pt-24 container mx-auto py-8 md:py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-6">
            <div className="bg-gradient-to-r from-[#8A3FFC]/10 to-[#3B82F6]/10 text-[#8A3FFC] rounded-full px-4 md:px-6 py-2 border border-[#8A3FFC]/20 text-sm md:text-base">
              Latest Intelligence
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            AmplifiX <span className="bg-gradient-to-r from-blue-500 to-blue-500 bg-clip-text text-transparent">Intel</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Stay updated with the latest in AI intelligence, corporate communications insights, and product updates from the AmplifiX team.
          </p>
        </div>

        <FeaturedPost />

        {/* Categories */}
        <section className="mb-8 md:mb-12">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
                className={category === "All" ? "bg-gradient-to-r from-blue-500 to-blue-500 text-xs md:text-sm" : "text-xs md:text-sm"}
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="mb-12 md:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {blogPosts.map((post) => (
              <BlogPostCard 
                key={post.id} 
                post={{
                  ...post,
                  readTime: post.read_time
                }} 
                articleLink={
                  post.id === 1 ? "/intel/ai-intelligence-article" :
                  post.id === 2 ? "/intel/advanced-analytics-article" :
                  post.id === 3 ? "/intel/investor-engagement-article" :
                  undefined
                }
              />
            ))}
          </div>
        </section>

        <NewsletterSignup />

        {/* Popular Tags */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold mb-6">Popular Tags</h2>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {popularTags.map((tag) => (
              <span key={tag} className="bg-[#121218] border border-gray-800 px-3 py-2 rounded-full text-gray-300 hover:border-blue-500/30 cursor-pointer transition-colors text-xs md:text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
