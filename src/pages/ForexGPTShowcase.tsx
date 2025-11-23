import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { 
  ExternalLink, 
  TrendingUp, 
  Brain, 
  BarChart3,
  DollarSign,
  Zap,
  Globe,
  Target,
  LineChart,
  Clock,
  Shield
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";

const forexGptThumbnail = "/lovable-uploads/forex-gpt-thumbnail.png";

const ForexGPTShowcase = () => {
  const iconMap: Record<string, any> = {
    brain: Brain,
    chart: BarChart3,
    trending: TrendingUp,
    dollar: DollarSign,
    zap: Zap,
    globe: Globe,
    target: Target,
    linechart: LineChart,
    clock: Clock,
    shield: Shield
  };

  const features = [
    {
      title: "AI-Powered Technical Analysis",
      description: "Get real-time forex market insights powered by GPT-4o mini and Whisper API from OpenAI, delivering comprehensive analysis across 120+ assets and 22 timeframes within seconds.",
      icon: "brain"
    },
    {
      title: "ForexGPT Sentiment Score",
      description: "Quickly analyze charts with the proprietary Sentiment Score ranging from -100 (very bearish) to +100 (very bullish), where closer to zero indicates neutral market conditions.",
      icon: "chart"
    },
    {
      title: "Trading Signals & Setups",
      description: "Receive AI-generated trading signals with example setups and comprehensive risk management advice for various market conditions, all tailored to current market dynamics.",
      icon: "target"
    },
    {
      title: "AiWatchlist & Heatmap Screener",
      description: "Simultaneously analyze up to 15 assets per timeframe or 15 timeframes per asset with advanced screening tools, perfect for identifying market opportunities at scale.",
      icon: "linechart"
    },
    {
      title: "24/7 Real-Time Market Analysis",
      description: "Access around-the-clock analysis across forex pairs, cryptocurrencies, global indices, commodities, and bonds—120 symbols in total with continuous updates.",
      icon: "clock"
    },
    {
      title: "MCP Server Integration",
      description: "Connect Claude, ChatGPT, or any MCP-compatible client to interact with ForexGPT using natural language or programmatically via API for seamless AI-powered trading workflows.",
      icon: "globe"
    },
    {
      title: "Advanced Text-to-Speech",
      description: "Listen to AI-generated post-chart analysis with integrated text-to-speech functionality, making it easier to consume insights while multitasking.",
      icon: "zap"
    },
    {
      title: "Chain-of-Thought Prompting",
      description: "Leverage sophisticated chain-of-thought prompting integrated with Large Language Models to provide deeper, more reasoned analysis devoid of human bias.",
      icon: "brain"
    },
    {
      title: "Beta Features First Access",
      description: "Premium subscribers receive early access to new features including the Smartket Scanner and other innovations pushed from beta servers before public release.",
      icon: "shield"
    }
  ];

  const platforms = [
    {
      name: "Live2 Server",
      status: "Operational",
      description: "Main production server for advanced charting analysis with standalone capabilities and integration with the Free GPT for ChatGPT.",
      url: "https://live2.forex-gpt.ai/login",
      badge: "Primary"
    },
    {
      name: "Live4 Server (Beta)",
      status: "Operational",
      description: "Beta server featuring newest innovations including Heatmap screener, AiWatchlist for bulk analysis, and Smartket Scanner for market scanning.",
      url: "https://live4.forex-gpt.ai/login",
      badge: "Latest Features"
    },
    {
      name: "MCP Server",
      status: "Operational",
      description: "Model Context Protocol server enabling natural language interaction with ForexGPT through Claude, ChatGPT, or any MCP-compatible client.",
      url: "https://forex-gpt.ai/",
      badge: "New"
    }
  ];

  const assetCategories = [
    { category: "Forex Pairs", count: "40+", examples: "EUR/USD, GBP/JPY, AUD/CAD" },
    { category: "Cryptocurrencies", count: "25+", examples: "BTC, ETH, XRP, SOL" },
    { category: "Indices", count: "20+", examples: "S&P 500, NASDAQ, DAX" },
    { category: "Commodities", count: "15+", examples: "Gold, Silver, Oil, Natural Gas" },
    { category: "Bonds", count: "10+", examples: "US 10Y, German Bund, UK Gilt" },
    { category: "Timeframes", count: "22", examples: "1m, 5m, 15m, 1h, 4h, Daily, Weekly" }
  ];

  const plans = [
    {
      name: "Classic",
      price: "$10/month",
      description: "Daily quota of 57,000 free tokens (enough for ~15 analyses per day)",
      features: [
        "Access sentiment score on 100+ assets",
        "AiWatchlist and Heatmap Screener",
        "AI-generated trading signals",
        "Advanced technical analysis",
        "Text-to-speech post chart analysis",
        "Beta features early access"
      ]
    },
    {
      name: "PRO",
      price: "$20/month",
      description: "500k premium tokens (enough for ~140 analyses)",
      features: [
        "All Classic plan benefits",
        "Premium tokens never expire",
        "More daily analyses than free quota",
        "Token-intensive AiWatchlist computations",
        "Analyze 15 assets per timeframe",
        "Great for power users"
      ],
      highlighted: true
    },
    {
      name: "VIP",
      price: "$100/month",
      description: "3M premium tokens (enough for 850+ analyses)",
      features: [
        "All PRO plan benefits",
        "Massive token allocation",
        "Deep analysis across timeframes",
        "Best for active traders",
        "High volume day trading",
        "Bulk analysis capabilities"
      ]
    }
  ];

  const stats = [
    { label: "Trading Assets", value: "120+", icon: "globe" },
    { label: "Timeframes", value: "22", icon: "clock" },
    { label: "AI Models", value: "GPT-4o", icon: "brain" },
    { label: "Available", value: "24/7", icon: "shield" }
  ];

  return (
    <>
      <Helmet>
        <title>Forex-GPT.ai - AI-Powered Forex Trading Analysis | PLATO</title>
        <meta name="description" content="ForexGPT leverages advanced AI models to provide real-time technical analysis, trading signals, and sentiment scores across 100+ assets and 22 timeframes." />
        <meta name="keywords" content="forex trading, AI trading analysis, technical analysis, trading signals, forex sentiment, automated trading, GPT trading, crypto analysis" />
        <link rel="canonical" href="https://plato.so/showcase/forex-gpt" />
        
        <meta property="og:title" content="Forex-GPT.ai - AI-Powered Forex Trading Analysis" />
        <meta property="og:description" content="Advanced AI-powered trading analysis platform providing real-time insights across forex, crypto, indices, commodities, and bonds." />
        <meta property="og:image" content={forexGptThumbnail} />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Forex-GPT.ai - AI-Powered Trading Analysis" />
        <meta name="twitter:description" content="ForexGPT provides AI-powered technical analysis and trading signals across 100+ assets." />
        <meta name="twitter:image" content={forexGptThumbnail} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <MainHeader />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-green-500/5 to-purple-500/5" />
          <div className="container relative mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-block">
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/20 rounded-full text-sm font-medium text-blue-600 dark:text-blue-400">
                    AI-Powered Forex Analysis
                  </span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                    ForexGPT
                  </span>
                  <br />
                  <span className="text-foreground">
                    AI Trading Intelligence
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Advanced AI-powered technical analysis platform leveraging GPT-4o mini to deliver real-time insights, trading signals, and sentiment analysis across 120+ assets and 22 timeframes.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    <a href="https://forex-gpt.ai/" target="_blank" rel="noopener noreferrer">
                      Launch Platform
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="https://forex-gpt.ai/plans/" target="_blank" rel="noopener noreferrer">
                      View Pricing
                    </a>
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                  {stats.map((stat, index) => {
                    const Icon = iconMap[stat.icon];
                    return (
                      <div key={index} className="text-center p-4 bg-card/50 rounded-lg border">
                        <Icon className="h-5 w-5 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                        <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-green-500/20 blur-3xl rounded-full" />
                <img 
                  src={forexGptThumbnail}
                  alt="ForexGPT AI Trading Platform"
                  className="relative rounded-2xl shadow-2xl border border-border/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Powerful AI Features</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                ForexGPT combines cutting-edge AI technology with real-time market data to provide actionable trading insights
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = iconMap[feature.icon];
                return (
                  <Card key={index} className="border-border/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Platform Servers Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Multiple Platform Servers</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Access ForexGPT through our production, beta, and MCP integration servers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {platforms.map((platform, index) => (
                <Card key={index} className="border-border/50 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{platform.name}</h3>
                      <span className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
                        {platform.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 dark:text-green-400">{platform.status}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {platform.description}
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={platform.url} target="_blank" rel="noopener noreferrer">
                        Access Server
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Asset Coverage Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Comprehensive Asset Coverage</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Analyze 120+ financial instruments across multiple asset classes and 22 timeframes
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assetCategories.map((category, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{category.category}</h3>
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-bold rounded-full">
                        {category.count}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {category.examples}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* MCP Server Details Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full text-sm font-medium text-purple-600 dark:text-purple-400 inline-block mb-4">
                  November 2025 Update
                </span>
                <h2 className="text-4xl font-bold mb-4">MCP Server Integration</h2>
                <p className="text-xl text-muted-foreground">
                  Connect ForexGPT to Claude, ChatGPT, or any MCP-compatible client for seamless AI-powered trading workflows
                </p>
              </div>

              <Card className="border-border/50 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold">What is MCP?</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      The Model Context Protocol (MCP) provides a standardized approach for AI models to interact with external tools and services. ForexGPT subscribers can now connect their favorite MCP client to access ForexGPT&apos;s analysis capabilities using natural language or programmatic API calls.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        Key Capabilities
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                          <span>Natural language analysis requests</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                          <span>Programmatic API access</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                          <span>Multi-asset bulk analysis</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                          <span>Sentiment score retrieval</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Compatible Clients
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                          <span>Claude Desktop (Anthropic)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                          <span>ChatGPT with Connectors</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                          <span>Any MCP-compatible client</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                          <span>Custom integrations via API</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" asChild>
                    <a href="https://youtu.be/eXL_4yO3FDY" target="_blank" rel="noopener noreferrer">
                      Watch MCP Demo Walkthrough
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Technology & Innovation Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Powered by Cutting-Edge AI</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                ForexGPT leverages the latest AI models and innovative techniques for superior trading analysis
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="border-border/50">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center">
                    <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold">OpenAI Integration</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Powered by GPT-4o mini and Whisper API from OpenAI, providing advanced natural language processing and text-to-speech capabilities for comprehensive market analysis.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-semibold">Chain-of-Thought Prompting</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Integrated chain-of-thought prompting from our web application provides deeper reasoning and more accurate analysis, completely devoid of human opinions or bias.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 p-8 bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/20 rounded-2xl max-w-5xl mx-auto">
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Educational Purpose Disclaimer</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    ForexGPT is designed solely for <strong>educational and research purposes</strong>. It is not investment advice and should not be used as the sole basis for trading decisions. Always conduct your own research and consult with qualified financial advisors before making investment decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From casual traders to high-volume professionals, find the perfect plan for your trading needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative ${plan.highlighted ? 'border-blue-500/50 shadow-xl shadow-blue-500/10' : 'border-border/50'} hover:shadow-lg transition-all duration-300`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-gradient-to-r from-blue-600 to-green-600 text-white text-sm font-medium rounded-full">
                        Best Deal
                      </span>
                    </div>
                  )}
                  <CardContent className="p-8 space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-3">{plan.price}</div>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Zap className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.highlighted ? 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700' : ''}`}
                      asChild
                    >
                      <a href="https://forex-gpt.ai/plans/" target="_blank" rel="noopener noreferrer">
                        Get Started
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600/10 via-green-600/10 to-teal-600/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join traders worldwide using ForexGPT's AI-powered analysis to make more informed trading decisions
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                <a href="https://live2.forex-gpt.ai/login" target="_blank" rel="noopener noreferrer">
                  Start Free Trial
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://forex-gpt.ai/faqs/" target="_blank" rel="noopener noreferrer">
                  Learn More
                </a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Note: ForexGPT is for educational and research purposes only, not investment advice
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ForexGPTShowcase;
