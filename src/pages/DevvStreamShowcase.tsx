import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { ExternalLink, TrendingUp, Leaf, Globe2, LineChart, Zap, Target, Users, Coins, Lock, Shield } from "lucide-react";
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
                  
                  <div className="flex gap-3 pt-4 justify-center">
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
                      <a href="https://www.devvstream.com/investors/corporate-presentation/" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        Presentation
                      </a>
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

          {/* Crypto Treasury Section */}
          <section className="py-12 md:py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-8 md:mb-12">
                <div className="inline-block px-4 py-2 bg-transparent border border-green-500/30 rounded-full mb-4">
                  <span className="text-green-500 font-semibold text-sm">Corporate Treasury Strategy</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Crypto Treasury Initiatives
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                  DevvStream has established a corporate crypto treasury combining institutional-grade liquidity with tokenization of real-world sustainability assets
                </p>
              </div>

              {/* Treasury Overview */}
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
                <Card className="bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/30">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <Coins className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3">Diversified Digital Assets</h3>
                        <p className="text-muted-foreground mb-4">
                          The treasury holds a strategic portfolio including Bitcoin (BTC), Solana (SOL), and the proprietary DevvE (DEVVE) token, designed to provide liquidity and align with sustainability missions.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-muted-foreground"><strong>Bitcoin:</strong> Foundational secure and liquid asset</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-muted-foreground"><strong>Solana:</strong> High-speed, low-fee transactions</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-muted-foreground"><strong>DevvE Token:</strong> Native asset bridging environmental assets</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-500/5 to-transparent border border-green-500/30">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <Target className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3">Strategic Purpose</h3>
                        <p className="text-muted-foreground mb-4">
                          The treasury aligns capital with the company&apos;s mission of funding sustainable infrastructure and tokenizing environmental assets like carbon credits.
                        </p>
                        <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                          <div className="text-2xl font-bold text-green-500 mb-1">$5.4M</div>
                          <p className="text-sm text-muted-foreground">Treasury value as of October 2025</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Treasury Management */}
              <div className="mb-8 p-6 md:p-8 bg-transparent border border-green-500/30 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-green-500" />
                  Institutional-Grade Management
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Qualified Custodian</h4>
                        <p className="text-sm text-muted-foreground">
                          BitGo Trust Company serves as the qualified custodian for digital assets, ensuring institutional-grade security and compliance
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <LineChart className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Treasury Consultant</h4>
                        <p className="text-sm text-muted-foreground">
                          FRNT Financial Inc. provides digital treasury consulting to ensure secure and compliant asset management
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Developments */}
              <div className="mb-8 p-6 md:p-8 bg-transparent border border-green-500/30 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6">Recent Treasury Developments</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-4 border-b border-border/50">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">DevvE Token Commitment (November 2025)</h4>
                      <p className="text-sm text-muted-foreground">
                        Announced plans to add more $DEVVE tokens to treasury with a commitment to purchase $3.54 million worth of tokens through 2027, solidifying long-term commitment to the native asset
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pb-4 border-b border-border/50">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Enhanced Financial Backing</h4>
                      <p className="text-sm text-muted-foreground">
                        Amended agreement with Helena Global Investment Opportunities 1 Ltd., raising commitment from $40 million to $300 million to support digital asset strategy
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Initial Treasury Establishment</h4>
                      <p className="text-sm text-muted-foreground">
                        Established corporate crypto treasury holding Bitcoin, Solana, and DevvE tokens with focus on institutional liquidity and sustainability asset tokenization
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* DevvE Token Details */}
              <div className="p-6 md:p-8 bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/30 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4">About the DevvE Token</h3>
                <p className="text-muted-foreground mb-6">
                  The DevvE token powers the DevvX network, a Layer-1 blockchain specifically built for environmental, social, and governance (ESG) initiatives. The network provides transparency, traceability, and scalability for measuring, verifying, and trading sustainability outcomes on-chain.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Zap className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Token Functionality</h4>
                        <p className="text-sm text-muted-foreground">
                          Used for transaction fuel, governance, and as the primary liquidity mechanism within DevvExchange for institutional use
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Network Features</h4>
                        <p className="text-sm text-muted-foreground">
                          Instant settlement, high energy efficiency, designed for institutional ESG initiatives
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Coins className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Token Availability</h4>
                        <p className="text-sm text-muted-foreground">
                          DevvE (DEVVE) can be purchased on decentralized exchanges (DEXs), including through the Binance Web3 Wallet
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Leaf className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">Environmental Bridge</h4>
                        <p className="text-sm text-muted-foreground">
                          Bridges environmental assets with blockchain infrastructure, enabling tokenization of carbon credits
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

          {/* Research Presentation Section */}
          <section id="research-section" className="py-12 md:py-20 px-4 bg-gradient-to-br from-muted/30 to-background">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <div className="inline-block px-4 py-2 bg-transparent border border-green-500/30 rounded-full mb-4">
                  <span className="text-green-500 font-semibold text-sm">AmplifiX Research</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                  Investment Research & Analysis
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                  Independent research report on DevvStream Corp.
                </p>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-2">
                  Positioned at the nexus of carbon markets and green technology innovation.
                </p>
                <p className="text-sm text-muted-foreground/70 mt-2">Date: January 15, 2025</p>
              </div>

              {/* Executive Summary */}
              <div className="mb-12 p-6 md:p-8 bg-transparent border border-green-500/30 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 text-green-500">Executive Summary</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  DevvStream Corp (NASDAQ: DEVS) is a publicly traded company specializing in carbon management and environmental-asset monetization, with recent strategic initiatives in digital assets and sustainability programs. The company works with governments and corporations globally to create verified carbon credits through sustainable technology initiatives.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  DevvStream has been actively expanding its digital-asset and cryptocurrency treasury, having invested in Bitcoin (BTC) and Solana (SOL) as part of a broader crypto program. Strategic initiatives include launching a $300M asset-backed digital infrastructure and sustainability strategy, strengthening its presence in carbon credit monetization across Asia and the Middle East.
                </p>
              </div>

              {/* Stock Analysis */}
              <div className="mb-12 p-6 md:p-8 bg-transparent border border-green-500/30 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 text-green-500">Stock Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The company's beta is 0.56, showing modest stock price sensitivity relative to the market. Investors considering DEVS should note its high risk-reward profile, including past share volatility, negative earnings, and ongoing strategic growth efforts. The company is positioned in a niche environmental-asset market intersecting with digital finance, which may offer unique upside potential but is subject to market and regulatory risks.
                </p>
              </div>

              {/* Investment Thesis */}
              <div className="mb-12">
                <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Investment Thesis</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6 md:p-8 bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/30 rounded-2xl">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">Expanding Carbon Markets</h4>
                          <p className="text-sm text-muted-foreground">
                            Global voluntary carbon markets projected to reach $50B+ by 2030 as governments and corporations commit to aggressive net-zero targets, creating significant demand for verified credits.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 md:p-8 bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/30 rounded-2xl">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">Technology-Driven Platform</h4>
                          <p className="text-sm text-muted-foreground">
                            Proprietary technology platform for tracking, verification, and monetization of environmental assets provides efficiency advantages and scalability compared to traditional methods.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 md:p-8 bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/30 rounded-2xl">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">Strategic Partnerships</h4>
                          <p className="text-sm text-muted-foreground">
                            Established relationships with government entities and large corporations provide project pipeline and validation for DevvStream's technology platform and approach.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 md:p-8 bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/30 rounded-2xl">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                          <Target className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">First-Mover Advantages</h4>
                          <p className="text-sm text-muted-foreground">
                            Early positioning in high-growth carbon markets and environmental asset development creates potential for substantial market share capture as industry matures.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Recent Developments */}
              <div className="mb-12 p-6 md:p-8 bg-transparent border border-green-500/30 rounded-2xl">
                <h3 className="text-2xl md:text-3xl font-bold mb-6">Recent Developments & Key Milestones</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 pb-4 border-b border-border/50">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">NASDAQ Compliance Restored</h4>
                      <p className="text-sm text-muted-foreground">
                        Regained compliance with NASDAQ listing requirements in August 2025, implementing a reverse stock split to manage share structure.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pb-4 border-b border-border/50">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Digital Asset & Crypto Treasury Expansion</h4>
                      <p className="text-sm text-muted-foreground">
                        Launched $300M asset-backed digital infrastructure and sustainability strategy, with investments in Bitcoin (BTC) and Solana (SOL) as part of broader crypto program.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pb-4 border-b border-border/50">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Southeast Asia Partnerships & MoUs</h4>
                      <p className="text-sm text-muted-foreground">
                        Partnerships and MoUs for waste-to-energy projects in Indonesia and other sustainability ventures across Southeast Asia.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pb-4 border-b border-border/50">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Joint Venture Formation</h4>
                      <p className="text-sm text-muted-foreground">
                        Formation of "Fayafi x DevvStream Green Ventures" to accelerate global sustainability investments.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Singapore Carbon Market & D-PIVOT Tool</h4>
                      <p className="text-sm text-muted-foreground">
                        Expansion into Singapore carbon market and partnerships promoting the D-PIVOT carbon offset tool across e-commerce platforms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategic Focus */}
              <div className="mb-12 p-6 md:p-8 bg-transparent border border-green-500/30 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 text-green-500">Strategic Focus</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  DevvStream's core focus integrates carbon management, digital asset investment, and environmental-asset monetization, with a forward-looking emphasis on:
                </p>
                <div className="space-y-3 text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <p className="text-sm">
                      Developing carbon-credit generation and monetization opportunities across global markets
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <p className="text-sm">
                      Leveraging digital infrastructure and crypto-treasury strategies to enhance liquidity and diversify assets
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <p className="text-sm">
                      Expanding internationally across Asia and the Middle East for energy and environmental projects
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial Scenarios */}
              <div className="mb-12">
                <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Revenue Scenarios (2025E-2028E)</h3>
                <p className="text-center text-sm text-muted-foreground mb-8">Scenario-based projections - all figures are assumptions, not company guidance</p>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-transparent border border-green-500/30 rounded-2xl">
                    <CardContent className="pt-6">
                      <div className="text-center mb-4">
                        <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full mb-2">
                          <span className="text-red-500 font-semibold text-sm">Bear Case</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">2025E</span>
                          <span className="font-semibold">$3-5M</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">2026E</span>
                          <span className="font-semibold">$8-12M</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">2027E</span>
                          <span className="font-semibold">$15-20M</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">2028E</span>
                          <span className="font-semibold">$25-35M</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">Slower project conversion & market headwinds</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 md:p-8 bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/30 rounded-2xl">
                    <CardContent className="pt-6">
                      <div className="text-center mb-4">
                        <div className="inline-block px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full mb-2">
                          <span className="text-green-500 font-semibold text-sm">Base Case</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">2025E</span>
                          <span className="font-semibold">$6-10M</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">2026E</span>
                          <span className="font-semibold">$15-25M</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">2027E</span>
                          <span className="font-semibold">$35-50M</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">2028E</span>
                          <span className="font-semibold">$70-100M</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">Steady project pipeline & partnership execution</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-transparent border border-green-500/30 rounded-2xl">
                    <CardContent className="pt-6">
                      <div className="text-center mb-4">
                        <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-2">
                          <span className="text-emerald-500 font-semibold text-sm">Bull Case</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">2025E</span>
                          <span className="font-semibold">$12-18M</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">2026E</span>
                          <span className="font-semibold">$30-45M</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">2027E</span>
                          <span className="font-semibold">$70-100M</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">2028E</span>
                          <span className="font-semibold">$150-200M</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">Accelerated carbon market growth & major partnerships</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="mb-12 p-6 md:p-8 bg-transparent border border-green-500/30 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-center">Key Investment Metrics</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4">
                    <div className="text-3xl font-bold text-green-500 mb-2">$50B+</div>
                    <p className="text-sm text-muted-foreground">Projected voluntary carbon market size by 2030</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-3xl font-bold text-green-500 mb-2">~30%</div>
                    <p className="text-sm text-muted-foreground">Expected CAGR for carbon markets through 2030</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-3xl font-bold text-green-500 mb-2">Tech-Enabled</div>
                    <p className="text-sm text-muted-foreground">Proprietary platform for asset monetization</p>
                  </div>
                </div>
              </div>

              {/* Risk Factors */}
              <div className="mb-12 p-6 md:p-8 bg-transparent border border-green-500/30 rounded-2xl">
                <h3 className="text-2xl font-bold mb-4 text-green-500">Key Risk Factors</h3>
                <div className="space-y-3 text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <p className="text-sm">
                      <strong>High risk-reward profile:</strong> Past share volatility, negative earnings, and ongoing strategic growth efforts create elevated investment risk
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <p className="text-sm">
                      <strong>Market volatility:</strong> Carbon credit prices and cryptocurrency holdings subject to regulatory changes and market dynamics
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <p className="text-sm">
                      <strong>Project execution:</strong> Success depends on converting partnerships into revenue-generating projects across multiple geographies
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <p className="text-sm">
                      <strong>Competition:</strong> Growing interest in carbon markets attracting established players and new entrants
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <p className="text-sm">
                      <strong>Regulatory environment:</strong> Changes in carbon market and cryptocurrency regulations could significantly impact business model
                    </p>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="text-center text-xs text-muted-foreground/70 border-t border-border/50 pt-6">
                <p className="mb-2">
                  <strong>Important Disclaimer:</strong> This research is provided for informational purposes only and does not constitute investment advice, a recommendation, or an offer to buy or sell any securities.
                </p>
                <p>
                  All projections and scenarios presented are assumptions based on publicly available information and independent analysis. Actual results may differ materially. Past performance is not indicative of future results. Investors should conduct their own due diligence and consult with financial advisors before making investment decisions.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-background to-muted/20">
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
