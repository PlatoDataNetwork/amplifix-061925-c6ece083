import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { ExternalLink, Leaf, Shield, Zap, Globe2, Coins, LineChart, Users, Play } from "lucide-react";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";
import { useLanguage } from "@/hooks/useLanguage";

const CutEcoShowcase = () => {
  useLanguage();
  useGTranslateRefresh(true, []);

  return (
    <>
      <Helmet>
        <title>CUT - Carbon Utility Token | Blockchain Carbon Offsets | AmplifiX Showcase</title>
        <meta 
          name="description" 
          content="CUT is a blockchain-based carbon offset solution that has tokenized over 500,000 tonnes of carbon offsets. Purchase and retire certified carbon offsets with trusted and transparent climate impact." 
        />
        <meta 
          name="keywords" 
          content="CUT, Carbon Utility Token, carbon offsets, blockchain, cryptocurrency, carbon credits, climate impact, sustainability, tokenized carbon" 
        />
        <meta property="og:title" content="CUT - Carbon Utility Token | Blockchain Carbon Offsets | AmplifiX" />
        <meta 
          property="og:description" 
          content="Blockchain-based carbon offset solution with over 500,000 tonnes of tokenized carbon offsets." 
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CUT - Carbon Utility Token" />
        <meta 
          name="twitter:description" 
          content="Purchase and retire certified carbon offsets using blockchain technology." 
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
                    <p className="text-green-500 font-semibold mb-2 text-sm md:text-base">Carbon Utility Token</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 pb-2 md:pb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Blockchain Carbon Offsets
                    </h1>
                    <p className="text-base md:text-xl text-muted-foreground">
                      CUT tokenizes certified carbon offsets,<br />
                      making climate action accessible through<br />
                      blockchain technology. Purchase and retire<br />
                      carbon credits with trusted and transparent<br />
                      climate impact.
                    </p>
                  </div>
                </div>
                <div className="space-y-12">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-transparent rounded-2xl blur-xl" />
                    <div className="relative rounded-2xl shadow-2xl w-full h-64 md:h-80 bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center border border-green-500/20">
                      <Coins className="w-32 h-32 text-green-500/40" />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button asChild size="default" className="gap-2 bg-green-500 text-white hover:bg-green-600">
                      <a href="https://app.cut.eco/" target="_blank" rel="noopener noreferrer">
                        <Coins className="w-4 h-4" />
                        Retire CUT
                      </a>
                    </Button>
                    <Button asChild size="default" className="gap-2 bg-green-500 text-white hover:bg-green-600">
                      <a href="https://cut.eco/" target="_blank" rel="noopener noreferrer">
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

          {/* Video Section */}
          <section className="py-12 md:py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  CUT, the Carbon Utility Token Explained
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                  Learn how blockchain technology is revolutionizing carbon offsetting
                </p>
              </div>
              
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-green-500/20">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/G28orfRbCR8"
                  title="CUT, the Carbon Utility Token explained"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0"
                />
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section className="py-12 md:py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Trusted and Transparent Climate Impact
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                  How CUT offsets are different
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-8">
                <Card className="bg-transparent border-green-500/30 hover:border-green-500/50 transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Certified Offsets</h3>
                    <p className="text-muted-foreground">
                      Our pool consists of certified removal and destruction of carbon by landfill gas and biomass projects.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-transparent border-green-500/30 hover:border-green-500/50 transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                      <Coins className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Blockchain Technology</h3>
                    <p className="text-muted-foreground">
                      Tokenized carbon offsets on blockchain for transparent, immutable tracking and verification.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-transparent border-green-500/30 hover:border-green-500/50 transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                      <LineChart className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Measurable Impact</h3>
                    <p className="text-muted-foreground">
                      Over 500,000 tonnes of carbon offsets tokenized, creating real, verifiable climate impact.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-12 md:py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-transparent rounded-2xl blur-xl" />
                  <div className="relative rounded-2xl shadow-2xl w-full h-64 md:h-80 bg-gradient-to-br from-emerald-500/10 to-green-500/10 flex items-center justify-center border border-green-500/20">
                    <Leaf className="w-32 h-32 text-green-500/40" />
                  </div>
                </div>
                <div className="space-y-4 md:space-y-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                    Carbon Utility Token
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground">
                    Working with independent power producers
                  </p>
                  <p className="text-muted-foreground">
                    CUT sources carbon offsets and makes them available as blockchain tokens. Each token represents one tonne of CO2 equivalent that has been removed or prevented from entering the atmosphere through certified projects.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Zap className="w-3 h-3 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Landfill Gas Projects</h4>
                        <p className="text-sm text-muted-foreground">
                          Capturing methane emissions from landfills and converting them to clean energy
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Zap className="w-3 h-3 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Biomass Energy</h4>
                        <p className="text-sm text-muted-foreground">
                          Converting organic waste into renewable energy and preventing carbon emissions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Zap className="w-3 h-3 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Blockchain Transparency</h4>
                        <p className="text-sm text-muted-foreground">
                          Every transaction recorded on-chain for full accountability and traceability
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose CUT */}
          <section className="py-12 md:py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Why Choose CUT
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                  Leading the blockchain carbon offset revolution with verified, transparent climate solutions
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center space-y-3 p-6 rounded-lg bg-transparent border border-green-500/30">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold">Verified Projects</h3>
                  <p className="text-sm text-muted-foreground">
                    All offsets sourced from certified landfill gas and biomass projects
                  </p>
                </div>
                
                <div className="text-center space-y-3 p-6 rounded-lg bg-transparent border border-green-500/30">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                    <Coins className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold">Blockchain-Based</h3>
                  <p className="text-sm text-muted-foreground">
                    Immutable, transparent tracking on blockchain technology
                  </p>
                </div>
                
                <div className="text-center space-y-3 p-6 rounded-lg bg-transparent border border-green-500/30">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                    <LineChart className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold">Proven Impact</h3>
                  <p className="text-sm text-muted-foreground">
                    Over 500,000 tonnes of carbon offsets tokenized and tracked
                  </p>
                </div>
                
                <div className="text-center space-y-3 p-6 rounded-lg bg-transparent border border-green-500/30">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                    <Globe2 className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold">Global Partnerships</h3>
                  <p className="text-sm text-muted-foreground">
                    Collaborating with leading blockchain platforms like Arbitrum
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-12 md:py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Making a Real Impact
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                  Quantifiable results in the fight against climate change
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                <Card className="p-6 md:p-8 bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/30 rounded-2xl text-center">
                  <CardContent className="pt-6">
                    <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">500,000+</div>
                    <p className="text-muted-foreground">Tonnes of Carbon Offsets Tokenized</p>
                  </CardContent>
                </Card>

                <Card className="p-6 md:p-8 bg-gradient-to-br from-emerald-500/5 to-transparent border border-green-500/30 rounded-2xl text-center">
                  <CardContent className="pt-6">
                    <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">100%</div>
                    <p className="text-muted-foreground">Certified and Verified Projects</p>
                  </CardContent>
                </Card>

                <Card className="p-6 md:p-8 bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/30 rounded-2xl text-center">
                  <CardContent className="pt-6">
                    <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">Transparent</div>
                    <p className="text-muted-foreground">Blockchain-Verified Transactions</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-muted/30 to-background">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">
                Ready to Offset Your Carbon Footprint?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8">
                Join the blockchain carbon revolution and make a measurable impact on climate change
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 bg-green-500 text-white hover:bg-green-600">
                  <a href="https://app.cut.eco/" target="_blank" rel="noopener noreferrer">
                    <Coins className="w-4 h-4" />
                    Retire CUT Tokens
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2 border-green-500/30 hover:border-green-500/50">
                  <a href="https://cut.eco/contact" target="_blank" rel="noopener noreferrer">
                    <Users className="w-4 h-4" />
                    Partner with CUT
                  </a>
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

export default CutEcoShowcase;
