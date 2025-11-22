import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { ExternalLink, Users, Sparkles, Shield, Star, TrendingUp } from "lucide-react";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";

const FAIMShowcase = () => {
  useGTranslateRefresh(true);

  return (
    <>
      <Helmet>
        <title>FAIM - Celebrity Fan Engagement Platform | AmplifiX Showcase</title>
        <meta 
          name="description" 
          content="FAIM is disrupting the collectible card and autograph markets with a unique celebrity portal connecting fans to fame through digital collectibles, AI avatars, and authentic engagement." 
        />
        <meta 
          name="keywords" 
          content="FAIM, celebrity engagement, digital collectibles, NFT, autographs, fan platform, AI avatars, blockchain authentication" 
        />
        <meta property="og:title" content="FAIM - Celebrity Fan Engagement Platform | AmplifiX" />
        <meta 
          property="og:description" 
          content="A fusion of fans and fame. Digital collectibles, custom signed selfies, AI technologies bringing you closer to your favorite stars." 
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/lovable-uploads/faim-thumbnail.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAIM - Celebrity Fan Engagement Platform" />
        <meta 
          name="twitter:description" 
          content="Connecting fans to fame through digital collectibles and authentic celebrity interactions." 
        />
        <meta name="twitter:image" content="/lovable-uploads/faim-thumbnail.png" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
        <MainHeader />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-12 md:py-20 px-4 overflow-visible">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-amber-500/5" />
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <p className="text-purple-500 font-semibold mb-2 text-sm md:text-base">A FUSION OF FANS AND FAME</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 pb-2 md:pb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Connecting You to Fame Like No One Else
                    </h1>
                    <p className="text-base md:text-xl text-muted-foreground">
                      The unique celebrity portal that bridges the<br />
                      gap between fans and celebrities through<br />
                      exclusive digital collectibles, custom signed<br />
                      selfies, AI technologies, and intimate<br />
                      interactions.
                    </p>
                  </div>
                </div>
                <div className="space-y-12">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-2xl blur-xl" />
                    <div className="relative rounded-2xl shadow-2xl w-full h-64 md:h-80 bg-gradient-to-br from-purple-500/10 to-amber-500/10 flex items-center justify-center border border-purple-500/20 overflow-hidden">
                      <img 
                        src="/lovable-uploads/faim-thumbnail.png" 
                        alt="FAIM Platform"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4 justify-center">
                    <Button asChild size="default" className="gap-2 bg-purple-500 text-white hover:bg-purple-600">
                      <a href="https://www.faim.world/" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        Visit Website
                      </a>
                    </Button>
                    <Button 
                      size="default" 
                      className="gap-2 bg-purple-500 text-white hover:bg-purple-600"
                      onClick={() => document.getElementById('presentation-section')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Presentation
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Company Overview */}
          <section className="py-12 md:py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">About FAIM</h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                  Disrupting the collectible card and autograph markets
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
                <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-purple-500" />
                      Our Mission
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      FAIM is building an asset class that is timeless for clients and investors. Our fan engagement 
                      platform extends beyond creating "Memories for Life" to fostering supportive "Fans for Life" 
                      through authentic, blockchain-verified interactions.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-500" />
                      Authenticity First
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We authenticate celebrities and influencers at every touchpoint. Blockchain creates an audit 
                      trail and provenance to ensure fans and supporters are getting the real deal, not bots or 
                      impersonal AI interactions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Platform Features */}
          <section className="py-12 md:py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Platform Features</h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                  Access all assets - No one unlocks more exclusive experiences than FAIM
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-purple-500/20 hover:border-purple-500/40 transition-all">
                  <CardContent className="p-6">
                    <Sparkles className="w-10 h-10 text-purple-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Digital Collectibles</h3>
                    <p className="text-muted-foreground">
                      Exclusive imagery and energy that creates sought-after cyberspace trading cards with 
                      verified authenticity.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-500/20 hover:border-purple-500/40 transition-all">
                  <CardContent className="p-6">
                    <Users className="w-10 h-10 text-purple-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Celebrity AI Avatars</h3>
                    <p className="text-muted-foreground">
                      Artificial intelligence brings dazzling avatars to life, creating endless possibilities for 
                      fan engagement.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-500/20 hover:border-purple-500/40 transition-all">
                  <CardContent className="p-6">
                    <Star className="w-10 h-10 text-purple-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Digital Autographs</h3>
                    <p className="text-muted-foreground">
                      Via Selfie.live - receive personalized digital messages and autographs directly from your 
                      favorite celebrities.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-500/20 hover:border-purple-500/40 transition-all">
                  <CardContent className="p-6">
                    <Shield className="w-10 h-10 text-purple-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Fan Domains</h3>
                    <p className="text-muted-foreground">
                      Create personalized websites bearing the name of your preferred star with FAIM's unique 
                      technology.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-500/20 hover:border-purple-500/40 transition-all">
                  <CardContent className="p-6">
                    <Shield className="w-10 h-10 text-purple-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Digital Storage Vaults</h3>
                    <p className="text-muted-foreground">
                      Secure storage for your digital collectibles and memorabilia with blockchain-verified 
                      ownership.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-500/20 hover:border-purple-500/40 transition-all">
                  <CardContent className="p-6">
                    <TrendingUp className="w-10 h-10 text-purple-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Asset Class Value</h3>
                    <p className="text-muted-foreground">
                      Building a timeless asset class through authenticated, verifiable celebrity memorabilia and 
                      interactions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Investment Opportunity */}
          <section className="py-12 md:py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Investment Opportunity</h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                  Pre-Seed Round Details
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm text-center">
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">Raising</p>
                    <p className="text-3xl font-bold text-purple-500">$500k</p>
                    <p className="text-sm text-muted-foreground mt-2">Pre-Seed Round</p>
                  </CardContent>
                </Card>

                <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm text-center">
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">Valuation</p>
                    <p className="text-3xl font-bold text-purple-500">$5.0M</p>
                    <p className="text-sm text-muted-foreground mt-2">Company Value</p>
                  </CardContent>
                </Card>

                <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm text-center">
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">Instrument</p>
                    <p className="text-3xl font-bold text-purple-500">SAFE</p>
                    <p className="text-sm text-muted-foreground mt-2">Token Match at Seed</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12 max-w-3xl mx-auto">
                <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-center">Use of Funds</h3>
                    <div className="space-y-3 text-muted-foreground">
                      <p className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span>Develop momentum in client acquisition and revenue generation</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span>Expand technology stack with new features and products</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span>Scale celebrity partnerships across sports, entertainment, and emerging talent</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span>Enhance blockchain authentication and digital asset infrastructure</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Target Markets */}
          <section className="py-12 md:py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Target Markets</h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                  Expanding across multiple verticals
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-purple-500/20 hover:border-purple-500/40 transition-all">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-semibold mb-3">Professional Sports</h3>
                    <p className="text-muted-foreground">
                      NFL, NBA, MLB, NHL, MLS, and international professional athletes
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-500/20 hover:border-purple-500/40 transition-all">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-semibold mb-3">College & Emerging</h3>
                    <p className="text-muted-foreground">
                      College athletes, semi-pro, and emerging talent across all sports
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-500/20 hover:border-purple-500/40 transition-all">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-semibold mb-3">Entertainment</h3>
                    <p className="text-muted-foreground">
                      Musicians, actors, influencers, and content creators across platforms
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Investor Presentation Section */}
          <section id="presentation-section" className="py-12 md:py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Business Presentation
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                  View our latest corporate presentation
                </p>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-purple-500/30 bg-card">
                <object
                  data="/documents/faim-presentation.pdf"
                  type="application/pdf"
                  className="w-full h-[600px] md:h-[800px]"
                  aria-label="FAIM Business Presentation"
                >
                  <div className="p-6 text-center space-y-4">
                    <p className="text-muted-foreground">
                      Your browser doesn't support embedded PDFs. Please download the FAIM presentation to view it.
                    </p>
                    <Button asChild>
                      <a href="/documents/faim-presentation.pdf" download>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Download Presentation
                      </a>
                    </Button>
                  </div>
                </object>
              </div>
              
              <div className="text-center mt-6">
                <Button asChild size="default" className="gap-2 bg-purple-500 text-white hover:bg-purple-600">
                  <a href="/documents/faim-presentation.pdf" download>
                    <ExternalLink className="w-4 h-4" />
                    Download PDF
                  </a>
                </Button>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 md:py-20 px-4">
            <div className="container mx-auto max-w-4xl text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-amber-500/20 rounded-3xl blur-3xl" />
                <div className="relative bg-card/50 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 md:p-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                    Join the FAIM Fans' Revolution
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Engage directly with fame through our exclusive digital collectibles and intimate celebrity interactions
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button asChild size="lg" className="gap-2 bg-purple-500 text-white hover:bg-purple-600">
                      <a href="https://www.faim.world/" target="_blank" rel="noopener noreferrer">
                        <Users className="w-5 h-5" />
                        Explore FAIM
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="gap-2">
                      <LanguageAwareLink to="/contact">
                        Learn More About Partnership
                      </LanguageAwareLink>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FAIMShowcase;
