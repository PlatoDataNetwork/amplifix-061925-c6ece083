import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { ExternalLink, Users, Film, Cpu, FileText, Coins, Zap, Globe, Clapperboard, Ticket, Building2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";
import { useLanguage } from "@/hooks/useLanguage";

const AIEraCorpShowcase = () => {
  useLanguage();
  useGTranslateRefresh(true, []);
  
  return (
    <>
      <Helmet>
        <title>AI Era Corp - IP Investment & Movie Licensing | AmplifiX</title>
        <meta name="description" content="AI Era Corp is an intellectual property and movie investment firm specializing in acquisitions, licensing, NFT platforms, and cinema operations. Formerly AB International Group Corp." />
        <meta name="keywords" content="AI Era Corp, AERA, intellectual property, movie investment, IP licensing, NFT, cinema, AB International" />
        <meta property="og:title" content="AI Era Corp - IP Investment & Movie Licensing" />
        <meta property="og:description" content="Intellectual property and movie investment firm with NFT platforms and global cinema operations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/showcase/ai-era-corp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Era Corp - AERA" />
        <meta name="twitter:description" content="IP acquisitions, movie licensing, and NFT platforms for entertainment." />
        <link rel="canonical" href="https://amplifix.ai/showcase/ai-era-corp" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />

        {/* Hero Section */}
        <section className="pt-24 container mx-auto py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-highlight-blue/10 px-6 py-3 rounded-full mb-6">
                <Film className="h-6 w-6 text-highlight-blue" />
                <span className="text-highlight-blue font-semibold">OTC:AERA</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Media & Intellectual Property</span>
              </div>
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  AI Era Corp
                  <span className="text-highlight-blue block">IP Investment & Movie Licensing</span>
                </h1>
              </div>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto">
                An intellectual property (IP) and movie investment firm specializing in acquisitions, licensing, 
                NFT platforms, and cinema operations. Recently rebranded from AB International Group Corp.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button asChild size="lg" className="bg-highlight-blue hover:bg-highlight-blue/90 text-white">
                  <a href="https://www.abqqs.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="https://www.bing.com/copilotsearch?q=AERA+AI+ERA+Corp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    AmplifiX Search
                  </a>
                </Button>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-highlight-blue mb-2">IP</div>
                  <p className="text-muted-foreground text-sm">Acquisitions</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-highlight-blue mb-2">NFT</div>
                  <p className="text-muted-foreground text-sm">Platforms</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-highlight-blue mb-2">Film</div>
                  <p className="text-muted-foreground text-sm">Licensing</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-highlight-blue mb-2">Global</div>
                  <p className="text-muted-foreground text-sm">Operations</p>
                </div>
              </div>

              {/* Key Features Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-card border rounded-lg p-6 text-center">
                  <FileText className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">IP Licensing</h3>
                  <p className="text-muted-foreground text-sm mt-2">Content rights acquisition and distribution deals</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Coins className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">NFT Platforms</h3>
                  <p className="text-muted-foreground text-sm mt-2">Digital collectibles and tokenized entertainment</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Clapperboard className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Movie Investment</h3>
                  <p className="text-muted-foreground text-sm mt-2">Film production and distribution financing</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Business Segments Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Business Segments</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Integrated entertainment and media investment operations
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="bg-card border rounded-lg p-8">
                  <FileText className="h-10 w-10 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">IP Acquisitions & Licensing</h3>
                  <p className="text-muted-foreground">
                    Strategic acquisition of valuable intellectual properties across entertainment verticals. 
                    Licensing agreements that maximize content value and global distribution reach.
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-8">
                  <Film className="h-10 w-10 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">Movie Investment</h3>
                  <p className="text-muted-foreground">
                    Film production financing and investment opportunities. Supporting quality content creation 
                    from development through distribution and monetization.
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-8">
                  <Coins className="h-10 w-10 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">NFT Platforms</h3>
                  <p className="text-muted-foreground">
                    Digital collectible platforms for entertainment IP. Tokenizing movie moments, character 
                    rights, and exclusive content for collector and fan engagement.
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-8">
                  <Ticket className="h-10 w-10 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">Cinema Operations</h3>
                  <p className="text-muted-foreground">
                    Theater management and exhibition services. Operating cinema venues to connect 
                    audiences with premium entertainment experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology & Innovation Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Entertainment</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Leveraging artificial intelligence to transform media investment and content distribution
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Cpu className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">AI Analytics</h3>
                  <p className="text-muted-foreground">
                    Predictive analytics for content valuation and market trends
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Global Distribution</h3>
                  <p className="text-muted-foreground">
                    International licensing networks across major markets
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Coins className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Digital Assets</h3>
                  <p className="text-muted-foreground">
                    NFT and blockchain integration for IP monetization
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Strategic M&A</h3>
                  <p className="text-muted-foreground">
                    Targeted acquisitions to build IP portfolio value
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-[hsl(220,20%,20%)] to-[hsl(220,15%,35%)]">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                The New Era of Entertainment Investment
              </h2>
              <p className="text-xl mb-8 text-muted-foreground">
                AI Era Corp is reshaping how intellectual property is acquired, licensed, and monetized 
                in the digital age—creating value through strategic content investments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-[hsl(220,20%,15%)] hover:bg-[hsl(220,20%,20%)] text-white border border-white/20">
                  <a href="https://www.abqqs.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Learn More
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/30 text-foreground hover:bg-white/10">
                  <LanguageAwareLink to="/contact" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Contact Us
                  </LanguageAwareLink>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Showcase */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <LanguageAwareLink to="/showcase" className="text-highlight-blue hover:underline inline-flex items-center gap-2">
              ← Back to All Showcases
            </LanguageAwareLink>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AIEraCorpShowcase;
