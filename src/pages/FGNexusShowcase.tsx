import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Wallet, Network, Award, Users, FileText, Building2 } from "lucide-react";

const FGNexusShowcase = () => {
  useGTranslateRefresh(true);
  const thumbnailImage = "/lovable-uploads/fgnexus-icon.jpeg";

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

      <div className="min-h-screen bg-black">
        <MainHeader />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <img 
                src="/lovable-uploads/fgnexus-icon.jpeg" 
                alt="FG Nexus Logo" 
                className="h-24 w-24 mx-auto mb-6 rounded-xl"
              />
              <p className="text-cyan-400 text-sm font-semibold tracking-widest mb-4">NASDAQ: FGNX</p>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                <span className="text-blue-500">The Ethereum</span><br />Treasury Company
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                <span className="text-cyan-400">ETH Accumulation.</span> <span className="text-blue-400">Yield Generation.</span> <span className="text-purple-400">Real-World Asset Tokenization.</span>
              </p>
              <p className="text-lg text-gray-400 mb-10 max-w-4xl mx-auto leading-relaxed">
                We are building the leading capital market vehicle dedicated to accumulation and on-chain yield generation 
                for the next decade of Ethereum. This is Ethereum's MicroStrategy moment, but with staking yield, 
                programmable money, and RWA tokenization.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8 shadow-lg shadow-cyan-500/50"
                  onClick={() => window.open('https://fgnexus.io/', '_blank')}
                >
                  Visit Website
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
                  onClick={() => window.open('https://finance.yahoo.com/quote/FGNX/', '_blank')}
                >
                  View Stock Price
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
                  onClick={() => window.open('https://fgnexus.io/investor-relations/', '_blank')}
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Investor Deck
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-16 max-w-md mx-auto">
              <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 rounded-xl p-6 text-center hover:border-cyan-500/60 transition-colors">
                <div className="text-4xl font-bold text-cyan-400 mb-2">$270B</div>
                <div className="text-gray-300">Stablecoin Market on Ethereum</div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 px-6 bg-black/95">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-12 text-center">About FG Nexus</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/20 rounded-xl p-8 hover:border-cyan-500/40 transition-colors">
                <h3 className="text-2xl font-bold text-cyan-400 mb-4">Our Mission</h3>
                <p className="text-gray-300 leading-relaxed">
                  FG Nexus (Nasdaq: FGNX) was created to give investors institutional access to ETH, 
                  the most productive reserve asset of the digital economy. Unlike static holdings of Bitcoin, 
                  Ethereum compounds: it generates native staking yield, secures stablecoins, and powers the 
                  settlement of tokenized assets and AI-driven applications.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-xl p-8 hover:border-blue-500/40 transition-colors">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">Our Strategy</h3>
                <p className="text-gray-300 leading-relaxed">
                  Our strategy is disciplined and long-term: accumulate ETH, stake conservatively, and grow ETH per share. 
                  By leveraging capital markets, institutional custody, and deep domain expertise, we provide shareholders 
                  with exposure not just to ETH's price, but to the network's expanding role as the world's most important 
                  monetary and settlement asset.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-8 text-center">
              <p className="text-xl text-white leading-relaxed">
                FGNX is more than a treasury. We are a bridge between Ethereum and Wall Street, securing a growing share 
                of the network while positioning investors to benefit from the transformation of money, capital markets, 
                and global finance.
              </p>
            </div>
          </div>
        </section>

        {/* 6 Exponential Pillars */}
        <section className="py-20 px-6 bg-black">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4 text-center">6 Exponential Pillars</h2>
            <p className="text-xl text-gray-400 mb-12 text-center">To compound ETH per share</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/60 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
                <TrendingUp className="h-12 w-12 text-cyan-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Strategic U.S. Reserve Asset</h3>
                <p className="text-gray-300">
                  Provide a market-ready vehicle for U.S. institutions and policymakers to gain large-scale ETH exposure.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/60 transition-all hover:shadow-lg hover:shadow-blue-500/20">
                <Wallet className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Gateway for Institutional Capital</h3>
                <p className="text-gray-300">
                  Offer compliant, yield-enhanced ETH exposure through a NASDAQ-listed vehicle.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/20">
                <Shield className="h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Stablecoin Settlement Layer</h3>
                <p className="text-gray-300">
                  Support the rails behind billions in daily stablecoin transactions — reinforcing USD dominance.
                </p>
              </div>

              <div className="bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/60 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
                <Network className="h-12 w-12 text-cyan-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Infrastructure Layer</h3>
                <p className="text-gray-300">
                  Capture value as trillions in bonds, equities, and real assets migrate to Ethereum.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/60 transition-all hover:shadow-lg hover:shadow-blue-500/20">
                <Award className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Compound ETH per Share</h3>
                <p className="text-gray-300">
                  Stake & restake for yield. Reinvest to grow ETH per share through capital markets flywheel.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/20">
                <Building2 className="h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Tokenization Services</h3>
                <p className="text-gray-300">
                  Generate revenue from tokenizing financial services, insurance, and real-world assets on Ethereum infrastructure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-20 px-6 bg-black/95">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4 text-center">Leadership Team</h2>
            <p className="text-xl text-gray-400 mb-12 text-center">Digital asset pioneers and Wall Street dealmakers</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-colors">
                <Users className="h-10 w-10 text-cyan-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Kyle Cerminara, CFA</h3>
                <p className="text-cyan-400 text-sm mb-3">Co-Founder, Chairman & CEO</p>
                <p className="text-gray-300 text-sm">
                  Former portfolio manager at T. Rowe Price and SAC. Public company CEO with decades of experience 
                  in fintech and financial services.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-colors">
                <Users className="h-10 w-10 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Maja Vujinovic</h3>
                <p className="text-blue-400 text-sm mb-3">CEO, Digital Assets</p>
                <p className="text-gray-300 text-sm">
                  Pioneer in mobile payments and early Bitcoin (since 2010). Led Tether's first bank acquisition. 
                  Former CIO of Emerging Tech at GE, launched blockchain pilots with JPMorgan.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-colors">
                <Users className="h-10 w-10 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Joe Moglia</h3>
                <p className="text-purple-400 text-sm mb-3">Co-Founder & Executive Advisor</p>
                <p className="text-gray-300 text-sm">
                  Former Chairman and CEO of TD Ameritrade. Grew TD Ameritrade from $700M to $20B+ market cap 
                  and sold to Charles Schwab.
                </p>
              </div>

              <div className="bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-colors">
                <Users className="h-10 w-10 text-cyan-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Larry Swets, CFA</h3>
                <p className="text-cyan-400 text-sm mb-3">CEO, Merchant Banking</p>
                <p className="text-gray-300 text-sm">
                  Hedge fund manager with 5+ years of industry leading returns. Advisor to $2B+ in family office capital.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-colors">
                <Users className="h-10 w-10 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Theodore Rosenthal</h3>
                <p className="text-blue-400 text-sm mb-3">President, Digital Assets</p>
                <p className="text-gray-300 text-sm">
                  30+ years in insurance industry. Founded Itasca Financial and sold to Kingsway Financial Services. 
                  Merchant banker and investor.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-colors">
                <Users className="h-10 w-10 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Jose Vargas</h3>
                <p className="text-purple-400 text-sm mb-3">Director, Senior Advisor</p>
                <p className="text-gray-300 text-sm">
                  Early investor in AI and crypto projects like Monero, Aave, Hyperliquid, and Maker. Frequent speaker 
                  at MOI Global.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Ethereum Section */}
        <section className="py-20 px-6 bg-black">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-12 text-center">Why Ethereum</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/20 rounded-xl p-8 text-center hover:border-cyan-500/40 transition-colors">
                <div className="text-5xl font-bold text-cyan-400 mb-3">60%</div>
                <div className="text-gray-300">Of stablecoins run on Ethereum</div>
                <div className="text-sm text-gray-500 mt-2">$270B market</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-xl p-8 text-center hover:border-blue-500/40 transition-colors">
                <div className="text-5xl font-bold text-blue-400 mb-3">90%+</div>
                <div className="text-gray-300">Of tokenized assets on Ethereum</div>
                <div className="text-sm text-gray-500 mt-2">Trillions moving on-chain</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20 rounded-xl p-8 text-center hover:border-purple-500/40 transition-colors">
                <div className="text-5xl font-bold text-purple-400 mb-3">750K+</div>
                <div className="text-gray-300">Weekly stablecoin users</div>
                <div className="text-sm text-gray-500 mt-2">New all-time high</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/30 rounded-xl p-8">
              <blockquote className="text-2xl text-white italic text-center">
                "<span className="text-cyan-400">Bitcoin</span> is digital gold; <span className="text-blue-400">Ethereum</span> is digital infrastructure with cash flows."
              </blockquote>
            </div>
          </div>
        </section>

        {/* Investor Highlights */}
        <section className="py-20 px-6 bg-black/95">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-12 text-center">Investor Highlights</h2>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/20 rounded-xl p-6 flex items-start gap-4 hover:border-cyan-500/40 transition-colors">
                <div className="bg-cyan-500/20 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Pure ETH Exposure with Capital Markets Edge</h3>
                  <p className="text-gray-300">
                    Utilize ATM offerings, convertibles, and structured equity to accumulate ETH at scale. 
                    Capital markets flywheel enables exponential growth.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-xl p-6 flex items-start gap-4 hover:border-blue-500/40 transition-colors">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Staking Yield + DeFi Strategies</h3>
                  <p className="text-gray-300">
                    Outperform spot ETFs and BTC plays with 3-4% native staking yield and DeFi integration. 
                    Ethereum compounds through multiple revenue streams.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20 rounded-xl p-6 flex items-start gap-4 hover:border-purple-500/40 transition-colors">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <Network className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Network-Aligned Growth</h3>
                  <p className="text-gray-300">
                    Support ETH burn mechanism, Layer 2 ecosystems, and institutional infrastructure. 
                    Position benefits from network effects and institutional adoption.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/20 rounded-xl p-6 flex items-start gap-4 hover:border-cyan-500/40 transition-colors">
                <div className="bg-cyan-500/20 p-3 rounded-lg">
                  <Award className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Tokenization Upside</h3>
                  <p className="text-gray-300">
                    Future revenue from tokenized reinsurance, real-world assets, and merchant banking operations. 
                    Capital-light business model with high leverage to Ethereum growth.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-xl p-6 flex items-start gap-4 hover:border-blue-500/40 transition-colors">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-400" />
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
        <section className="py-20 px-6 bg-black">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-12 text-center">Our Partners</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              <div className="bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/20 rounded-xl p-6 text-center hover:border-cyan-500/40 transition-colors">
                <p className="text-white font-semibold">Anchorage Digital</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-xl p-6 text-center hover:border-blue-500/40 transition-colors">
                <p className="text-white font-semibold">BitGo</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20 rounded-xl p-6 text-center hover:border-purple-500/40 transition-colors">
                <p className="text-white font-semibold">Galaxy Digital</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/20 rounded-xl p-6 text-center hover:border-cyan-500/40 transition-colors">
                <p className="text-white font-semibold">Kraken</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Us in Owning <span className="text-cyan-400">Ethereum's</span> Next Decade
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              FGNX delivers active ETH exposure with staking yield, tokenization upside, and capital markets execution, 
              built to outperform ETFs, BTC vehicles, and passive crypto funds.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8 shadow-lg shadow-cyan-500/50"
                onClick={() => window.open('https://fgnexus.io/', '_blank')}
              >
                Explore FG Nexus
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
                onClick={() => window.open('https://fgnexus.io/investor-relations/', '_blank')}
              >
                Investor Relations
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
                onClick={() => window.open('/contact', '_self')}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </section>

        {/* Back to Showcase */}
        <section className="py-12 px-6 bg-black">
          <div className="max-w-7xl mx-auto text-center">
            <Button 
              variant="outline" 
              className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
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
