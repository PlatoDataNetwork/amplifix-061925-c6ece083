import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink, TrendingUp, Users, Award, Calendar, DollarSign, Building, Globe, Lightbulb, Target, CheckCircle, BarChart3, Leaf, Recycle, Earth, TreePine, Wind } from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";

const KarbonXShowcase = () => {
  return (
    <>
      <Helmet>
        <title>Karbon-X Showcase - Carbon Credits & Climate Solutions | AmplifiX</title>
        <meta name="description" content="Explore Karbon-X's innovative carbon credit marketplace and climate solutions. Discover how they're revolutionizing carbon emissions mitigation through verified carbon credits and sustainable technology." />
        <meta name="keywords" content="Karbon-X, carbon credits, climate solutions, carbon emissions, sustainability, environmental technology, carbon marketplace, verified carbon credits" />
        <meta property="og:title" content="Karbon-X Showcase - Carbon Credits & Climate Solutions" />
        <meta property="og:description" content="Leading carbon credit marketplace providing verified solutions for carbon emissions mitigation and climate impact." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/showcase/karbon-x" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Karbon-X Climate Solutions Showcase" />
        <meta name="twitter:description" content="Innovative carbon credit marketplace transforming how businesses meet sustainability goals." />
        <link rel="canonical" href="https://amplifix.ai/showcase/karbon-x" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        {/* Navigation */}
        <MainHeader />

        {/* Hero Section */}
        <section className="pt-24 container mx-auto py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-green-500/10 px-6 py-3 rounded-full mb-6">
                <Earth className="h-6 w-6 text-green-500" />
                <span className="text-green-500 font-semibold">Carbon Solutions Leader</span>
              </div>
              <div className="mb-6">
                <img 
                  src="/lovable-uploads/15d3e19c-10e7-417c-8702-ef2c13a858ed.png" 
                  alt="Karbon-X Logo" 
                  className="h-16 md:h-20 mx-auto mb-4"
                />
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Climate Impact Platform
                </h1>
              </div>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto">
                Pioneering verified carbon credits that make a real, positive impact around the world. 
                Karbon-X is built on the belief that everyone can drive climate change through 
                high-integrity, third-party verified carbon reduction projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://www.karbon-x.com/" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-highlight-blue text-white hover:bg-highlight-blue/90">
                    Visit Karbon-X
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <a href="https://www.tradingview.com/symbols/OTC-KARX/" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-border hover:bg-accent">
                    Live Stock Price
                    <BarChart3 className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
            
            {/* Company Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <Globe className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Global Reach</h3>
                <p className="text-muted-foreground text-sm">
                  Operating carbon projects across UK, Nepal, India and expanding globally
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Verified Credits</h3>
                <p className="text-muted-foreground text-sm">
                  All projects third-party verified for maximum integrity and impact
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <Target className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Tailored Solutions</h3>
                <p className="text-muted-foreground text-sm">
                  Custom carbon solutions for individuals and businesses of all sizes
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Solutions Section */}
        <section className="container mx-auto py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Carbon Solutions Portfolio</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Comprehensive carbon credit solutions designed to meet diverse sustainability goals 
                and regulatory requirements while maximizing climate impact.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-xl border border-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Individual Solutions</h3>
                    <p className="text-sm text-muted-foreground">Personal carbon footprint reduction</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Easy-to-use carbon offset solutions for individuals looking to reduce their personal 
                  carbon footprint through verified, high-impact projects.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Personal carbon calculators</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Verified offset projects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Impact tracking & reporting</span>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-xl border border-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Building className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Enterprise Solutions</h3>
                    <p className="text-sm text-muted-foreground">Corporate sustainability programs</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Comprehensive carbon management solutions for businesses meeting regulatory 
                  requirements and achieving net-zero commitments.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Regulatory compliance support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Custom project portfolios</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">ESG reporting integration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Competitive Advantages */}
        <section className="container mx-auto py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Why Choose Karbon-X</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Leading the carbon credit marketplace with verified, high-integrity projects 
                that deliver real climate impact and meet the highest standards.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <Earth className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Planet Before Profit</h3>
                <p className="text-muted-foreground text-sm">
                  Mission-driven approach prioritizing climate impact over financial returns
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Third-Party Verified</h3>
                <p className="text-muted-foreground text-sm">
                  All projects independently verified for maximum credibility and impact
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <Target className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Tailored Solutions</h3>
                <p className="text-muted-foreground text-sm">
                  Custom carbon strategies adapted to specific needs and requirements
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <BarChart3 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Measurable Impact</h3>
                <p className="text-muted-foreground text-sm">
                  Transparent tracking and reporting of carbon reduction achievements
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Highlights */}
        <section className="container mx-auto py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Market Opportunity</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Positioned at the forefront of the rapidly growing carbon credit market, 
                addressing critical climate challenges with innovative technology solutions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-xl border border-border">
                <TrendingUp className="h-12 w-12 text-highlight-blue mb-6" />
                <h3 className="text-xl font-bold mb-4">Growing Market Demand</h3>
                <p className="text-muted-foreground mb-4">
                  Carbon credit market projected to reach $100B+ by 2030 driven by regulatory 
                  requirements and corporate net-zero commitments.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market Growth</span>
                    <span className="font-semibold">25%+ CAGR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Enterprise Adoption</span>
                    <span className="font-semibold">Rising</span>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-xl border border-border">
                <Globe className="h-12 w-12 text-green-500 mb-6" />
                <h3 className="text-xl font-bold mb-4">Global Project Portfolio</h3>
                <p className="text-muted-foreground mb-4">
                  Diversified portfolio of verified carbon projects across multiple regions 
                  and impact categories for maximum resilience.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Project Regions</span>
                    <span className="font-semibold">UK, Nepal, India+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Verification</span>
                    <span className="font-semibold">Third-Party</span>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-xl border border-border">
                <Lightbulb className="h-12 w-12 text-purple-500 mb-6" />
                <h3 className="text-xl font-bold mb-4">Technology Platform</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced platform integrating project verification, carbon tracking, 
                  and impact measurement for transparent reporting.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Type</span>
                    <span className="font-semibold">End-to-End</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Integration</span>
                    <span className="font-semibold">ESG Reporting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="container mx-auto py-16 px-4 bg-gradient-to-r from-highlight-blue/10 to-green-500/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Partner with Climate Leaders</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join Karbon-X in driving meaningful climate impact through verified carbon solutions. 
              Discover how AmplifiX can help amplify your sustainability message.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://www.karbon-x.com/" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-highlight-blue text-white hover:bg-highlight-blue/90">
                  Explore Karbon-X Platform
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-border hover:bg-accent">
                  Discuss Partnership
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default KarbonXShowcase;