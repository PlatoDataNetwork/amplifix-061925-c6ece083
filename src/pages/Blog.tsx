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
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Input } from "@/components/ui/input";
import { Search, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { generateArticleUrl } from "@/utils/slugify";
import { Card } from "@/components/ui/card";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";
import { useTranslation } from "react-i18next";

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
  const { data: blogData } = useJsonData<BlogData>('/data/blog-intel.json');
  const { verticals } = usePlatoVerticals();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  useLanguage(); // Auto-translates page
  
  // Get language prefix from current path
  const languagePrefix = location.pathname.startsWith('/') 
    ? location.pathname.split('/')[1] 
    : '';
  const isLanguagePath = languagePrefix && languagePrefix.length === 2 && languagePrefix !== 'intel';
  const langPrefix = isLanguagePath ? `/${languagePrefix}` : '';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const [selectedVerticalFilter, setSelectedVerticalFilter] = useState<string>('All');
  
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
  
  // Search function using the database
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    setShowSearchResults(true);
    
    try {
      const { data, error } = await supabase.rpc('search_articles', {
        search_query: query,
        limit_count: 50,
        offset_count: 0
      });
      
      if (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } else {
        setSearchResults(data || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
    setSearchResults([]);
  };
  
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

  // Use centralized GTranslate refresh hook
  useGTranslateRefresh(filteredBlogPosts.length > 0, [filteredBlogPosts.length]);

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
      navigate(`${langPrefix}/intel`);
    } else {
      // Find the vertical to get its slug
      const vertical = verticals.find(v => v.name === category);
      if (vertical) {
        navigate(`${langPrefix}/intel/${vertical.slug}`);
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
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 pb-2 bg-gradient-to-r from-blue-500 to-blue-500 bg-clip-text text-transparent translate">
            AmplifiX Intelligence
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto px-4 mb-8 translate">
            Insights on AI, corporate communications, investor relations, and business intelligence.
          </p>
          
          {/* Search Bar with Vertical Filter */}
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex gap-3">
              {/* Vertical Dropdown Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-14 px-4 rounded-full border-2 min-w-[140px] justify-between">
                    <span className="truncate">{selectedVerticalFilter}</span>
                    <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto bg-popover z-50" align="start" side="bottom" sideOffset={8}>
                  <DropdownMenuItem 
                    onClick={() => {
                      setSelectedVerticalFilter('All');
                      navigate(`${langPrefix}/intel`);
                    }}
                    className={selectedVerticalFilter === 'All' ? 'bg-accent' : ''}
                  >
                    <span className="translate">All Verticals</span>
                  </DropdownMenuItem>
                  {verticals.map((vertical) => (
                    <DropdownMenuItem 
                      key={vertical.slug}
                      onClick={() => {
                        setSelectedVerticalFilter(vertical.name);
                        navigate(`${langPrefix}/intel/${vertical.slug}`);
                      }}
                      className={selectedVerticalFilter === vertical.name ? 'bg-accent' : ''}
                    >
                      {vertical.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim()) {
                      handleSearch(e.target.value);
                    } else {
                      clearSearch();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      handleSearch(searchQuery);
                    }
                  }}
                  className="pl-12 pr-12 h-14 text-lg rounded-full border-2 focus:border-primary"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {showSearchResults && (
          <section className="mb-12 max-w-4xl mx-auto">
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold translate">
                  {isSearching ? 'Searching...' : `Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`}
                </h2>
              </div>
              
              {isSearching ? (
                <div className="text-center py-8 text-muted-foreground translate">
                  Searching through articles...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground translate">
                  No articles found matching "{searchQuery}"
                </div>
              ) : (
                <div className="space-y-6">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="border-b border-border pb-6 last:border-0 cursor-pointer hover:bg-muted/50 p-4 rounded-lg transition-colors"
                      onClick={() => navigate(generateArticleUrl(result.title, result.id, langPrefix))}
                    >
                      <h3 className="text-lg font-semibold text-primary mb-2 hover:underline">
                        {result.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-2">
                        {result.excerpt || 'No excerpt available'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded translate">
                          Relevance: {(result.rank * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </section>
        )}


        {!showSearchResults && <FeaturedPost />}

        {/* Filter indicator */}
        {!showSearchResults && selectedTag && (
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
        {!showSearchResults && (
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
                  post.id >= 1000 ? generateArticleUrl(post.title, post.id, langPrefix) : undefined
                }
                buttonText={blogData?.blog.ui.read_full_article}
              />
            ))}
          </div>

          {/* Show More Button */}
          {hasMorePosts && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-muted-foreground text-sm translate">
                Showing {visibleCount} of {filteredBlogPosts.length} articles
              </p>
              <Button 
                onClick={handleShowMore}
                variant="outline"
                size="lg"
                className="min-w-[200px]"
              >
                <span className="translate">Show More Articles</span>
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
        )}

        {!showSearchResults && <NewsletterSignup />}

        {/* Popular Tags */}
        {!showSearchResults && (
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
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
