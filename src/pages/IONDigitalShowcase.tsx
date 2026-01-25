import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { ExternalLink, Users, Coins, Shield, Blocks, Globe, Zap, Lock, FileCheck, Landmark, TrendingUp, Gem } from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";
import { useLanguage } from "@/hooks/useLanguage";

const IONDigitalShowcase = () => {
  useLanguage();
  useGTranslateRefresh(true, []);
  
  return (
    <>
      <Helmet>
        <title>I-ON Digital Corp - RWA Tokenization & Digital Gold | AmplifiX</title>
        <meta name="description" content="I-ON Digital Corp digitizes and tokenizes real-world assets, primarily in-situ gold, into fully compliant, blockchain-backed digital securities. ION.au bridges TradFi and DeFi." />
        <meta name="keywords" content="I-ON Digital, IONI, RWA tokenization, digital gold, ION.au, blockchain securities, TradFi, DeFi, tokenized gold" />
        <meta property="og:title" content="I-ON Digital Corp - RWA Tokenization & Digital Gold" />
        <meta property="og:description" content="Tokenizing real-world gold assets into blockchain-backed digital securities with ION.au." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/showcase/ion-digital" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="I-ON Digital Corp - IONI" />
        <meta name="twitter:description" content="Bridging TradFi and DeFi with tokenized gold and RWA securities." />
        <link rel="canonical" href="https://amplifix.ai/showcase/ion-digital" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />

        {/* Hero Section */}
        <section className="pt-24 container mx-auto py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-highlight-blue/10 px-6 py-3 rounded-full mb-6">
                <Coins className="h-6 w-6 text-highlight-blue" />
                <span className="text-highlight-blue font-semibold">OTC:IONI</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">RWA Tokenization & Fintech</span>
              </div>
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  I-ON Digital Corp
                  <span className="text-highlight-blue block">Tokenizing Real-World Assets</span>
                </h1>
              </div>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto">
                Digitizing and tokenizing real-world assets, primarily in-situ gold, into fully compliant, 
                blockchain-backed digital securities. ION.au bridges TradFi and DeFi with institutional-grade security.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button asChild size="lg" className="bg-highlight-blue hover:bg-highlight-blue/90 text-white">
                  <a href="https://iondigitalcorp.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="https://www.bing.com/copilotsearch?q=IONI+I-ON%20Digital+Tokenization" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    AmplifiX Search
                  </a>
                </Button>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-highlight-blue mb-2">ION.au</div>
                  <p className="text-muted-foreground text-sm">Digital Gold</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-highlight-blue mb-2">RWA</div>
                  <p className="text-muted-foreground text-sm">Real World Assets</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-highlight-blue mb-2">100%</div>
                  <p className="text-muted-foreground text-sm">Compliant Securities</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-highlight-blue mb-2">24/7</div>
                  <p className="text-muted-foreground text-sm">Trading Access</p>
                </div>
              </div>

              {/* Key Features Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Gem className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Gold Tokenization</h3>
                  <p className="text-muted-foreground text-sm mt-2">In-situ gold converted to digital securities</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Shield className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Institutional Grade</h3>
                  <p className="text-muted-foreground text-sm mt-2">Fully compliant with securities regulations</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Blocks className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Blockchain-Backed</h3>
                  <p className="text-muted-foreground text-sm mt-2">Immutable ownership and transparent tracking</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ION.au Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">ION.au - Digital Gold Standard</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  The flagship asset bridging traditional finance and decentralized infrastructure
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="bg-card border rounded-lg p-8">
                  <Gem className="h-10 w-10 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">In-Situ Gold Tokenization</h3>
                  <p className="text-muted-foreground">
                    Converting proven gold reserves into blockchain-backed digital tokens. Each ION.au token 
                    represents real gold assets, providing intrinsic value backed by physical commodities.
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-8">
                  <Shield className="h-10 w-10 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">Regulatory Compliance</h3>
                  <p className="text-muted-foreground">
                    Fully compliant digital securities meeting institutional requirements. Built to operate 
                    within established regulatory frameworks while leveraging blockchain efficiency.
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-8">
                  <Landmark className="h-10 w-10 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">TradFi Integration</h3>
                  <p className="text-muted-foreground">
                    Bridging traditional financial systems with blockchain technology. Enabling institutional 
                    investors to access tokenized gold through familiar investment structures.
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-8">
                  <Blocks className="h-10 w-10 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-highlight-blue">DeFi Accessibility</h3>
                  <p className="text-muted-foreground">
                    Unlocking decentralized finance opportunities for gold-backed assets. 24/7 trading, 
                    fractional ownership, and global accessibility without traditional barriers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Institutional-Grade Infrastructure</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Enterprise security and compliance for digital asset management
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Lock className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Security</h3>
                  <p className="text-muted-foreground">
                    Enterprise-grade custody and asset protection
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <FileCheck className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Compliance</h3>
                  <p className="text-muted-foreground">
                    Full regulatory compliance for securities laws
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Global Access</h3>
                  <p className="text-muted-foreground">
                    Worldwide investment opportunities through tokenization
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Liquidity</h3>
                  <p className="text-muted-foreground">
                    Enhanced trading liquidity for traditionally illiquid assets
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Thesis Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Investment Thesis</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                I-ON Digital is positioned at the convergence of three major market trends: the tokenization of 
                real-world assets, the growing demand for gold exposure, and the institutional adoption of 
                blockchain technology. ION.au offers a compliant pathway for investors seeking gold-backed 
                digital assets with the efficiency of blockchain settlement.
              </p>
              <div className="flex justify-center gap-8 flex-wrap">
                <div className="text-center">
                  <div className="text-2xl font-bold text-highlight-blue">$16T+</div>
                  <p className="text-sm text-muted-foreground">Projected RWA Market by 2030</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-highlight-blue">$13T+</div>
                  <p className="text-sm text-muted-foreground">Global Gold Market</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-highlight-blue">100%</div>
                  <p className="text-sm text-muted-foreground">Asset-Backed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-primary to-primary-variant text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                The Future of Gold is Digital
              </h2>
              <p className="text-xl mb-8 opacity-90">
                I-ON Digital Corp is pioneering the tokenization of precious metals, creating new 
                opportunities for investors to access gold-backed digital securities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <a href="https://iondigitalcorp.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Learn More
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
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

export default IONDigitalShowcase;
