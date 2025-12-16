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
  Shield,
  Mic,
  Layers,
  Monitor,
  Cpu,
  BookOpen,
  Radio,
  Play,
  Sparkles,
  Eye,
  Activity
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";

const forexGptThumbnail = "/lovable-uploads/forex-gpt-social-thumbnail.png";

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
    shield: Shield,
    mic: Mic,
    layers: Layers,
    monitor: Monitor,
    cpu: Cpu,
    book: BookOpen,
    radio: Radio,
    sparkles: Sparkles,
    eye: Eye,
    activity: Activity
  };

  const terminalFeatures = [
    {
      title: "Context-Aware AI Co-Pilot",
      description: "Unlike generic chatbots, our AI knows what chart you're viewing, your current timeframe, and the market's volatility state. Ask complex questions like 'What is the sentiment for EUR/USD based on the last hour of news?' and receive context-aware responses.",
      icon: "brain"
    },
    {
      title: "Professional-Grade Charting",
      description: "Built on Lightweight Charts with liquidity visualization—candles color-coded by liquidity density to spot hidden order blocks. Toggle SMAs, Bollinger Bands, and Donchian Channels instantly with seamless historical and real-time data merging.",
      icon: "chart"
    },
    {
      title: "Agentic AI with 22 Tools",
      description: "Execute voice prompts that run 22 integrated tools including analyze watchlist, scan market, get news events, and fetch blog articles. The AI executes commands autonomously within your trading workflow.",
      icon: "mic"
    },
    {
      title: "Knowledge Hub",
      description: "Integrated news aggregation engine automatically sorts content into 'Daily Briefings,' 'Deep Dives,' and 'Weekly Outlooks' with rich media integration for a magazine-style reading experience without leaving the terminal.",
      icon: "book"
    },
    {
      title: "Zero-Latency Visualization",
      description: "Designed for speed with a neon-noir aesthetic that reduces eye strain during long trading sessions. Optimistic UI updates reflect trade execution instantly (<50ms) with background server reconciliation.",
      icon: "zap"
    },
    {
      title: "MCP Tool Abstraction",
      description: "The AI doesn't guess—it executes precise tools (get_price_history, analyze_sentiment) defined by the MCP server to fetch deterministic data with secure validation within strict risk management parameters.",
      icon: "cpu"
    }
  ];

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
      title: "Advanced Text-to-Speech",
      description: "Listen to AI-generated post-chart analysis with integrated text-to-speech functionality, making it easier to consume insights while multitasking.",
      icon: "zap"
    }
  ];

  const platforms = [
    {
      name: "Professional Terminal (Alpha)",
      status: "Alpha Preview",
      description: "The future of AI-driven trading—Generative AI as the core engine. Features agentic chat with 22 tools, voice prompts, and context-aware AI Co-Pilot.",
      url: "https://demo.forex-gpt.ai",
      badge: "NEW",
      badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500"
    },
    {
      name: "Live2 Server",
      status: "Operational",
      description: "Main production server for advanced charting analysis with standalone capabilities and integration with the Free GPT for ChatGPT.",
      url: "https://live2.forex-gpt.ai/login",
      badge: "Primary",
      badgeColor: "bg-green-500/10 text-green-600 dark:text-green-400"
    },
    {
      name: "Live4 Server (Beta)",
      status: "Operational",
      description: "Beta server featuring newest innovations including Heatmap screener, AiWatchlist for bulk analysis, and Smartket Scanner for market scanning.",
      url: "https://live4.forex-gpt.ai/login",
      badge: "Latest Features",
      badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    },
    {
      name: "MCP Server",
      status: "Operational",
      description: "Model Context Protocol server enabling natural language interaction with ForexGPT through Claude, ChatGPT, or any MCP-compatible client.",
      url: "https://forex-gpt.ai/",
      badge: "Integration",
      badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400"
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

  const architectureFeatures = [
    {
      title: "Model Context Protocol (MCP)",
      description: "Standardized approach for AI models to interact with external tools. The LLM 'sees' the market through deterministic data fetches.",
      icon: "cpu"
    },
    {
      title: "Resilient Data Streaming",
      description: "EventSource (SSE) Pipeline with smart backoff strategies, automatic reconnection logic, and state persistence across re-renders.",
      icon: "radio"
    },
    {
      title: "Optimistic UI Updates",
      description: "Interface reflects trade execution instantly (<50ms), reconciling with the server in the background for a buttery-smooth experience.",
      icon: "activity"
    },
    {
      title: "Secure Validation",
      description: "Every request is authenticated and validated, ensuring the AI operates within strict risk management parameters.",
      icon: "shield"
    }
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
    { label: "AI Tools", value: "22", icon: "cpu" },
    { label: "Timeframes", value: "22", icon: "clock" },
    { label: "Available", value: "24/7", icon: "shield" }
  ];

  return (
    <>
      <Helmet>
        <title>ForexGPT Professional Terminal - AI-Powered Trading Platform | AmplifiX</title>
        <meta name="description" content="ForexGPT Professional Terminal: The future of AI-driven trading with context-aware AI Co-Pilot, 22 agentic tools, professional charting, and real-time analysis across 120+ assets." />
        <meta name="keywords" content="forex trading, AI trading analysis, professional terminal, trading signals, forex sentiment, agentic AI, GPT trading, crypto analysis, MCP server" />
        <link rel="canonical" href="https://amplifix.net/showcase/forex-gpt" />
        
        <meta property="og:title" content="ForexGPT Professional Terminal - AI-Powered Trading Platform" />
        <meta property="og:description" content="The future of AI-driven trading—Generative AI as the core engine with context-aware Co-Pilot, 22 agentic tools, and professional-grade charting." />
        <meta property="og:image" content={forexGptThumbnail} />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ForexGPT Professional Terminal - AI Trading" />
        <meta name="twitter:description" content="ForexGPT: AI-native trading workspace with context-aware Co-Pilot and 22 agentic tools." />
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
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full text-sm font-medium text-purple-600 dark:text-purple-400">
                    Alpha Preview
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/20 rounded-full text-sm font-medium text-blue-600 dark:text-blue-400">
                    AI-Native Trading
                  </span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                    ForexGPT
                  </span>
                  <br />
                  <span className="text-foreground">
                    Professional Terminal
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  The future of AI-driven trading. Generative AI is not a plugin—it&apos;s the core engine. A reimagining of the trading workspace where your AI Co-Pilot lives directly on the trading floor.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <a href="https://forex-gpt.ai/professsional-terminal-demo-alpha/" target="_blank" rel="noopener noreferrer">
                      <Play className="mr-2 h-4 w-4" />
                      Watch Demo
                    </a>
                  </Button>
                  <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    <a href="https://demo.forex-gpt.ai" target="_blank" rel="noopener noreferrer">
                      Try Alpha
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
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-green-500/20 blur-3xl rounded-full" />
                <img 
                  src={forexGptThumbnail}
                  alt="ForexGPT Professional Terminal"
                  className="relative rounded-2xl shadow-2xl border border-border/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="py-16 bg-gradient-to-br from-orange-500/5 to-red-500/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Solving Cognitive Overload</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Markets move faster than human analysis. By the time you&apos;ve correlated a geopolitical headline with a currency pair&apos;s technical setup, the move might already be over. ForexGPT Professional Terminal serves as a <strong className="text-foreground">force multiplier</strong>, aggregating real-time price action, news sentiment, and risk metrics into a single, unified dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* Professional Terminal Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full text-sm font-medium text-purple-600 dark:text-purple-400 inline-block mb-4">
                NEW: Professional Terminal
              </span>
              <h2 className="text-4xl font-bold mb-4">Trading at the Speed of Thought</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                This is not just another charting library wrapper. It&apos;s a reimagining of the trading workspace where Generative AI is the core engine.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {terminalFeatures.map((feature, index) => {
                const Icon = iconMap[feature.icon];
                return (
                  <Card key={index} className="border-border/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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

        {/* Video Demo Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <span className="px-4 py-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-full text-sm font-medium text-red-600 dark:text-red-400 inline-block mb-4">
                Watch the Demo
              </span>
              <h2 className="text-4xl font-bold mb-4">See It In Action</h2>
              <p className="text-xl text-muted-foreground mb-8">
                ForexGPT founder Steven Hatzakis walks through a detailed preview of the Professional Terminal with agentic AI tools enabled.
              </p>
              
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/LbrWHFFLtpI"
                  title="ForexGPT Professional Terminal Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              
              <p className="text-sm text-muted-foreground mt-6">
                26-minute walkthrough covering agentic chat, voice prompts, 22 integrated tools, and the AI Co-Pilot in action.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Architecture Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full text-sm font-medium text-cyan-600 dark:text-cyan-400 inline-block mb-4">
                Under the Hood
              </span>
              <h2 className="text-4xl font-bold mb-4">Technical Architecture</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                For engineers and quantitative traders—the innovation lies in how we built this
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {architectureFeatures.map((feature, index) => {
                const Icon = iconMap[feature.icon];
                return (
                  <Card key={index} className="border-border/50 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
                    <CardContent className="p-6 space-y-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <h3 className="text-lg font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Platform Servers Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Access ForexGPT</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Multiple platform servers for different use cases and integrations
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {platforms.map((platform, index) => (
                <Card key={index} className={`border-border/50 transition-all duration-300 hover:shadow-lg ${index === 0 ? 'border-purple-500/50 shadow-lg shadow-purple-500/10' : 'hover:border-green-500/50'}`}>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{platform.name}</h3>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full inline-block ${index === 0 ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : platform.badgeColor}`}>
                      {platform.badge}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${platform.status === 'Alpha Preview' ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                      <span className={`text-sm ${platform.status === 'Alpha Preview' ? 'text-purple-600 dark:text-purple-400' : 'text-green-600 dark:text-green-400'}`}>{platform.status}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {platform.description}
                    </p>
                    <Button variant={index === 0 ? "default" : "outline"} className={`w-full ${index === 0 ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' : ''}`} asChild>
                      <a href={platform.url} target="_blank" rel="noopener noreferrer">
                        {index === 0 ? 'Try Alpha' : 'Access Server'}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Core Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Core Platform Features</h2>
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
                  Integration Ready
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
                      The Model Context Protocol (MCP) provides a standardized approach for AI models to interact with external tools and services. ForexGPT is built upon cutting-edge MCP, allowing the backend to standardize how the LLM &quot;sees&quot; the market through deterministic tool execution.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        22 Integrated Tools
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                          <span>get_price_history - Fetch historical OHLC data</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                          <span>analyze_sentiment - Market sentiment analysis</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                          <span>scan_market - Full market scanning</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                          <span>get_news_events - Real-time news feed</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                          <span>analyze_watchlist - Bulk asset analysis</span>
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
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                          <span>Voice prompt execution</span>
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

        {/* Pricing Section */}
        <section className="py-20 bg-muted/30">
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

        {/* Disclaimer */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-orange-500/5 to-red-500/5 border border-orange-500/20 rounded-2xl">
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Educational Purpose Disclaimer</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    ForexGPT is designed solely for <strong>educational and research purposes</strong>. It is not investment advice and should not be used as the sole basis for trading decisions. Not a solicitation to buy or sell securities. Always conduct your own research and consult with qualified financial advisors before making investment decisions. © ForexGPT LLC 2023-2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-green-600/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Welcome to the Trading Floor
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Less noise, more signal, and an intelligent partner sitting right next to you. Join the future of AI-driven trading.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <a href="https://demo.forex-gpt.ai" target="_blank" rel="noopener noreferrer">
                  Try Professional Terminal Alpha
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://forex-gpt.ai/faqs/" target="_blank" rel="noopener noreferrer">
                  Learn More
                </a>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ForexGPTShowcase;
