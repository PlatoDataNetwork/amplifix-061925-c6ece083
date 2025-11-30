import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import MainHeader from "@/components/MainHeader";
import SEOHead from "@/components/SEOHead";
import BlogPostCard from "@/components/BlogPostCard";
import ArticleListItem from "@/components/ArticleListItem";
import ViewToggle from "@/components/ViewToggle";
import VerticalAIChat from "@/components/VerticalAIChat";
import ArticleSearch from "@/components/ArticleSearch";
import NewsletterSignup from "@/components/NewsletterSignup";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { usePlatoVerticals } from "@/hooks/usePlatoVerticals";
import { usePlatoDataFeed } from "@/hooks/usePlatoDataFeed";
import { useRSSFeed } from "@/hooks/useRSSFeed";
import { useArticlesFromDB } from "@/hooks/useArticlesFromDB";
import { ArrowLeft } from "lucide-react";
import { getCurrentLanguage } from "@/utils/language";
import { supabase } from "@/integrations/supabase/client";

const VerticalPage = () => {
  const { vertical } = useParams<{ vertical: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { verticals } = usePlatoVerticals();
  useLanguage();
  
  // View preference state
  const [view, setView] = useState<"card" | "list">(() => {
    const saved = localStorage.getItem("vertical-view-preference");
    return (saved as "card" | "list") || "card";
  });

  // Search state
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleViewChange = (newView: "card" | "list") => {
    setView(newView);
    localStorage.setItem("vertical-view-preference", newView);
  };

  const handleSearch = async (results: any[], query: string) => {
    setIsSearching(true);
    setSearchQuery(query);
    
    // Fetch full article data for the search results
    if (results.length > 0) {
      const ids = results.map(r => r.id);
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .in("id", ids);
      
      if (!error && data) {
        // Sort by search rank
        const sortedData = data.sort((a, b) => {
          const rankA = results.find(r => r.id === a.id)?.rank || 0;
          const rankB = results.find(r => r.id === b.id)?.rank || 0;
          return rankB - rankA;
        });
        setSearchResults(sortedData);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };
  
  // Determine language prefix from current path (e.g. /uk/intel/...)
  const pathParts = location.pathname.split("/").filter(Boolean);
  const languagePrefix = pathParts[0];
  const isLanguagePath = languagePrefix && languagePrefix.length === 2 && languagePrefix !== "intel";
  const langPrefix = isLanguagePath ? `/${languagePrefix}` : "";
  
  const INITIAL_LOAD = 24;
  
  // Find the vertical info
  const verticalInfo = useMemo(() => {
    const slug = vertical?.toLowerCase();
    return verticals.find(v => v.slug === slug || v.name.toLowerCase() === slug);
  }, [vertical, verticals]);
  
  // Load from database for all verticals (primary source), fallback to external API if empty
  const { posts: dbPosts, isLoading: dbLoading, error: dbError, hasMore: dbHasMore, loadMore: dbLoadMore } = useArticlesFromDB(
    verticalInfo?.slug || null,
    INITIAL_LOAD
  );
  
  const { posts: platoDataPosts, isLoading: platoLoading, error: platoError } = usePlatoDataFeed(
    // Only use external API as fallback if no DB articles found
    (!verticalInfo || (dbPosts.length > 0 && !dbLoading))
      ? null 
      : verticalInfo.slug,
    verticalInfo?.name || ''
  );
  
  // Prioritize search results if searching, otherwise use regular posts
  const displayPosts = useMemo(() => {
    if (isSearching && searchQuery) {
      return searchResults;
    }
    if (dbPosts.length > 0) {
      return dbPosts;
    }
    return platoDataPosts;
  }, [isSearching, searchQuery, searchResults, dbPosts, platoDataPosts]);
  
  const isLoading = dbLoading || platoLoading;
  const error = dbError || platoError;
  
  // Use database hasMore if we have DB posts and not searching, otherwise check platoData length
  const hasMorePosts = !isSearching && dbPosts.length > 0 ? dbHasMore : displayPosts.length > 0;

  // Re-run GTranslate once posts are loaded so thumbnails/text can be translated
  useEffect(() => {
    if (isLoading || !displayPosts.length) return;

    try {
      const lang = getCurrentLanguage();
      if (!lang || lang === 'en') return;

      const w = window as any;
      if (typeof w.doGTranslate === 'function') {
        setTimeout(() => {
          try {
            w.doGTranslate(`en|${lang}`);
          } catch (e) {
            console.error('GTranslate vertical refresh failed', e);
          }
        }, 200);
      }
    } catch (e) {
      console.error('GTranslate vertical refresh error', e);
    }
  }, [isLoading, displayPosts.length]);
  
  const handleShowMore = () => {
    // If using DB posts with pagination, load more from DB
    if (dbPosts.length > 0 && dbLoadMore) {
      dbLoadMore();
    }
  };
  
  if (!verticalInfo) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SEOHead title="Vertical Not Found" />
        <MainHeader />
        <div className="pt-24 container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Vertical Not Found</h1>
            <p className="text-muted-foreground mb-6">The vertical you're looking for doesn't exist.</p>
            <Button onClick={() => navigate(`${langPrefix}/intel`)} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Intelligence
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead 
        title={`${verticalInfo.name} Intelligence - AmplifiX`}
        description={`Latest ${verticalInfo.name} news, insights, and updates from AmplifiX Intelligence.`}
      />
      <MainHeader />

      <div className="pt-24 container mx-auto py-8 md:py-12 px-4">
        {/* Back Button */}
        <Button 
          onClick={() => navigate(`${langPrefix}/intel`)} 
          variant="ghost" 
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Intelligence
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-500 to-blue-500 bg-clip-text text-transparent">
              {verticalInfo.name}
            </span>
            {' '}Intelligence
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto px-4 mb-8">
            Stay updated with the latest {verticalInfo.name} news, insights, and intelligence.
          </p>

          {/* Search Bar with View Toggle */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-4xl mx-auto">
            <div className="flex-1 w-full">
              <ArticleSearch 
                verticalSlug={verticalInfo.slug}
                onSearch={handleSearch}
                onClear={handleClearSearch}
              />
            </div>
            {!isLoading && displayPosts.length > 0 && (
              <ViewToggle view={view} onViewChange={handleViewChange} />
            )}
          </div>
        </div>

        {/* Search Results Header */}
        {isSearching && searchQuery && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              {searchResults.length > 0 
                ? `Found ${searchResults.length} ${searchResults.length === 1 ? 'result' : 'results'} for "${searchQuery}"`
                : `No results found for "${searchQuery}"`
              }
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">
              Error loading articles: {error}
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        )}

        {/* Articles Grid/List */}
        {!isLoading && displayPosts.length > 0 && (
          <section className="mb-12 md:mb-16">
            {view === "card" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {displayPosts.map((post) => (
                  <BlogPostCard 
                    key={post.id} 
                    post={{
                      ...post,
                      readTime: post.read_time
                    }} 
                    articleLink={`${langPrefix}/intel/external/${post.id}`}
                    buttonText="Read Full Article"
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {displayPosts.map((post) => (
                  <ArticleListItem 
                    key={post.id} 
                    post={{
                      ...post,
                      readTime: post.read_time
                    }} 
                    articleLink={`${langPrefix}/intel/external/${post.id}`}
                    buttonText="Read Full Article"
                  />
                ))}
              </div>
            )}

            {/* Show More Button - only show if not searching */}
            {hasMorePosts && !isSearching && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <p className="text-muted-foreground text-sm">
                  Showing {displayPosts.length} articles
                </p>
                <Button 
                  onClick={handleShowMore}
                  variant="outline"
                  size="lg"
                  className="min-w-[200px]"
                  disabled={dbLoading}
                >
                  {dbLoading ? 'Loading...' : 'Show More Articles'}
                </Button>
              </div>
            )}
          </section>
        )}

        {/* No Articles */}
        {!isLoading && displayPosts.length === 0 && !isSearching && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              No articles available for {verticalInfo.name} at the moment.
            </p>
            <Button onClick={() => navigate(`${langPrefix}/intel`)} variant="outline">
              View All Articles
            </Button>
          </div>
        )}

        <NewsletterSignup />
      </div>

      <Footer />
      
      {/* AI Chat Assistant */}
      {verticalInfo && (
        <VerticalAIChat 
          verticalSlug={verticalInfo.slug} 
          verticalName={verticalInfo.name} 
        />
      )}
    </div>
  );
};

export default VerticalPage;
