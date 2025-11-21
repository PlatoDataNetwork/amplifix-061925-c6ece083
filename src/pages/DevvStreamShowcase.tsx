import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { ExternalLink, TrendingUp, Leaf, Globe2, LineChart, Zap, Target, Users } from "lucide-react";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";

const DevvStreamShowcase = () => {
  useGTranslateRefresh(true);

  return (
    <>
      <Helmet>
        <title>DevvStream Corp - Environmental Assets & Carbon Markets | AmplifiX Showcase</title>
        <meta 
          name="description" 
          content="DevvStream Corp specializes in the development and monetization of environmental assets, particularly carbon markets. Working with governments and corporations to create green technology projects." 
        />
        <meta 
          name="keywords" 
          content="DevvStream, DEVS, carbon credits, environmental assets, green technology, NASDAQ, carbon markets, sustainability" 
        />
        <meta property="og:title" content="DevvStream Corp - Environmental Assets & Carbon Markets | AmplifiX" />
        <meta 
          property="og:description" 
          content="Technology-based company focused on environmental assets, carbon markets, and green technology projects." 
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DevvStream Corp - Environmental Assets & Carbon Markets" />
        <meta 
          name="twitter:description" 
          content="Specializing in development and monetization of environmental assets and carbon markets." 
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
        <MainHeader />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-12 md:py-20 px-4 overflow-visible">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-emerald-500/5" />
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <p className="text-green-500 font-semibold mb-2 text-sm md:text-base">NASDAQ: DEVS</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 pb-2 md:pb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Monetizing Environmental Assets
                    </h1>
                    <p className="text-base md:text-xl text-muted-foreground">
                      DevvStream Corp is a technology-based<br />
                      company specializing in the development<br />
                      and monetization of environmental assets,<br />
                      particularly carbon markets and green<br />
                      technology projects.
                    </p>
                  </div>
                </div>
                <div className="space-y-12">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-transparent rounded-2xl blur-xl" />
                    <div className="relative rounded-2xl shadow-2xl w-full h-64 md:h-80 bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center border border-green-500/20">
                      <Leaf className="w-32 h-32 text-green-500/40" />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button asChild size="default" className="gap-2 bg-green-500 text-white hover:bg-green-600">
                      <a href="https://www.nasdaq.com/market-activity/stocks/devs" target="_blank" rel="noopener noreferrer">
                        <TrendingUp className="w-4 h-4" />
                        Live Stock Price
                      </a>
                    </Button>
                    <Button asChild size="default" className="gap-2 bg-green-500 text-white hover:bg-green-600">
                      <a href="https://www.devvstream.com/" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        Visit Website
                      </a>
                    </Button>
                    <Button asChild size="default" className="gap-2 bg-green-500 text-white hover:bg-green-600">
                      <LanguageAwareLink to="/contact">
                        <Users className="w-4 h-4" />
                        Contact Us
                      </LanguageAwareLink>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Company Overview */}
          <section className="py-12 md:py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Leading the Green Technology Revolution
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                  Technology-driven solutions for environmental asset development and carbon market monetization
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-8">
                <Card className="bg-transparent border-green-500/30 hover:border-green-500/50 transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                      <Leaf className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Carbon Markets</h3>
                    <p className="text-muted-foreground">
                      Development and monetization of carbon credits through innovative green technology projects and verified environmental assets.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-transparent border-green-500/30 hover:border-green-500/50 transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                      <Globe2 className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Environmental Assets</h3>
                    <p className="text-muted-foreground">
                      Strategic development of environmental assets working with governments and corporations worldwide.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-transparent border-green-500/30 hover:border-green-500/50 transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Green Technology</h3>
                    <p className="text-muted-foreground">
                      Technology-based solutions addressing environmental challenges and creating sustainable value.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Business Model Section */}
          <section className="py-12 md:py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-transparent rounded-2xl blur-xl" />
                  <div className="relative rounded-2xl shadow-2xl w-full h-64 md:h-80 bg-gradient-to-br from-emerald-500/10 to-green-500/10 flex items-center justify-center border border-green-500/20">
                    <LineChart className="w-32 h-32 text-green-500/40" />
                  </div>
                </div>
                <div className="space-y-4 md:space-y-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                    Technology-Driven Approach
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground">
                    Leveraging technology to create and monetize environmental value
                  </p>
                  <p className="text-muted-foreground">
                    DevvStream works at the intersection of technology, environmental sustainability, and carbon markets. Our platform enables governments and corporations to develop, verify, and monetize environmental assets through innovative green technology projects.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Target className="w-3 h-3 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Carbon Credit Development</h4>
                        <p className="text-sm text-muted-foreground">
                          Creating verified carbon credits through sustainable technology projects
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Target className="w-3 h-3 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Government & Corporate Partnerships</h4>
                        <p className="text-sm text-muted-foreground">
                          Strategic collaborations to implement large-scale environmental initiatives
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Target className="w-3 h-3 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Technology Platform</h4>
                        <p className="text-sm text-muted-foreground">
                          Proprietary technology for tracking, verifying, and monetizing environmental assets
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose DevvStream */}
          <section className="py-12 md:py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Why Choose DevvStream
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                  Leading the environmental assets revolution with innovative technology solutions
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center space-y-3 p-6 rounded-lg bg-transparent border border-green-500/30">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                    <Leaf className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold">Proven Expertise</h3>
                  <p className="text-sm text-muted-foreground">
                    Deep experience in carbon markets and environmental asset development
                  </p>
                </div>
                
                <div className="text-center space-y-3 p-6 rounded-lg bg-transparent border border-green-500/30">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                    <Zap className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold">Technology-Driven</h3>
                  <p className="text-sm text-muted-foreground">
                    Innovative platform for efficient environmental asset management
                  </p>
                </div>
                
                <div className="text-center space-y-3 p-6 rounded-lg bg-transparent border border-green-500/30">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold">Strategic Partnerships</h3>
                  <p className="text-sm text-muted-foreground">
                    Collaborations with governments and corporations worldwide
                  </p>
                </div>
                
                <div className="text-center space-y-3 p-6 rounded-lg bg-transparent border border-green-500/30">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                    <Globe2 className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold">Global Impact</h3>
                  <p className="text-sm text-muted-foreground">
                    Contributing to environmental sustainability on a global scale
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Market Opportunity */}
          <section className="py-12 md:py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Growing Market Opportunity
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                  Positioned at the forefront of the rapidly expanding carbon markets and environmental assets sector
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <Card className="p-6 md:p-8 bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/30 rounded-2xl">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <LineChart className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold mb-2">Expanding Carbon Markets</h3>
                        <p className="text-muted-foreground">
                          Global carbon markets continue to grow as governments and corporations commit to net-zero emissions targets, creating significant demand for verified carbon credits.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 md:p-8 bg-gradient-to-br from-emerald-500/5 to-transparent border border-green-500/30 rounded-2xl">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <Globe2 className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold mb-2">Environmental Technology</h3>
                        <p className="text-muted-foreground">
                          Rising investment in green technology creates opportunities for innovative solutions in environmental asset development and management.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-muted/30 to-background">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
                Interested in Learning More?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8">
                Discover how DevvStream is transforming environmental asset development and carbon markets
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 bg-green-500 text-white hover:bg-green-600">
                  <a href="https://www.devvstream.com/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    Visit DevvStream
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2 border-green-500/30 hover:border-green-500/50">
                  <LanguageAwareLink to="/contact">
                    <Users className="w-4 h-4" />
                    Contact AmplifiX
                  </LanguageAwareLink>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default DevvStreamShowcase;
