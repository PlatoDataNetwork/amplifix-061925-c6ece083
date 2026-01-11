import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { ExternalLink, Briefcase, TrendingUp, Users, Shield, Zap, Heart, Battery, Globe, Building2, Leaf, DollarSign, Handshake, Search } from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";
import { useLanguage } from "@/hooks/useLanguage";

const TwentyTwoXVenturesShowcase = () => {
  useLanguage();
  useGTranslateRefresh(true, []);
  
  return (
    <>
      <Helmet>
        <title>22X Ventures - Private Equity Redefined | AmplifiX Showcase</title>
        <meta name="description" content="22X Ventures empowers growth and secures tomorrow through strategic investments in wealth management, cryptocurrency, healthcare, energy, real estate, and AI technologies." />
        <meta name="keywords" content="22X Ventures, private equity, venture capital, wealth management, fintech, insurtech, healthcare investment, battery supply chain, AI investment, real estate" />
        <meta property="og:title" content="22X Ventures - Invest in the Future" />
        <meta property="og:description" content="Private equity firm focused on building futures through strategic investments across multiple sectors including healthcare, energy, technology, and real estate." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/showcase/22x-ventures" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="22X Ventures - Private Equity Excellence" />
        <meta name="twitter:description" content="Empowering growth and securing tomorrow through strategic investments." />
        <link rel="canonical" href="https://amplifix.ai/showcase/22x-ventures" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />

        {/* Hero Section */}
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block mb-6">
                  <div className="bg-primary/10 text-primary rounded-full px-4 py-2 border border-primary/20 text-sm font-medium">
                    Private Equity Firm
                  </div>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                  <span className="text-primary">22X Ventures</span><br />
                  Invest in the Future
                </h1>
                <p className="text-xl text-muted-foreground mb-4 leading-relaxed">
                  Every customer is a partner, every partner is a customer.
                </p>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Empowering growth and securing tomorrow through strategic investments in wealth management, cryptocurrency, healthcare, energy, real estate, and emerging technologies.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://22xventures.com" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                      Visit Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <a href="https://www.bing.com/copilotsearch?q=22X+Ventures+" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors">
                      AmplifiX Search
                      <Search className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl p-8 border border-border">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                      <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">Wealth</div>
                      <div className="text-sm text-muted-foreground">Management</div>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                      <Battery className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">Energy</div>
                      <div className="text-sm text-muted-foreground">Supply Chain</div>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                      <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">Healthcare</div>
                      <div className="text-sm text-muted-foreground">Life Science</div>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                      <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold">AI</div>
                      <div className="text-sm text-muted-foreground">Technology</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Focus Areas */}
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Investment Focus Areas</h2>
              <p className="text-xl text-muted-foreground text-center mb-12">Building Futures with Every Investment</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <DollarSign className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3">Wealth & Financial</h3>
                  <p className="text-muted-foreground">
                    Comprehensive wealth management, risk mitigation strategies, and financial planning solutions for individuals and businesses.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Zap className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3">Cryptocurrency & Fintech</h3>
                  <p className="text-muted-foreground">
                    Innovative investments in cryptocurrency, fintech platforms, and insurtech solutions driving the future of finance.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Battery className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3">Energy & Battery</h3>
                  <p className="text-muted-foreground">
                    Global battery supply chain investments addressing national security and sustainable energy storage solutions.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Heart className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3">Healthcare & Life Science</h3>
                  <p className="text-muted-foreground">
                    Strategic investments in medtech, transdermal drug delivery systems, and innovative healthcare solutions.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Building2 className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3">Real Estate & Communities</h3>
                  <p className="text-muted-foreground">
                    Mixed-use developments, assisted living facilities, and light industrial properties building strong communities.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Globe className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3">AI & Emerging Tech</h3>
                  <p className="text-muted-foreground">
                    Forward-looking investments in artificial intelligence, data management, and emerging technologies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Funds */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Featured Investment Funds</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card p-8 rounded-xl border border-border">
                  <Battery className="w-16 h-16 text-primary mb-6" />
                  <h3 className="text-2xl font-bold mb-4">22X Atom Fund</h3>
                  <p className="text-muted-foreground mb-4">
                    Focused on building a vertically integrated global battery supply chain addressing critical national security challenges and sustainable energy solutions.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Raw Material Security
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Manufacturing Independence
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Recycling Technologies
                    </li>
                  </ul>
                </div>
                <div className="bg-card p-8 rounded-xl border border-border">
                  <Heart className="w-16 h-16 text-primary mb-6" />
                  <h3 className="text-2xl font-bold mb-4">22X Apollo Fund</h3>
                  <p className="text-muted-foreground mb-4">
                    Strategic healthcare investments capitalizing on technological advancements, aging population trends, and personalized care innovations.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Digital Health Innovation
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Biotechnology Advancement
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Medical Devices
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Impact */}
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Community Impact</h2>
              <p className="text-xl text-muted-foreground text-center mb-12">Investing to Build Strong and Resilient Communities</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <Users className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Sports & Media</h3>
                  <p className="text-sm text-muted-foreground">
                    Athlete-focused financial solutions and supply chain support
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <Handshake className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Employee Ownership</h3>
                  <p className="text-sm text-muted-foreground">
                    Creating economic and social value through ownership models
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Special Needs</h3>
                  <p className="text-sm text-muted-foreground">
                    Lifetime funding support for individuals with special needs
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <Leaf className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Faith & Nonprofits</h3>
                  <p className="text-sm text-muted-foreground">
                    Supporting local communities and social values
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why 22X Ventures */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Partner with 22X Ventures</h2>
              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Handshake className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Partner-Centric Approach</h3>
                    <p className="text-muted-foreground">
                      Every customer is a partner, every partner is a customer. We foster relationships built on mutual success and shared vision for growth.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Diversified Portfolio</h3>
                    <p className="text-muted-foreground">
                      Strategic investments across multiple sectors including healthcare, energy, technology, and real estate to maximize returns and minimize risk.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">National Security Focus</h3>
                    <p className="text-muted-foreground">
                      Investments addressing critical supply chain vulnerabilities and supporting strategic independence in key technology sectors.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Community Impact</h3>
                    <p className="text-muted-foreground">
                      Commitment to building strong, resilient communities through complimentary MarTech access and support for nonprofits, sports, and special needs organizations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Partner with 22X Ventures</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Explore investment opportunities and discover how 22X Ventures can help you build a brighter tomorrow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://calendly.com/22xventures/vip30" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                    Schedule a Meeting
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <LanguageAwareLink to="/showcase">
                  <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors">
                    Explore AmplifiX
                    <Briefcase className="ml-2 h-4 w-4" />
                  </Button>
                </LanguageAwareLink>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Showcase */}
        <div className="py-12 border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <LanguageAwareLink to="/showcase">
              <Button variant="outline" size="lg">
                ← Back to Showcase
              </Button>
            </LanguageAwareLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default TwentyTwoXVenturesShowcase;
