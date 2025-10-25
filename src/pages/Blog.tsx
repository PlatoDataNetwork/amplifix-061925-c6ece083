
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import MainHeader from "@/components/MainHeader";
import FeaturedPost from "@/components/FeaturedPost";
import BlogPostCard from "@/components/BlogPostCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import RSSFeed from "@/components/RSSFeed";
import { useJsonData } from "@/hooks/useJsonData";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  read_time: string;
  category: string;
  image: string;
  tags: string[];
}

interface BlogData {
  blog: {
    hero: {
      badge_text: string;
      title: string;
      description: string;
    };
    filter: {
      filtered_by_text: string;
      clear_filter_text: string;
      no_articles_found: string;
      view_all_articles: string;
    };
    categories: string[];
    blog_posts: BlogPost[];
    popular_tags: {
      title: string;
      tags: string[];
    };
  };
}

const Blog = () => {
  const { data: blogData } = useJsonData<BlogData>('blog.json');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const selectedTag = searchParams.get('tag');
  
  const allBlogPosts = blogData?.blog.blog_posts || [];
  const categories = blogData?.blog.categories || ["All", "Technology", "Analytics", "Security", "Insights", "Updates"];
  const popularTags = blogData?.blog.popular_tags?.tags || ["AI", "Analytics", "Investor Relations", "Corporate Communications", "Intelligence", "Automation", "Data", "Insights", "Technology", "Innovation"];
  
  const filteredBlogPosts = useMemo(() => {
    if (!selectedTag) return allBlogPosts;
    return allBlogPosts.filter(post => post.tags?.includes(selectedTag));
  }, [allBlogPosts, selectedTag]);
  
  const handleTagClick = (tag: string) => {
    setSearchParams({ tag });
  };
  
  const clearFilter = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />

      <div className="pt-24 container mx-auto py-8 md:py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-6">
            <div className="bg-gradient-to-r from-[#8A3FFC]/10 to-[#3B82F6]/10 text-[#8A3FFC] rounded-full px-4 md:px-6 py-2 border border-[#8A3FFC]/20 text-sm md:text-base">
              {blogData?.blog.hero.badge_text || 'Latest Intelligence'}
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            {blogData?.blog.hero.title ? (
              blogData.blog.hero.title.includes('Intel') ? (
                <>AmplifiX <span className="bg-gradient-to-r from-blue-500 to-blue-500 bg-clip-text text-transparent">Intel</span></>
              ) : (
                blogData.blog.hero.title
              )
            ) : (
              <>AmplifiX <span className="bg-gradient-to-r from-blue-500 to-blue-500 bg-clip-text text-transparent">Intel</span></>
            )}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            {blogData?.blog.hero.description || 'Stay updated with the latest in AI intelligence, corporate communications insights, and product updates from the AmplifiX team.'}
          </p>
        </div>

        <FeaturedPost />

        {/* Filter indicator */}
        {selectedTag && (
          <section className="mb-6">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">{blogData?.blog.filter.filtered_by_text || 'Filtered by:'}:</span>
              <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                #{selectedTag}
              </span>
              <Button
                onClick={clearFilter}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                {blogData?.blog.filter.clear_filter_text || 'Clear filter'}
              </Button>
            </div>
          </section>
        )}

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
            {filteredBlogPosts.map((post) => (
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
          {filteredBlogPosts.length === 0 && selectedTag && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                {blogData?.blog.filter.no_articles_found || 'No articles found for tag'} "#{selectedTag}"
              </p>
              <Button onClick={clearFilter} variant="outline">
                {blogData?.blog.filter.view_all_articles || 'View all articles'}
              </Button>
            </div>
          )}
        </section>

        <NewsletterSignup />

        {/* Popular Tags */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold mb-6">{blogData?.blog.popular_tags.title || 'Popular Tags'}</h2>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {popularTags.map((tag) => (
              <span 
                key={tag} 
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-2 rounded-full cursor-pointer transition-colors text-xs md:text-sm ${
                  selectedTag === tag 
                    ? 'bg-blue-500/20 border border-blue-500 text-blue-400' 
                    : 'bg-card border border-border text-muted-foreground hover:border-primary/30'
                }`}
              >
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
