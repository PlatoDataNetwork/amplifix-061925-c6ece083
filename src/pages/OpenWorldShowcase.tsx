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
  ChevronLeft
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
      examples: ["Commercial Buildings", "Residential Complexes", "REITs", "Land Parcels"]
    },
    {
      icon: Gem,
      title: "Precious Metals & Commodities",
      description: "Digital representation of gold, silver, and other commodities with instant settlement.",
      examples: ["Gold Reserves", "Silver Holdings", "Oil & Gas", "Agricultural Products"]
    },
    {
      icon: FileCheck,
      title: "Private Equity & Debt",
      description: "Transform private investments into tradeable digital securities with enhanced liquidity.",
      examples: ["Private Credit", "Venture Capital", "Corporate Bonds", "Fund Interests"]
    },
    {
      icon: Factory,
      title: "Infrastructure Assets",
      description: "Enable investment in large-scale infrastructure through tokenized ownership structures.",
      examples: ["Energy Projects", "Transportation", "Data Centers", "Utilities"]
    },
    {
      icon: Leaf,
      title: "Carbon Credits & ESG",
      description: "Tokenize environmental assets for transparent and efficient carbon markets.",
      examples: ["Carbon Offsets", "Renewable Energy Credits", "Sustainability Bonds", "Green Investments"]
    },
    {
      icon: Building2,
      title: "Art & Collectibles",
      description: "Fractional ownership of high-value art, collectibles, and luxury assets.",
      examples: ["Fine Art", "Rare Collectibles", "Luxury Watches", "Wine Collections"]
    }
  ];

  const benefits = [
    {
      icon: Coins,
      title: "Enhanced Liquidity",
      description: "Transform illiquid assets into tradeable tokens, enabling 24/7 global trading and faster settlement cycles."
    },
    {
      icon: Users,
      title: "Fractional Ownership",
      description: "Lower investment minimums allow broader participation in premium asset classes previously reserved for institutions."
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Remove geographical barriers and enable cross-border investment with instant, borderless transactions."
    },
    {
      icon: Shield,
      title: "Enhanced Security",
      description: "Blockchain-based immutable records ensure transparent ownership and reduce fraud risk."
    },
    {
      icon: TrendingUp,
      title: "Cost Efficiency",
      description: "Eliminate intermediaries, reduce transaction costs, and streamline administrative processes."
    },
    {
      icon: Lock,
      title: "Regulatory Compliance",
      description: "Built-in compliance with programmable smart contracts ensuring adherence to securities regulations."
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
    <div className="min-h-screen bg-background">
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

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium border-primary/30 bg-primary/5">
              Private Company
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              OpenWorld
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Real World Asset Tokenization Platform
            </p>
            
            <p className="text-lg text-muted-foreground/80 mb-10 max-w-2xl mx-auto">
              Transforming real-world assets into digital securities. Enabling fractional ownership, 
              enhanced liquidity, and global investment access for traditionally illiquid assets.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" asChild>
                <a href="https://openworld.dev" target="_blank" rel="noopener noreferrer">
                  <Globe className="w-5 h-5" />
                  Visit Website
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <a href="https://www.bing.com/copilotsearch?q=OPenworld+RWA+Tokenization" target="_blank" rel="noopener noreferrer">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Market Stats */}
      <section className="py-16 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {marketStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is RWA Tokenization */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="secondary" className="mb-4">Understanding RWA</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is Real World Asset Tokenization?
            </h2>
            <p className="text-lg text-muted-foreground">
              RWA tokenization is the process of converting ownership rights of physical or financial assets 
              into digital tokens on a blockchain. This revolutionary technology bridges traditional finance 
              with decentralized infrastructure, creating new opportunities for investors and asset owners alike.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
              <CardContent className="p-8">
                <Layers className="w-12 h-12 text-primary mb-6" />
                <h3 className="text-xl font-semibold mb-4">Traditional Assets</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    Limited liquidity with long settlement times
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    High minimum investment requirements
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    Geographic and regulatory barriers
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    Complex intermediary structures
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-background to-accent/5">
              <CardContent className="p-8">
                <BarChart3 className="w-12 h-12 text-primary mb-6" />
                <h3 className="text-xl font-semibold mb-4">Tokenized Assets</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    24/7 trading with instant settlement
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    Fractional ownership enables broader access
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    Global, borderless investment opportunities
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    Automated compliance and reduced costs
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Asset Categories */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="secondary" className="mb-4">Asset Classes</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Tokenizable Real World Assets
            </h2>
            <p className="text-lg text-muted-foreground">
              From real estate to commodities, virtually any asset with quantifiable value can be tokenized, 
              unlocking new investment opportunities across diverse asset classes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rwaCategories.map((category, index) => (
              <Card key={index} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="p-6">
                  <category.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold mb-3">{category.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {category.examples.map((example, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="secondary" className="mb-4">Advantages</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Benefits of RWA Tokenization
            </h2>
            <p className="text-lg text-muted-foreground">
              Tokenization unlocks significant value for both asset owners and investors through 
              enhanced liquidity, accessibility, and operational efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenization Process */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Tokenization Process
            </h2>
            <p className="text-lg text-muted-foreground">
              A comprehensive, end-to-end process that transforms physical assets into 
              compliant digital securities ready for global markets.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6">
              {tokenizationProcess.map((step, index) => (
                <div key={index} className="flex gap-6 items-start group">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                    {step.step}
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="secondary" className="mb-4">Technology</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Built on Proven Technology
            </h2>
            <p className="text-lg text-muted-foreground">
              OpenWorld leverages enterprise-grade blockchain infrastructure and smart contract 
              technology to ensure security, scalability, and regulatory compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-8">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Enterprise Security</h3>
                <p className="text-sm text-muted-foreground">
                  Multi-sig custody, hardware security modules, and institutional-grade key management.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <FileCheck className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Smart Contracts</h3>
                <p className="text-sm text-muted-foreground">
                  Audited smart contracts with automated compliance, dividends, and corporate actions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Multi-Chain Support</h3>
                <p className="text-sm text-muted-foreground">
                  Deploy on Ethereum, Polygon, or other networks optimized for your use case.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="secondary" className="mb-4">Applications</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Real-World Use Cases
            </h2>
            <p className="text-lg text-muted-foreground">
              Organizations worldwide are leveraging RWA tokenization to unlock value, 
              improve efficiency, and create new investment products.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <Home className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Real Estate Tokenization</h3>
                <p className="text-muted-foreground mb-4">
                  A $100M commercial property tokenized into 1 million tokens, enabling investors 
                  to purchase fractional ownership starting at $100. The property generates rental 
                  income distributed automatically via smart contracts.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">Fractional Ownership</Badge>
                  <Badge variant="outline">Automated Dividends</Badge>
                  <Badge variant="outline">Secondary Trading</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <Gem className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Gold-Backed Tokens</h3>
                <p className="text-muted-foreground mb-4">
                  Physical gold stored in secure vaults tokenized 1:1, allowing instant transfer 
                  and redemption. Each token represents ownership of actual gold with full audit 
                  transparency and insurance coverage.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">1:1 Asset Backing</Badge>
                  <Badge variant="outline">Instant Settlement</Badge>
                  <Badge variant="outline">Audited Reserves</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <FileCheck className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Private Credit Funds</h3>
                <p className="text-muted-foreground mb-4">
                  A private credit fund tokenized to enable broader investor access with lower 
                  minimums. Monthly yield distributions automated through smart contracts with 
                  transparent NAV reporting.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">Lower Minimums</Badge>
                  <Badge variant="outline">Yield Distribution</Badge>
                  <Badge variant="outline">Transparent Reporting</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <Leaf className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Carbon Credit Markets</h3>
                <p className="text-muted-foreground mb-4">
                  Verified carbon credits tokenized for transparent trading with full traceability 
                  from origin to retirement. Enables companies to offset emissions with verifiable, 
                  immutable records.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">Full Traceability</Badge>
                  <Badge variant="outline">Verified Credits</Badge>
                  <Badge variant="outline">Immutable Records</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Tokenize Your Assets?
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Join the future of asset ownership with OpenWorld's comprehensive RWA tokenization platform. 
              From real estate to commodities, we provide the infrastructure to bring your assets on-chain.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button size="lg" className="gap-2" asChild>
                <a href="https://openworld.dev" target="_blank" rel="noopener noreferrer">
                  <Globe className="w-5 h-5" />
                  Visit OpenWorld
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <a href="https://www.bing.com/copilotsearch?q=OPenworld+RWA+Tokenization" target="_blank" rel="noopener noreferrer">
                  Research RWA Tokenization
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </div>

            <Button 
              variant="ghost" 
              className="gap-2"
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
