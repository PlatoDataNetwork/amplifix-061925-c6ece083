import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import MainHeader from "@/components/MainHeader";
import SEOHead from "@/components/SEOHead";
import FeaturedPost from "@/components/FeaturedPost";
import BlogPostCard from "@/components/BlogPostCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import RSSFeed from "@/components/RSSFeed";
import { useJsonData } from "@/hooks/useJsonData";
import { useRSSFeed } from "@/hooks/useRSSFeed";
import { usePlatoDataFeed } from "@/hooks/usePlatoDataFeed";
import { usePlatoVerticals } from "@/hooks/usePlatoVerticals";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

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
    ui: {
      read_full_article: string;
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
  const { data: blogData } = useJsonData<BlogData>('blog-intel.json');
  const { verticals } = usePlatoVerticals();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  useLanguage(); // Auto-translates page
  
  const selectedTag = searchParams.get('tag');
  const selectedCategory = 'All'; // Main page always shows "All"
  
  // Get the vertical slug for the selected category
  const selectedVertical = null; // Main page doesn't filter by vertical
  
  // Don't load any external feeds on main page - just show local posts
  const { posts: platoDataPosts } = usePlatoDataFeed(null, '');
  
  // Load ACN RSS feed
  const { posts: acnPosts } = useRSSFeed('', 'ACN');
  const [visibleCount, setVisibleCount] = useState(9);
  const POSTS_INCREMENT = 9;
  
  // Show only local blog posts on main page
  const allBlogPosts = useMemo(() => {
    const localPosts = blogData?.blog.blog_posts || [];
    return localPosts;
  }, [blogData?.blog.blog_posts]);
  
  // Create categories array with "All" first, then alphabetically sorted verticals
  const categories = useMemo(() => {
    return ['All', ...verticals.map(v => v.name)];
  }, [verticals]);
  
  const popularTags = blogData?.blog.popular_tags?.tags || ["AI", "Analytics", "Investor Relations", "Corporate Communications", "Intelligence", "Automation", "Data", "Insights", "Innovation"];
  
  const filteredBlogPosts = useMemo(() => {
    let filtered = allBlogPosts;
    
    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(post => post.tags?.includes(selectedTag));
    }
    
    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    return filtered;
  }, [allBlogPosts, selectedTag, selectedCategory]);

  // Show more logic
  const visiblePosts = useMemo(() => {
    return filteredBlogPosts.slice(0, visibleCount);
  }, [filteredBlogPosts, visibleCount]);

  const hasMorePosts = visibleCount < filteredBlogPosts.length;

  // Reset visible count when filter changes
  useMemo(() => {
    setVisibleCount(9);
  }, [selectedTag, selectedCategory]);
  
  const handleTagClick = (tag: string) => {
    setSearchParams({ tag });
  };
  
  const clearFilter = () => {
    setSearchParams({});
  };

  const handleShowMore = () => {
    setVisibleCount(prev => prev + POSTS_INCREMENT);
  };

  const handleCategoryClick = (category: string) => {
    if (category === 'All') {
      navigate('/intel');
    } else {
      // Find the vertical to get its slug
      const vertical = verticals.find(v => v.name === category);
      if (vertical) {
        navigate(`/intel/${vertical.slug}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead title="AmplifiX Intelligence - AI & Corporate Communications Insights" />
      <MainHeader />

      <div className="pt-24 container mx-auto py-8 md:py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8">
            {blogData?.blog.hero.title ? (
              blogData.blog.hero.title.includes('Intel') ? (
                <>AmplifiX <span className="bg-gradient-to-r from-blue-500 to-blue-500 bg-clip-text text-transparent">Intelligence</span></>
              ) : (
                blogData.blog.hero.title
              )
            ) : (
              <>AmplifiX <span className="bg-gradient-to-r from-blue-500 to-blue-500 bg-clip-text text-transparent">Intelligence</span></>
            )}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto px-4">
            {blogData?.blog.hero.description || 'Stay updated with the latest in AI intelligence, corporate communications insights, and product updates from the AmplifiX team.'}
          </p>
        </div>

        {/* Categories */}
        <section className="mb-8 md:mb-12">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryClick(category)}
                className={selectedCategory === category ? "bg-gradient-to-r from-blue-500 to-blue-500 text-xs md:text-sm" : "text-xs md:text-sm"}
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

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

        {/* Blog Posts Grid */}
        <section className="mb-12 md:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {visiblePosts.map((post) => (
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
                  post.id >= 1000 ? `/intel/external/${post.id}` : undefined
                }
                buttonText={blogData?.blog.ui.read_full_article}
              />
            ))}
          </div>

          {/* Show More Button */}
          {hasMorePosts && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-muted-foreground text-sm">
                Showing {visibleCount} of {filteredBlogPosts.length} articles
              </p>
              <Button 
                onClick={handleShowMore}
                variant="outline"
                size="lg"
                className="min-w-[200px]"
              >
                Show More Articles
              </Button>
            </div>
          )}

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
