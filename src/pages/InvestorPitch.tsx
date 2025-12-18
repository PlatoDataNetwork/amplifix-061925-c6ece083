import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Lock, ArrowRight, TrendingUp, Users, Globe, Zap, BarChart3, Target, Award, Briefcase, ChevronRight, Play, CheckCircle2, AlertTriangle, Clock, DollarSign, XCircle, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";

const AmplifiXIcon = () => (
  <img 
    src="/lovable-uploads/27fcb1ac-666f-4a63-a383-b63576970769.png" 
    alt="AmplifiX Logo"
    className="w-10 h-10"
  />
);

const CORRECT_PASSWORD = "W3AI";

const InvestorPitch = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("pitch_auth");
    if (stored === "true") setIsAuthenticated(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("pitch_auth", "true");
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Investor Access | AmplifiX</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-highlight-blue/20 to-highlight-blue/5 mb-6">
                <Lock className="w-10 h-10 text-highlight-blue" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">Investor Access</h1>
              <p className="text-muted-foreground">Enter credentials to view presentation</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="h-14 text-lg px-6 rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm focus:border-highlight-blue focus:ring-highlight-blue/20"
                  autoFocus
                />
              </div>
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
              <Button 
                type="submit" 
                className="w-full h-14 text-lg rounded-2xl bg-highlight-blue hover:bg-highlight-blue/90 text-white font-medium transition-all duration-300 hover:scale-[1.02]"
              >
                Access Presentation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </>
    );
  }

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "problem", label: "Problem" },
    { id: "solution", label: "Solution" },
    { id: "market", label: "Market" },
    { id: "platform", label: "Platform" },
    { id: "traction", label: "Traction" },
    { id: "team", label: "Team" },
    { id: "investment", label: "Investment" },
  ];

  return (
    <>
      <Helmet>
        <title>Investor Presentation | AmplifiX</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Sticky Navigation */}
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AmplifiXIcon />
                <span className="font-semibold text-xl tracking-tight">AmplifiX</span>
              </div>
              <div className="hidden md:flex items-center gap-1">
                {sections.map((section, idx) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(idx);
                      document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeSection === idx 
                        ? "bg-highlight-blue text-white" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="overview" className="relative overflow-hidden py-24 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-highlight-blue/5 via-transparent to-transparent" />
          <div className="max-w-6xl mx-auto px-6 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-highlight-blue/10 text-highlight-blue text-sm font-medium mb-8">
                <span className="w-2 h-2 rounded-full bg-highlight-blue animate-pulse" />
                Investor Presentation Q4 2024
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                The Future of
                <span className="bg-gradient-to-r from-highlight-blue to-blue-500 bg-clip-text text-transparent"> Investor Relations</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
                AI-powered platform transforming how public companies connect with investors through intelligent automation and real-time analytics.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <a href="/public-companies" className="w-full sm:w-auto">
                  <Button className="w-full h-14 px-10 rounded-2xl bg-highlight-blue hover:bg-highlight-blue/90 text-white text-lg font-semibold">
                    Public Companies
                  </Button>
                </a>
                <a href="/private-companies" className="w-full sm:w-auto">
                  <Button className="w-full h-14 px-10 rounded-2xl bg-highlight-blue hover:bg-highlight-blue/90 text-white text-lg font-semibold">
                    Private Companies
                  </Button>
                </a>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button className="h-14 px-8 rounded-2xl bg-foreground text-background hover:bg-foreground/90 text-lg font-medium">
                  <Play className="w-5 h-5 mr-2" /> Watch Demo
                </Button>
                <Button variant="outline" className="h-14 px-8 rounded-2xl text-lg font-medium border-2">
                  Download Deck
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section id="problem" className="py-24 bg-gradient-to-br from-destructive/5 via-background to-background">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-6">
                <AlertTriangle className="w-4 h-4" />
                The Challenge
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">The Problem We Solve</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Public companies face critical challenges in investor communications</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { icon: Clock, title: "Time-Consuming Manual Processes", desc: "IR teams spend 60%+ of their time on repetitive tasks like report generation, email outreach, and data compilation instead of strategic investor engagement." },
                { icon: XCircle, title: "Fragmented Tools & Data Silos", desc: "Companies juggle 8-12 different platforms for CRM, analytics, distribution, and compliance—leading to inefficiency and missed opportunities." },
                { icon: DollarSign, title: "High Costs, Low ROI", desc: "Traditional IR agencies charge $50K-$200K annually with minimal transparency on performance metrics and investor reach." },
                { icon: Users, title: "Limited Investor Visibility", desc: "Most companies have no insight into who reads their materials, which investors are engaged, or how to optimize their messaging for maximum impact." },
              ].map((problem, idx) => (
                <Card key={idx} className="border-0 bg-card/50 backdrop-blur-sm shadow-xl shadow-black/5 hover:shadow-2xl transition-all duration-500 group border-l-4 border-l-destructive/50">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <problem.icon className="w-7 h-7 text-destructive" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{problem.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <ArrowDown className="w-8 h-8 text-muted-foreground animate-bounce" />
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="solution" className="py-24 bg-muted/30">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-highlight-blue/10 text-highlight-blue text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                The Solution
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">How AmplifiX Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">One unified platform powered by AI to transform investor relations</p>
            </div>
            
            {/* Visual Diagram */}
            <div className="relative mb-16">
              <div className="bg-card rounded-3xl border border-border/50 shadow-2xl shadow-black/10 p-8 md:p-12 overflow-hidden">
                {/* Flow Diagram */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-2 items-center">
                  {/* Input */}
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-4">
                      <Globe className="w-10 h-10 text-foreground/60" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">Data Sources</h4>
                    <p className="text-xs text-muted-foreground">Press, Filings, News</p>
                  </div>
                  
                  {/* Arrow */}
                  <div className="hidden md:flex justify-center">
                    <ArrowRight className="w-8 h-8 text-highlight-blue" />
                  </div>
                  
                  {/* AmplifiX Core */}
                  <div className="text-center relative">
                    <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-highlight-blue to-blue-600 flex items-center justify-center mb-4 shadow-xl shadow-highlight-blue/30">
                      <div className="text-center">
                        <AmplifiXIcon />
                        <span className="text-white font-bold text-xs mt-1 block">AI Engine</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">AmplifiX Platform</h4>
                    <p className="text-xs text-muted-foreground">Process & Amplify</p>
                  </div>
                  
                  {/* Arrow */}
                  <div className="hidden md:flex justify-center">
                    <ArrowRight className="w-8 h-8 text-highlight-blue" />
                  </div>
                  
                  {/* Output */}
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center mb-4">
                      <TrendingUp className="w-10 h-10 text-green-500" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">Results</h4>
                    <p className="text-xs text-muted-foreground">Engaged Investors</p>
                  </div>
                </div>
                
                {/* Features Row */}
                <div className="mt-12 pt-8 border-t border-border/50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { icon: BarChart3, label: "Real-time Analytics" },
                      { icon: Target, label: "Smart Targeting" },
                      { icon: Globe, label: "500+ Channels" },
                      { icon: Award, label: "SEC Compliant" },
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                        <feature.icon className="w-5 h-5 text-highlight-blue flex-shrink-0" />
                        <span className="text-sm font-medium">{feature.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Value Props */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { value: "80%", label: "Time Saved", desc: "Automate repetitive IR tasks" },
                { value: "10x", label: "Reach Increase", desc: "Multi-channel distribution" },
                { value: "50%", label: "Cost Reduction", desc: "vs. traditional IR agencies" },
              ].map((prop, idx) => (
                <div key={idx} className="text-center p-8 rounded-3xl bg-card border border-border/50">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-highlight-blue to-blue-500 bg-clip-text text-transparent mb-2">{prop.value}</div>
                  <div className="font-semibold text-lg mb-1">{prop.label}</div>
                  <div className="text-sm text-muted-foreground">{prop.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Market Opportunity */}
        <section id="market" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Market Opportunity</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Capturing a rapidly expanding global market</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { value: "$4.2B", label: "Total Addressable Market", sublabel: "IR & Communications Tech", icon: Globe },
                { value: "23%", label: "Annual Growth Rate", sublabel: "CAGR 2024-2030", icon: TrendingUp },
                { value: "15,000+", label: "Target Companies", sublabel: "Public Companies Globally", icon: Target },
              ].map((stat, idx) => (
                <Card key={idx} className="border-0 bg-card/50 backdrop-blur-sm shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-highlight-blue/5 transition-all duration-500 group">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-highlight-blue/20 to-highlight-blue/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-7 h-7 text-highlight-blue" />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">{stat.value}</div>
                    <div className="text-lg font-medium text-foreground mb-1">{stat.label}</div>
                    <div className="text-sm text-muted-foreground">{stat.sublabel}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Features */}
        <section id="platform" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Our Platform</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Enterprise-grade tools powering investor relations</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "AI Intelligence", desc: "Real-time market sentiment analysis and predictive investor behavior modeling" },
                { icon: BarChart3, title: "Advanced Analytics", desc: "Comprehensive dashboards tracking engagement, reach, and conversion metrics" },
                { icon: Globe, title: "Global Distribution", desc: "Multi-channel content syndication across 500+ financial platforms" },
                { icon: Users, title: "CRM Integration", desc: "Seamless investor database management with automated outreach" },
                { icon: Target, title: "Targeting Engine", desc: "AI-powered investor matching based on sector, strategy, and behavior" },
                { icon: Award, title: "Compliance Ready", desc: "SEC-compliant workflows with audit trails and approval systems" },
              ].map((feature, idx) => (
                <div key={idx} className="group p-8 rounded-3xl bg-gradient-to-br from-muted/50 to-transparent border border-border/50 hover:border-highlight-blue/30 hover:bg-highlight-blue/5 transition-all duration-500">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-highlight-blue to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Traction & Metrics */}
        <section id="traction" className="py-24 bg-gradient-to-br from-foreground to-foreground/95">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-background mb-4">Proven Beta Test Traction</h2>
              <p className="text-xl text-background/70 max-w-2xl mx-auto">Real results from real clients</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { value: "20+", label: "Active Clients" },
                { value: "$500K", label: "Revenue" },
                { value: "65%", label: "Retention Rate" },
                { value: "150%", label: "YoY Growth" },
              ].map((metric, idx) => (
                <div key={idx} className="text-center p-8 rounded-3xl bg-background/10 backdrop-blur-sm">
                  <div className="text-4xl md:text-5xl font-bold text-background mb-2">{metric.value}</div>
                  <div className="text-background/70 font-medium">{metric.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-16 grid md:grid-cols-3 gap-6">
              {[
                "Strategic partnerships with major financial data providers",
                "Integration with Bloomberg, Reuters, and Yahoo Finance",
                "White-label solutions for investment banks",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-6 rounded-2xl bg-background/5">
                  <CheckCircle2 className="w-6 h-6 text-highlight-blue flex-shrink-0 mt-0.5" />
                  <span className="text-background/90">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Leadership Team</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Experienced operators and industry veterans</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Executive Team", role: "Combined 60+ years in IR & FinTech", highlights: ["Ex-Goldman Sachs", "Ex-Bloomberg", "IPO experience"] },
                { name: "Advisory Board", role: "Strategic guidance from industry leaders", highlights: ["Fortune 500 IROs", "VC Partners", "Regulatory experts"] },
                { name: "Technical Team", role: "World-class engineering talent", highlights: ["AI/ML specialists", "Enterprise architects", "Security experts"] },
              ].map((team, idx) => (
                <Card key={idx} className="border-0 bg-card/50 backdrop-blur-sm shadow-xl shadow-black/5 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-6">
                      <Briefcase className="w-8 h-8 text-foreground/50" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{team.name}</h3>
                    <p className="text-muted-foreground mb-4">{team.role}</p>
                    <div className="space-y-2">
                      {team.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ChevronRight className="w-4 h-4 text-highlight-blue" />
                          {h}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Investment Ask */}
        <section id="investment" className="py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Investment Opportunity</h2>
              <p className="text-xl text-muted-foreground">Proposed Annual Budget</p>
            </div>
            <Card className="border-0 bg-card shadow-2xl shadow-black/10 overflow-hidden">
              <CardContent className="p-10 md:p-16">
                <div className="text-center mb-12">
                  <div className="text-6xl md:text-7xl font-bold text-foreground mb-2">$500K</div>
                  <div className="text-xl text-muted-foreground">Proposed Annual Budget</div>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Budget Allocation</h4>
                    <div className="space-y-3">
                      {[
                        { label: "Sales & Marketing", pct: "60%" },
                        { label: "Digital Inventory", pct: "10%" },
                        { label: "Product Development", pct: "10%" },
                        { label: "Operations", pct: "10%" },
                        { label: "G&A", pct: "10%" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="font-semibold">{item.pct}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Key Milestones</h4>
                    <div className="space-y-3">
                      {[
                        "Launch AI 2.0 platform",
                        "Enter European markets",
                        "Expand to Middle East & Asia",
                        "Enter Australian market",
                        "Achieve $2M ARR",
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-highlight-blue/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-highlight-blue">{idx + 1}</span>
                          </div>
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Button className="h-16 px-12 rounded-2xl bg-highlight-blue hover:bg-highlight-blue/90 text-white text-lg font-semibold transition-all duration-300 hover:scale-[1.02]">
                    Schedule a Meeting
                    <ArrowRight className="ml-3 w-5 h-5" />
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">investors@amplifix.net</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default InvestorPitch;
