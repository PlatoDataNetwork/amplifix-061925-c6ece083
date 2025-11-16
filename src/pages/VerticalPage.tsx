import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import MainHeader from "@/components/MainHeader";
import SEOHead from "@/components/SEOHead";
import BlogPostCard from "@/components/BlogPostCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { usePlatoVerticals } from "@/hooks/usePlatoVerticals";
import { usePlatoDataFeed } from "@/hooks/usePlatoDataFeed";
import { useRSSFeed } from "@/hooks/useRSSFeed";
import { ArrowLeft } from "lucide-react";

const VerticalPage = () => {
  const { vertical } = useParams<{ vertical: string }>();
  const navigate = useNavigate();
  const { verticals } = usePlatoVerticals();
  useLanguage();
  
  const [visibleCount, setVisibleCount] = useState(12);
  const POSTS_INCREMENT = 12;
  
  // Find the vertical info
  const verticalInfo = useMemo(() => {
    const slug = vertical?.toLowerCase();
    return verticals.find(v => v.slug === slug || v.name.toLowerCase() === slug);
  }, [vertical, verticals]);
  
  // Load the appropriate feed
  const { posts: platoDataPosts, isLoading: platoLoading, error: platoError } = usePlatoDataFeed(
    verticalInfo?.slug || null,
    verticalInfo?.name || ''
  );
  
  const { posts: acnPosts, isLoading: acnLoading, error: acnError } = useRSSFeed(
    verticalInfo?.name === 'ACN' ? 'https://www.acnnewswire.com/rss/lang/english.xml' : '',
    'ACN'
  );
  
  const allPosts = useMemo(() => {
    if (verticalInfo?.name === 'ACN') return acnPosts;
    return platoDataPosts;
  }, [verticalInfo, platoDataPosts, acnPosts]);
  
  const isLoading = platoLoading || acnLoading;
  const error = platoError || acnError;
  
  const visiblePosts = useMemo(() => {
    return allPosts.slice(0, visibleCount);
  }, [allPosts, visibleCount]);
  
  const hasMorePosts = visibleCount < allPosts.length;
  
  const handleShowMore = () => {
    setVisibleCount(prev => prev + POSTS_INCREMENT);
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
            <Button onClick={() => navigate('/intel')} variant="outline">
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
          onClick={() => navigate('/intel')} 
          variant="ghost" 
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Intelligence
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-blue-500 to-blue-500 bg-clip-text text-transparent">
              {verticalInfo.name}
            </span>
            {' '}Intelligence
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto px-4">
            Stay updated with the latest {verticalInfo.name} news, insights, and intelligence.
          </p>
        </div>

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

        {/* Articles Grid */}
        {!isLoading && allPosts.length > 0 && (
          <section className="mb-12 md:mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {visiblePosts.map((post) => (
                <BlogPostCard 
                  key={post.id} 
                  post={{
                    ...post,
                    readTime: post.read_time
                  }} 
                  articleLink={`/intel/external/${post.id}`}
                  buttonText="Read Full Article"
                />
              ))}
            </div>

            {/* Show More Button */}
            {hasMorePosts && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <p className="text-muted-foreground text-sm">
                  Showing {visibleCount} of {allPosts.length} articles
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
          </section>
        )}

        {/* No Articles */}
        {!isLoading && allPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              No articles available for {verticalInfo.name} at the moment.
            </p>
            <Button onClick={() => navigate('/intel')} variant="outline">
              View All Articles
            </Button>
          </div>
        )}

        <NewsletterSignup />
      </div>

      <Footer />
    </div>
  );
};

export default VerticalPage;
