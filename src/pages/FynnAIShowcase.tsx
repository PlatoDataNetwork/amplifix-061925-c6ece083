import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { ExternalLink, TrendingUp, Users, Award, Calendar, DollarSign, Building, Globe, Lightbulb, Target, CheckCircle, BarChart3, Brain, Bot, Zap, Shield, Cpu, Network } from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";

const FynnAIShowcase = () => {
  useGTranslateRefresh(true);
  return (
    <>
      <Helmet>
        <title>FYNN AI Showcase - Web3 AI Fintech Solutions | AmplifiX</title>
        <meta name="description" content="Explore FYNN AI's innovative Web3 AI fintech platform. Discover how they're revolutionizing investment strategies with AI-powered trading solutions and blockchain technology." />
        <meta name="keywords" content="FYNN AI, Web3, AI fintech, trading platform, blockchain, investment strategies, artificial intelligence, personal advisor, real-time market data" />
        <meta property="og:title" content="FYNN AI Showcase - Web3 AI Fintech Solutions" />
        <meta property="og:description" content="Leading Web3 AI holding company investing in the next generation of fintech innovation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/showcase/fynn-ai" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FYNN AI Fintech Solutions Showcase" />
        <meta name="twitter:description" content="Revolutionary Web3 AI platform transforming investment and trading strategies." />
        <link rel="canonical" href="https://amplifix.ai/showcase/fynn-ai" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        {/* Navigation */}
        <MainHeader />

        {/* Hero Section */}
        <section className="pt-24 container mx-auto py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-highlight-blue/10 px-6 py-3 rounded-full mb-6">
                <img src="/lovable-uploads/81a540f7-53d1-4835-a86f-983e8a85e38c.png" alt="FYNN AI Logo" className="h-8 w-8" />
                <span className="text-highlight-blue font-semibold">Web3 AI Innovation</span>
              </div>
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  FYNN AI Platform
                  <span className="text-highlight-blue block">Next-Gen Fintech Solutions</span>
                </h1>
              </div>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto">
                FYNN AI is a Web3 AI Holding company investing in the next generation of innovation across the sector. 
                Our AI-powered platform leverages cutting-edge technology to analyze large datasets, create investment 
                strategies, and provide real-time market insights for smart investment decisions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button asChild size="lg" className="bg-highlight-blue hover:bg-highlight-blue/90 text-white">
                  <a href="https://fyntechnical.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Visit FYNN AI
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="https://www.tradingview.com/symbols/OTC-FYNN/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Live Stock Price (OTCQB: FYNN)
                  </a>
                </Button>
              </div>

              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Bot className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">AI Personal Advisor</h3>
                  <p className="text-muted-foreground text-sm mt-2">Advanced AI algorithms for personalized investment guidance</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <Network className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Web3 Integration</h3>
                  <p className="text-muted-foreground text-sm mt-2">Blockchain-powered trading infrastructure</p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center">
                  <BarChart3 className="h-8 w-8 text-highlight-blue mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Real-Time Analytics</h3>
                  <p className="text-muted-foreground text-sm mt-2">Live market data and intelligent insights</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Solutions Portfolio */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Fintech Solutions Portfolio</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Comprehensive suite of AI-powered financial technology solutions designed for the modern investor
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="bg-card border rounded-lg p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="h-8 w-8 text-highlight-blue" />
                    <h3 className="text-2xl font-semibold">AI Personal Advisor</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    The Advisor leverages AI to analyze large data sets, creates investment strategies and portfolios 
                    with real-time market data and insights enabling smart investment decisions.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Advanced data analysis and pattern recognition</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Personalized investment strategies</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Real-time market monitoring and alerts</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-card border rounded-lg p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="h-8 w-8 text-highlight-blue" />
                    <h3 className="text-2xl font-semibold">Blockchain Trading Platform</h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    We harness the power of Blockchain to execute orders swiftly, eliminating the need for setting up 
                    a traditional broker account. Register. Click to trade. Pay with USDT. Smart Contracts do the rest.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Swift blockchain-powered order execution</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>No traditional broker account required</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>USDT payment integration</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose FYNN AI */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose FYNN AI</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Leading the future of fintech with innovative Web3 AI solutions that democratize access to intelligent investing
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Cpu className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">AI-First Approach</h3>
                  <p className="text-muted-foreground">
                    Cutting-edge artificial intelligence at the core of every solution
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Secure Infrastructure</h3>
                  <p className="text-muted-foreground">
                    Blockchain-powered security and smart contract automation
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Target className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Precision Analytics</h3>
                  <p className="text-muted-foreground">
                    Real-time market data analysis for informed decision making
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-highlight-blue/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-10 w-10 text-highlight-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Global Innovation</h3>
                  <p className="text-muted-foreground">
                    Investing in next-generation innovation across the Web3 sector
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Market Opportunity */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Market Opportunity</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Positioned at the intersection of Web3, AI, and fintech - three of the fastest-growing technology sectors
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-card border rounded-lg p-8 text-center">
                  <DollarSign className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-3">Growing AI Fintech Market</h3>
                  <p className="text-muted-foreground">
                    The AI in fintech market is projected to reach $44.08 billion by 2030, growing at a CAGR of 16.5%
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-8 text-center">
                  <Network className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-3">Web3 Adoption</h3>
                  <p className="text-muted-foreground">
                    Web3 technologies are revolutionizing financial services with decentralized, transparent solutions
                  </p>
                </div>

                <div className="bg-card border rounded-lg p-8 text-center">
                  <Lightbulb className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-3">Innovation Leadership</h3>
                  <p className="text-muted-foreground">
                    Pioneering the convergence of AI and blockchain for next-generation financial products
                  </p>
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
                Partner with AI Innovation Leaders
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join FYNN AI in revolutionizing the future of fintech through Web3 and artificial intelligence. 
                Discover how our platform can transform your investment strategy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <a href="https://fyntechnical.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Explore FYNN AI Platform
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <LanguageAwareLink to="/contact" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Discuss Partnership
                  </LanguageAwareLink>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default FynnAIShowcase;