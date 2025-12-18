import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Lock, ArrowRight, TrendingUp, Users, Globe, Zap, BarChart3, Target, Award, Briefcase, ChevronRight, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";

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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-highlight-blue to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
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

        {/* Market Opportunity */}
        <section id="market" className="py-24 bg-muted/30">
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
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-background mb-4">Proven Traction</h2>
              <p className="text-xl text-background/70 max-w-2xl mx-auto">Demonstrated growth across key metrics</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { value: "50+", label: "Active Clients" },
                { value: "$2.4M", label: "ARR" },
                { value: "340%", label: "YoY Growth" },
                { value: "95%", label: "Retention Rate" },
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
              <p className="text-xl text-muted-foreground">Series A funding round</p>
            </div>
            <Card className="border-0 bg-card shadow-2xl shadow-black/10 overflow-hidden">
              <CardContent className="p-10 md:p-16">
                <div className="text-center mb-12">
                  <div className="text-6xl md:text-7xl font-bold text-foreground mb-2">$8M</div>
                  <div className="text-xl text-muted-foreground">Target Raise</div>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Use of Funds</h4>
                    <div className="space-y-3">
                      {[
                        { label: "Product Development", pct: "40%" },
                        { label: "Sales & Marketing", pct: "35%" },
                        { label: "Operations", pct: "15%" },
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
                        "Expand to 150+ clients",
                        "Enter European market",
                        "Achieve $10M ARR",
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
