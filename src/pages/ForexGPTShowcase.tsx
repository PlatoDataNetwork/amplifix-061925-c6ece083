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
import forexGptThumbnail from "@/../../public/lovable-uploads/forex-gpt-thumbnail.png";

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
      description: "Get real-time forex market insights powered by GPT-4o mini, delivering analysis across 100+ assets and 22 timeframes.",
      icon: "brain"
    },
    {
      title: "ForexGPT Sentiment Score",
      description: "Quickly analyze charts with the Sentiment Score ranging from -100 (very bearish) to +100 (very bullish).",
      icon: "chart"
    },
    {
      title: "Trading Signals & Setups",
      description: "Receive AI-generated trading signals with example setups and risk management advice for various market conditions.",
      icon: "target"
    },
    {
      title: "AiWatchlist & Heatmap",
      description: "Analyze multiple assets per timeframe or multiple timeframes per asset with our advanced screening tools.",
      icon: "linechart"
    },
    {
      title: "24/7 Real-Time Insights",
      description: "Access around-the-clock analysis across forex, crypto, indices, commodities, and bonds—120 symbols in total.",
      icon: "clock"
    },
    {
      title: "MCP Server Integration",
      description: "Connect your favorite MCP client to interact with ForexGPT using natural language or programmatically via API.",
      icon: "globe"
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
                  <Button size="lg" variant="ghost" asChild>
                    <LanguageAwareLink to="/showcase">
                      ← Back to Showcase
                    </LanguageAwareLink>
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
