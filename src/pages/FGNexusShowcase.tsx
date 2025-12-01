import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Wallet, Network, Award, Users } from "lucide-react";

const FGNexusShowcase = () => {
  useGTranslateRefresh(true);
  const thumbnailImage = "/lovable-uploads/fgnexus-logo.png";

  return (
    <>
      <Helmet>
        <title>FG Nexus Inc. (NASDAQ: FGNX) - The Ethereum Treasury Company | AmplifiX Showcase</title>
        <meta
          name="description"
          content="FG Nexus (NASDAQ: FGNX) - The Ethereum Treasury Company. ETH Accumulation, Yield Generation, and Real-World Asset Tokenization. Institutional access to Ethereum with staking yield and capital markets execution."
        />
        <meta name="keywords" content="FG Nexus, FGNX, Ethereum, ETH, Treasury Company, Staking, Tokenization, RWA, Blockchain, Cryptocurrency, Public Company" />
        <meta property="og:title" content="FG Nexus Inc. (NASDAQ: FGNX) - The Ethereum Treasury Company" />
        <meta property="og:description" content="Institutional access to Ethereum with staking yield and capital markets execution. Building the leading vehicle for ETH accumulation and on-chain yield generation." />
        <meta property="og:image" content={thumbnailImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FG Nexus Inc. (NASDAQ: FGNX) - The Ethereum Treasury Company" />
        <meta name="twitter:description" content="ETH Accumulation. Yield Generation. Real-World Asset Tokenization." />
        <meta name="twitter:image" content={thumbnailImage} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[#0A1929] via-[#1a2f4a] to-[#0f1f33]">
        <MainHeader />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/lovable-uploads/fgnexus-hero.jpg')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A1929]/50 to-[#0A1929]" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <img 
                src="/lovable-uploads/fgnexus-logo.png" 
                alt="FG Nexus Logo" 
                className="h-16 mx-auto mb-6"
              />
              <p className="text-highlight-blue text-sm font-semibold tracking-wider mb-4">NASDAQ: FGNX</p>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                The Ethereum<br />Treasury Company
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                ETH Accumulation. Yield Generation. Real-World Asset Tokenization.
              </p>
              <p className="text-lg text-gray-400 mb-10 max-w-4xl mx-auto leading-relaxed">
                We are building the leading capital market vehicle dedicated to accumulation and on-chain yield generation 
                for the next decade of Ethereum. This is Ethereum's MicroStrategy moment, but with staking yield, 
                programmable money, and RWA tokenization.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-highlight-blue hover:bg-highlight-blue/90 text-white px-8"
                  onClick={() => window.open('https://fgnexus.io/', '_blank')}
                >
                  Visit Website
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-highlight-blue text-highlight-blue hover:bg-highlight-blue/10"
                  onClick={() => window.open('https://finance.yahoo.com/quote/FGNX/', '_blank')}
                >
                  View Stock Price
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-highlight-blue mb-2">$270B</div>
                <div className="text-gray-300">Stablecoin Market on Ethereum</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-highlight-blue mb-2">3-4%</div>
                <div className="text-gray-300">Native Staking Yield</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-highlight-blue mb-2">66M+</div>
                <div className="text-gray-300">ETH Staked on Network</div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 px-6 bg-[#0f1f33]/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">About FG Nexus</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-highlight-blue mb-4">Our Mission</h3>
                <p className="text-gray-300 leading-relaxed">
                  FG Nexus (Nasdaq: FGNX) was created to give investors institutional access to ETH, 
                  the most productive reserve asset of the digital economy. Unlike static holdings of Bitcoin, 
                  Ethereum compounds: it generates native staking yield, secures stablecoins, and powers the 
                  settlement of tokenized assets and AI-driven applications.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-highlight-blue mb-4">Our Strategy</h3>
                <p className="text-gray-300 leading-relaxed">
                  Our strategy is disciplined and long-term: accumulate ETH, stake conservatively, and grow ETH per share. 
                  By leveraging capital markets, institutional custody, and deep domain expertise, we provide shareholders 
                  with exposure not just to ETH's price, but to the network's expanding role as the world's most important 
                  monetary and settlement asset.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-highlight-blue/20 to-transparent border border-highlight-blue/30 rounded-xl p-8 text-center">
              <p className="text-xl text-white leading-relaxed">
                FGNX is more than a treasury. We are a bridge between Ethereum and Wall Street, securing a growing share 
                of the network while positioning investors to benefit from the transformation of money, capital markets, 
                and global finance.
              </p>
            </div>
          </div>
        </section>

        {/* 5 Exponential Pillars */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">5 Exponential Pillars</h2>
            <p className="text-xl text-gray-400 mb-12 text-center">To compound ETH per share</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-highlight-blue/50 transition-colors">
                <TrendingUp className="h-12 w-12 text-highlight-blue mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Accumulate & Stake</h3>
                <p className="text-gray-300">
                  Provide a market-ready vehicle for U.S. institutions and policymakers to gain large-scale ETH exposure.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-highlight-blue/50 transition-colors">
                <Wallet className="h-12 w-12 text-highlight-blue mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Gateway for Capital</h3>
                <p className="text-gray-300">
                  Offer compliant, yield-enhanced ETH exposure through a NASDAQ-listed vehicle.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-highlight-blue/50 transition-colors">
                <Shield className="h-12 w-12 text-highlight-blue mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Stablecoin Settlement</h3>
                <p className="text-gray-300">
                  Support the rails behind billions in daily stablecoin transactions — reinforcing USD dominance.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-highlight-blue/50 transition-colors">
                <Network className="h-12 w-12 text-highlight-blue mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Infrastructure Layer</h3>
                <p className="text-gray-300">
                  Capture value as trillions in bonds, equities, and real assets migrate to Ethereum.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-highlight-blue/50 transition-colors">
                <Award className="h-12 w-12 text-highlight-blue mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Compound ETH</h3>
                <p className="text-gray-300">
                  Stake & restake for yield. Reinvest to grow ETH per share through capital markets flywheel.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-20 px-6 bg-[#0f1f33]/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">Leadership Team</h2>
            <p className="text-xl text-gray-400 mb-12 text-center">Digital asset pioneers and Wall Street dealmakers</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <Users className="h-10 w-10 text-highlight-blue mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Kyle Cerminara, CFA</h3>
                <p className="text-highlight-blue text-sm mb-3">Co-Founder, Chairman & CEO</p>
                <p className="text-gray-300 text-sm">
                  Former portfolio manager at T. Rowe Price and SAC. Public company CEO with decades of experience 
                  in fintech and financial services.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <Users className="h-10 w-10 text-highlight-blue mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Maja Vujinovic</h3>
                <p className="text-highlight-blue text-sm mb-3">CEO, Digital Assets</p>
                <p className="text-gray-300 text-sm">
                  Pioneer in mobile payments and early Bitcoin (since 2010). Led Tether's first bank acquisition. 
                  Former CIO of Emerging Tech at GE, launched blockchain pilots with JPMorgan.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <Users className="h-10 w-10 text-highlight-blue mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Joe Moglia</h3>
                <p className="text-highlight-blue text-sm mb-3">Co-Founder & Executive Advisor</p>
                <p className="text-gray-300 text-sm">
                  Former Chairman and CEO of TD Ameritrade. Grew TD Ameritrade from $700M to $20B+ market cap 
                  and sold to Charles Schwab.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <Users className="h-10 w-10 text-highlight-blue mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Larry Swets, CFA</h3>
                <p className="text-highlight-blue text-sm mb-3">CEO, Merchant Banking</p>
                <p className="text-gray-300 text-sm">
                  Hedge fund manager with 5+ years of industry leading returns. Advisor to $2B+ in family office capital.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <Users className="h-10 w-10 text-highlight-blue mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Theodore Rosenthal</h3>
                <p className="text-highlight-blue text-sm mb-3">President, Digital Assets</p>
                <p className="text-gray-300 text-sm">
                  30+ years in insurance industry. Founded Itasca Financial and sold to Kingsway Financial Services. 
                  Merchant banker and investor.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <Users className="h-10 w-10 text-highlight-blue mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Jose Vargas</h3>
                <p className="text-highlight-blue text-sm mb-3">Director, Senior Advisor</p>
                <p className="text-gray-300 text-sm">
                  Early investor in AI and crypto projects like Monero, Aave, Hyperliquid, and Maker. Frequent speaker 
                  at MOI Global.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Ethereum Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">Why Ethereum</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
                <div className="text-5xl font-bold text-highlight-blue mb-3">60%</div>
                <div className="text-gray-300">Of stablecoins run on Ethereum</div>
                <div className="text-sm text-gray-500 mt-2">$270B market</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
                <div className="text-5xl font-bold text-highlight-blue mb-3">90%+</div>
                <div className="text-gray-300">Of tokenized assets on Ethereum</div>
                <div className="text-sm text-gray-500 mt-2">Trillions moving on-chain</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
                <div className="text-5xl font-bold text-highlight-blue mb-3">750K+</div>
                <div className="text-gray-300">Weekly stablecoin users</div>
                <div className="text-sm text-gray-500 mt-2">New all-time high</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-white/5 to-transparent border border-white/10 rounded-xl p-8">
              <blockquote className="text-2xl text-white italic text-center">
                "Bitcoin is digital gold; Ethereum is digital infrastructure with cash flows."
              </blockquote>
            </div>
          </div>
        </section>

        {/* Investor Highlights */}
        <section className="py-20 px-6 bg-[#0f1f33]/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">Investor Highlights</h2>
            
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex items-start gap-4">
                <div className="bg-highlight-blue/20 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-highlight-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Pure ETH Exposure with Capital Markets Edge</h3>
                  <p className="text-gray-300">
                    Utilize ATM offerings, convertibles, and structured equity to accumulate ETH at scale. 
                    Capital markets flywheel enables exponential growth.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex items-start gap-4">
                <div className="bg-highlight-blue/20 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-highlight-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Staking Yield + DeFi Strategies</h3>
                  <p className="text-gray-300">
                    Outperform spot ETFs and BTC plays with 3-4% native staking yield and DeFi integration. 
                    Ethereum compounds through multiple revenue streams.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex items-start gap-4">
                <div className="bg-highlight-blue/20 p-3 rounded-lg">
                  <Network className="h-6 w-6 text-highlight-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Network-Aligned Growth</h3>
                  <p className="text-gray-300">
                    Support ETH burn mechanism, Layer 2 ecosystems, and institutional infrastructure. 
                    Position benefits from network effects and institutional adoption.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex items-start gap-4">
                <div className="bg-highlight-blue/20 p-3 rounded-lg">
                  <Award className="h-6 w-6 text-highlight-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Tokenization Upside</h3>
                  <p className="text-gray-300">
                    Future revenue from tokenized reinsurance, real-world assets, and merchant banking operations. 
                    Capital-light business model with high leverage to Ethereum growth.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex items-start gap-4">
                <div className="bg-highlight-blue/20 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-highlight-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Proven Leadership</h3>
                  <p className="text-gray-300">
                    Team with ETH roots since 2014 combined with Wall Street execution experience. 
                    12+ years at frontier of digital assets, grounded in traditional finance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">Our Partners</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <p className="text-white font-semibold">Anchorage Digital</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <p className="text-white font-semibold">BitGo</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <p className="text-white font-semibold">Galaxy Digital</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <p className="text-white font-semibold">Kraken</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-highlight-blue/20 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Us in Owning Ethereum's Next Decade
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              FGNX delivers active ETH exposure with staking yield, tokenization upside, and capital markets execution, 
              built to outperform ETFs, BTC vehicles, and passive crypto funds.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-highlight-blue hover:bg-highlight-blue/90 text-white px-8"
                onClick={() => window.open('https://fgnexus.io/', '_blank')}
              >
                Explore FG Nexus
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => window.open('https://finance.yahoo.com/quote/FGNX/', '_blank')}
              >
                View Investor Relations
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => window.open('/contact', '_self')}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </section>

        {/* Back to Showcase */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <Button 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => window.location.href = '/showcase'}
            >
              ← Back to Showcase
            </Button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default FGNexusShowcase;
