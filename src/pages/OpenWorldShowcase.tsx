import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ExternalLink, 
  Building2, 
  Globe, 
  Shield, 
  Coins, 
  TrendingUp,
  Users,
  FileCheck,
  Layers,
  Lock,
  BarChart3,
  Landmark,
  Home,
  Gem,
  Factory,
  Leaf,
  ChevronLeft,
  Zap,
  Network,
  CircuitBoard
} from "lucide-react";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";
import { useNavigate } from "react-router-dom";

const OpenWorldShowcase = () => {
  const navigate = useNavigate();
  useGTranslateRefresh(true);

  const rwaCategories = [
    {
      icon: Landmark,
      title: "Real Estate",
      description: "Tokenize commercial and residential properties for fractional ownership and global investment access.",
      examples: ["Commercial Buildings", "Residential Complexes", "REITs", "Land Parcels"],
      iconColor: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      icon: Gem,
      title: "Precious Metals & Commodities",
      description: "Digital representation of gold, silver, and other commodities with instant settlement.",
      examples: ["Gold Reserves", "Silver Holdings", "Oil & Gas", "Agricultural Products"],
      iconColor: "text-amber-400",
      bgColor: "bg-amber-500/20"
    },
    {
      icon: FileCheck,
      title: "Private Equity & Debt",
      description: "Transform private investments into tradeable digital securities with enhanced liquidity.",
      examples: ["Private Credit", "Venture Capital", "Corporate Bonds", "Fund Interests"],
      iconColor: "text-purple-400",
      bgColor: "bg-purple-500/20"
    },
    {
      icon: Factory,
      title: "Infrastructure Assets",
      description: "Enable investment in large-scale infrastructure through tokenized ownership structures.",
      examples: ["Energy Projects", "Transportation", "Data Centers", "Utilities"],
      iconColor: "text-orange-400",
      bgColor: "bg-orange-500/20"
    },
    {
      icon: Leaf,
      title: "Carbon Credits & ESG",
      description: "Tokenize environmental assets for transparent and efficient carbon markets.",
      examples: ["Carbon Offsets", "Renewable Energy Credits", "Sustainability Bonds", "Green Investments"],
      iconColor: "text-emerald-400",
      bgColor: "bg-emerald-500/20"
    },
    {
      icon: Building2,
      title: "Art & Collectibles",
      description: "Fractional ownership of high-value art, collectibles, and luxury assets.",
      examples: ["Fine Art", "Rare Collectibles", "Luxury Watches", "Wine Collections"],
      iconColor: "text-rose-400",
      bgColor: "bg-rose-500/20"
    }
  ];

  const benefits = [
    {
      icon: Coins,
      title: "Enhanced Liquidity",
      description: "Transform illiquid assets into tradeable tokens, enabling 24/7 global trading and faster settlement cycles.",
      iconColor: "text-yellow-400",
      bgColor: "bg-yellow-500/20"
    },
    {
      icon: Users,
      title: "Fractional Ownership",
      description: "Lower investment minimums allow broader participation in premium asset classes previously reserved for institutions.",
      iconColor: "text-cyan-400",
      bgColor: "bg-cyan-500/20"
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Remove geographical barriers and enable cross-border investment with instant, borderless transactions.",
      iconColor: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      icon: Shield,
      title: "Enhanced Security",
      description: "Blockchain-based immutable records ensure transparent ownership and reduce fraud risk.",
      iconColor: "text-green-400",
      bgColor: "bg-green-500/20"
    },
    {
      icon: TrendingUp,
      title: "Cost Efficiency",
      description: "Eliminate intermediaries, reduce transaction costs, and streamline administrative processes.",
      iconColor: "text-pink-400",
      bgColor: "bg-pink-500/20"
    },
    {
      icon: Lock,
      title: "Regulatory Compliance",
      description: "Built-in compliance with programmable smart contracts ensuring adherence to securities regulations.",
      iconColor: "text-violet-400",
      bgColor: "bg-violet-500/20"
    }
  ];

  const tokenizationProcess = [
    {
      step: "01",
      title: "Asset Identification",
      description: "Select and evaluate the real-world asset for tokenization eligibility, legal structure, and market potential."
    },
    {
      step: "02",
      title: "Legal Structuring",
      description: "Establish the legal framework including SPVs, custody arrangements, and regulatory compliance requirements."
    },
    {
      step: "03",
      title: "Token Creation",
      description: "Deploy smart contracts on blockchain, defining token economics, rights, and governance mechanisms."
    },
    {
      step: "04",
      title: "Issuance & Distribution",
      description: "Launch the token offering to qualified investors through compliant distribution channels."
    },
    {
      step: "05",
      title: "Secondary Trading",
      description: "Enable liquidity through regulated secondary markets and automated market makers."
    },
    {
      step: "06",
      title: "Lifecycle Management",
      description: "Ongoing management including dividends, reporting, corporate actions, and redemptions."
    }
  ];

  const marketStats = [
    { value: "$16T+", label: "Projected RWA Market by 2030" },
    { value: "10x", label: "Liquidity Improvement" },
    { value: "60%", label: "Cost Reduction" },
    { value: "24/7", label: "Trading Availability" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Helmet>
        <title>OpenWorld - RWA Tokenization Platform | AmplifiX</title>
        <meta name="description" content="OpenWorld is a leading RWA tokenization platform transforming real-world assets into digital securities. Enabling fractional ownership and global liquidity." />
        <meta property="og:title" content="OpenWorld - RWA Tokenization Platform" />
        <meta property="og:description" content="Transform real-world assets into digital securities with OpenWorld's tokenization platform." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="OpenWorld - RWA Tokenization Platform" />
        <meta name="twitter:description" content="Leading RWA tokenization platform for real-world assets." />
      </Helmet>

      <MainHeader />

      {/* Hero Section with Header Banner Background */}
      <section className="relative py-24 lg:py-40 overflow-hidden">
        {/* Header Banner as Background */}
        <div className="absolute inset-0 w-full">
          <img 
            src="/images/showcase/openworld-header.png" 
            alt="OpenWorld Header" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/80 to-[#0a0a0a]" />
        </div>
        
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">

            <Badge className="mb-6 px-4 py-2 text-sm font-medium bg-white/5 border border-white/10 text-white/80 hover:bg-white/10">
              Private Company • RWA Tokenization
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                OpenWorld
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/60 mb-4 font-light">
              Real World Asset Tokenization Platform
            </p>
            
            <p className="text-lg text-white/40 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transforming real-world assets into digital securities. Enabling fractional ownership, 
              enhanced liquidity, and global investment access for traditionally illiquid assets.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="gap-2 bg-white text-black hover:bg-white/90 font-medium px-8"
                asChild
              >
                <a href="https://openworld.dev" target="_blank" rel="noopener noreferrer">
                  <Globe className="w-5 h-5" />
                  Visit Website
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 border-white/20 text-white hover:bg-white/10 hover:text-white font-medium px-8"
                asChild
              >
                <a href="https://www.bing.com/copilotsearch?q=OpenWorld+RWA+Tokenization" target="_blank" rel="noopener noreferrer">
                  <Zap className="w-5 h-5" />
                  AmplifiX Research
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Market Stats */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {marketStats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm text-white/40 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is RWA Tokenization */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <CircuitBoard className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/60">Understanding RWA</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              What is Real World Asset Tokenization?
            </h2>
            <p className="text-lg text-white/50 leading-relaxed">
              RWA tokenization is the process of converting ownership rights of physical or financial assets 
              into digital tokens on a blockchain. This revolutionary technology bridges traditional finance 
              with decentralized infrastructure, creating new opportunities for investors and asset owners alike.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center mb-6">
                  <Layers className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Traditional Assets</h3>
                <ul className="space-y-4 text-white/50">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                    Limited liquidity with long settlement times
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                    High minimum investment requirements
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                    Geographic and regulatory barriers
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                    Complex intermediary structures
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center mb-6">
                  <BarChart3 className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Tokenized Assets</h3>
                <ul className="space-y-4 text-white/50">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                    24/7 trading with instant settlement
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                    Fractional ownership enables broader access
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                    Global, borderless investment opportunities
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                    Automated compliance and reduced costs
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Asset Categories */}
      <section className="py-24 lg:py-32 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Network className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white/60">Asset Classes</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Tokenizable Real World Assets
            </h2>
            <p className="text-lg text-white/50 leading-relaxed">
              From real estate to commodities, virtually any asset with quantifiable value can be tokenized, 
              unlocking new investment opportunities across diverse asset classes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rwaCategories.map((category, index) => (
              <Card 
                key={index} 
                className="group border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className={`w-6 h-6 ${category.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-white">{category.title}</h3>
                  <p className="text-white/40 text-sm mb-6 leading-relaxed">{category.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {category.examples.map((example, i) => (
                      <span 
                        key={i} 
                        className="px-2 py-1 text-xs rounded-md bg-white/5 text-white/50 border border-white/5"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.02] to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-white/60">Advantages</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Benefits of RWA Tokenization
            </h2>
            <p className="text-lg text-white/50 leading-relaxed">
              Tokenization unlocks significant value for both asset owners and investors through 
              enhanced liquidity, accessibility, and operational efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-5 group">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-xl ${benefit.bgColor} flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
                    <benefit.icon className={`w-6 h-6 ${benefit.iconColor}`} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-white">{benefit.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenization Process */}
      <section className="py-24 lg:py-32 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white/60">How It Works</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              The Tokenization Process
            </h2>
            <p className="text-lg text-white/50 leading-relaxed">
              A comprehensive, end-to-end process that transforms physical assets into 
              compliant digital securities ready for global markets.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6">
              {tokenizationProcess.map((step, index) => (
                <div key={index} className="flex gap-6 items-start group">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center font-bold text-xl text-white group-hover:from-white/20 group-hover:to-white/10 group-hover:border-white/20 transition-all duration-300">
                    {step.step}
                  </div>
                  <div className="flex-1 pt-3">
                    <h3 className="text-lg font-semibold mb-2 text-white">{step.title}</h3>
                    <p className="text-white/40 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/60">Technology</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Built on Proven Technology
            </h2>
            <p className="text-lg text-white/50 leading-relaxed">
              OpenWorld leverages enterprise-grade blockchain infrastructure and smart contract 
              technology to ensure security, scalability, and regulatory compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center border-white/10 bg-white/[0.02] backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="font-semibold mb-3 text-white">Enterprise Security</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  Multi-sig custody, hardware security modules, and institutional-grade key management.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-white/10 bg-white/[0.02] backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mx-auto mb-6">
                  <FileCheck className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="font-semibold mb-3 text-white">Smart Contracts</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  Audited smart contracts with automated compliance, dividends, and corporate actions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-white/10 bg-white/[0.02] backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="font-semibold mb-3 text-white">Multi-Chain Support</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  Deploy on Ethereum, Polygon, or other networks optimized for your use case.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 lg:py-32 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Building2 className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-white/60">Applications</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Real-World Use Cases
            </h2>
            <p className="text-lg text-white/50 leading-relaxed">
              Organizations worldwide are leveraging RWA tokenization to unlock value, 
              improve efficiency, and create new investment products.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-white/10 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-colors duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center mb-6">
                  <Home className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Real Estate Tokenization</h3>
                <p className="text-white/40 mb-6 leading-relaxed">
                  A $100M commercial property tokenized into 1 million tokens, enabling investors 
                  to purchase fractional ownership starting at $100. The property generates rental 
                  income distributed automatically via smart contracts.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Fractional Ownership
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Automated Dividends
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Secondary Trading
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-colors duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 flex items-center justify-center mb-6">
                  <Gem className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Gold-Backed Tokens</h3>
                <p className="text-white/40 mb-6 leading-relaxed">
                  Physical gold stored in secure vaults tokenized 1:1, allowing instant transfer 
                  and redemption. Each token represents ownership of actual gold with full audit 
                  transparency and insurance coverage.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                    1:1 Asset Backing
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                    Instant Settlement
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                    Audited Reserves
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-colors duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mb-6">
                  <FileCheck className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Private Credit Funds</h3>
                <p className="text-white/40 mb-6 leading-relaxed">
                  A private credit fund tokenized to enable broader investor access with lower 
                  minimums. Monthly yield distributions automated through smart contracts with 
                  transparent NAV reporting.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 text-xs rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Lower Minimums
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Yield Distribution
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Transparent Reporting
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] transition-colors duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center mb-6">
                  <Leaf className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Carbon Credit Markets</h3>
                <p className="text-white/40 mb-6 leading-relaxed">
                  Verified carbon credits tokenized for transparent trading with full traceability 
                  from origin to retirement. Enables companies to offset emissions with verifiable, 
                  immutable records.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                    Full Traceability
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                    Verified Credits
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                    Immutable Records
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Tokenize Your Assets?
            </h2>
            <p className="text-lg text-white/50 mb-12 leading-relaxed">
              Join the future of asset ownership with OpenWorld's comprehensive RWA tokenization platform. 
              From real estate to commodities, we provide the infrastructure to bring your assets on-chain.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="gap-2 bg-white text-black hover:bg-white/90 font-medium px-8"
                asChild
              >
                <a href="https://openworld.dev" target="_blank" rel="noopener noreferrer">
                  <Globe className="w-5 h-5" />
                  Visit OpenWorld
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 border-white/20 text-white hover:bg-white/10 hover:text-white font-medium px-8"
                asChild
              >
                <a href="https://www.bing.com/copilotsearch?q=OpenWorld+RWA+Tokenization" target="_blank" rel="noopener noreferrer">
                  Research RWA Tokenization
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </div>

            <Button 
              variant="ghost" 
              className="gap-2 text-white/60 hover:text-white hover:bg-white/5"
              onClick={() => navigate('/showcase')}
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Showcase
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OpenWorldShowcase;
