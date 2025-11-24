import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { ExternalLink, Video, Tv, Radio, Smartphone, Users, Zap, Globe, Play, TrendingUp, Film, Sparkles, Monitor, Cast } from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";

const VersaTVShowcase = () => {
  useGTranslateRefresh(true);
  return (
    <>
      <Helmet>
        <title>Versa TV - Next-Generation Streaming Platform | AmplifiX Showcase</title>
        <meta name="description" content="Discover how Versa TV is revolutionizing media and entertainment with innovative streaming technology and cutting-edge content delivery experiences." />
        <meta name="keywords" content="Versa TV, streaming platform, media technology, digital entertainment, OTT platform, content streaming, video on demand, live streaming" />
        <meta property="og:title" content="Versa TV - Next-Gen Media Platform" />
        <meta property="og:description" content="Next-generation media and streaming platform delivering innovative content and entertainment experiences." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/showcase/versatv" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Versa TV - Future of Streaming" />
        <meta name="twitter:description" content="Revolutionary streaming platform transforming how audiences consume entertainment content." />
        <link rel="canonical" href="https://amplifix.ai/showcase/versatv" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />

        {/* Hero Section */}
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block mb-6">
                  <div className="bg-highlight-blue/10 text-highlight-blue rounded-full px-4 py-2 border border-highlight-blue/20 text-sm font-medium">
                    Private Media Company
                  </div>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                  <span className="text-highlight-blue">Versa TV</span><br />
                  The Future of Streaming
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Next-generation media and streaming platform delivering innovative content and entertainment experiences through cutting-edge technology and seamless multi-device access.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://VersaTV.io" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors">
                      Visit Platform
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <LanguageAwareLink to="/contact">
                    <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors">
                      Partner with Us
                      <Users className="ml-2 h-4 w-4" />
                    </Button>
                  </LanguageAwareLink>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-highlight-blue/20 to-purple-500/10 rounded-2xl p-8 border border-border">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                      <Video className="h-8 w-8 text-highlight-blue mx-auto mb-2" />
                      <div className="text-2xl font-bold">4K HDR</div>
                      <div className="text-sm text-muted-foreground">Quality</div>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                      <Globe className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">Global</div>
                      <div className="text-sm text-muted-foreground">Reach</div>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                      <Zap className="h-8 w-8 text-highlight-blue mx-auto mb-2" />
                      <div className="text-2xl font-bold">Instant</div>
                      <div className="text-sm text-muted-foreground">Streaming</div>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                      <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">Growing</div>
                      <div className="text-sm text-muted-foreground">Audience</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">About Versa TV</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Tv className="w-12 h-12 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-bold mb-3">Premium Content</h3>
                  <p className="text-muted-foreground">
                    Curated library of original series, movies, documentaries, and live events featuring diverse genres and exclusive content from top creators and production studios worldwide.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Smartphone className="w-12 h-12 text-purple-500 mb-4" />
                  <h3 className="text-xl font-bold mb-3">Multi-Device Experience</h3>
                  <p className="text-muted-foreground">
                    Seamless viewing across smartphones, tablets, smart TVs, gaming consoles, and web browsers with synchronized watchlists and personalized recommendations.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Radio className="w-12 h-12 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-bold mb-3">Live Streaming</h3>
                  <p className="text-muted-foreground">
                    Real-time broadcasting capabilities for sports, news, concerts, and special events with ultra-low latency delivery and interactive viewing features.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Sparkles className="w-12 h-12 text-purple-500 mb-4" />
                  <h3 className="text-xl font-bold mb-3">AI-Powered Discovery</h3>
                  <p className="text-muted-foreground">
                    Advanced recommendation engine using machine learning to surface personalized content based on viewing history, preferences, and trending entertainment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Platform Features</h2>
              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-highlight-blue/10 rounded-full flex items-center justify-center">
                    <Video className="w-6 h-6 text-highlight-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Adaptive Streaming</h3>
                    <p className="text-muted-foreground">
                      Intelligent bitrate adaptation automatically adjusts video quality based on network conditions, ensuring smooth playback on any connection from 480p to 4K HDR.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                    <Cast className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Offline Downloads</h3>
                    <p className="text-muted-foreground">
                      Download your favorite content for offline viewing with flexible quality settings and automatic management of device storage space.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-highlight-blue/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-highlight-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Family Profiles</h3>
                    <p className="text-muted-foreground">
                      Create up to 5 individual profiles per account with parental controls, age-appropriate content filtering, and personalized watch history.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Interactive Features</h3>
                    <p className="text-muted-foreground">
                      Engage with content through real-time polls, trivia, watch parties with friends, and exclusive behind-the-scenes bonus material.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Categories */}
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Content Library</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <Film className="w-12 h-12 text-highlight-blue mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Original Series</h3>
                  <p className="text-muted-foreground">
                    Exclusive shows and series produced by Versa TV Studios
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <Play className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Live Events</h3>
                  <p className="text-muted-foreground">
                    Sports, concerts, and breaking news broadcast in real-time
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <TrendingUp className="w-12 h-12 text-highlight-blue mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Trending Content</h3>
                  <p className="text-muted-foreground">
                    Latest releases and popular titles across all genres
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience the Future of Entertainment</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join millions of viewers streaming premium content on Versa TV. Start your journey today with unlimited access to our growing library.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://VersaTV.io" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors">
                    Start Watching
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <LanguageAwareLink to="/contact">
                  <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors">
                    Business Inquiries
                    <Users className="ml-2 h-4 w-4" />
                  </Button>
                </LanguageAwareLink>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Showcase */}
        <div className="py-12 border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <LanguageAwareLink to="/showcase">
              <Button variant="outline" size="lg">
                ← Back to Showcase
              </Button>
            </LanguageAwareLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default VersaTVShowcase;
