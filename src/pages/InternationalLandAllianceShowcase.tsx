import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink, TrendingUp, Users, Award, Calendar, DollarSign, Building, Globe, Lightbulb, Target, CheckCircle, BarChart3, MapPin, Home, Waves, Mountain, Sun, TreePine } from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";

const InternationalLandAllianceShowcase = () => {
  return (
    <>
      <Helmet>
        <title>International Land Alliance Showcase - Mexico Vacation Properties | AmplifiX</title>
        <meta name="description" content="Explore International Land Alliance's premium Mexico vacation property investments in Baja. Discover residential communities, waterfront properties, and retirement destinations starting at $35,000." />
        <meta name="keywords" content="International Land Alliance, Mexico real estate, Baja properties, vacation homes, retirement communities, property investment, Oasis Park Resort, waterfront properties" />
        <meta property="og:title" content="International Land Alliance Showcase - Mexico Vacation Properties" />
        <meta property="og:description" content="Premium Mexico vacation property investment firm developing residential communities for home buyers, vacation homes, and retirement." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/showcase/international-land-alliance" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="International Land Alliance Mexico Properties Showcase" />
        <meta name="twitter:description" content="Discover paradise with premium Mexico vacation properties and retirement communities in Baja." />
        <link rel="canonical" href="https://amplifix.ai/showcase/international-land-alliance" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        {/* Navigation */}
        <MainHeader />

        {/* Hero Section */}
        <section className="pt-24 container mx-auto py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 bg-blue-500/10 px-6 py-3 rounded-full mb-6">
                <Sun className="h-6 w-6 text-blue-500" />
                <span className="text-blue-500 font-semibold">OTCQB: ILAL</span>
              </div>
              <div className="mb-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  International Land Alliance
                </h1>
                <p className="text-2xl md:text-3xl text-highlight-blue font-semibold">
                  Your search for paradise starts and ends here
                </p>
              </div>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto">
                International Land Alliance is a Mexico vacation property investment firm based in San Diego, California. 
                The company develops and sells residential communities for home buyers, vacation/second homes, 
                retirement, and investors across Baja's most desirable locations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://www.internationallandalliance.com/" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-highlight-blue text-white hover:bg-highlight-blue/90">
                    Visit ILA Website
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <a href="https://www.otcmarkets.com/stock/ILAL/overview" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-border hover:bg-accent">
                    Stock Information
                    <BarChart3 className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
            
            {/* Company Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <MapPin className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Prime Locations</h3>
                <p className="text-muted-foreground text-sm">
                  Strategic properties across Baja's most desirable coastal and inland locations
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <DollarSign className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Affordable Entry</h3>
                <p className="text-muted-foreground text-sm">
                  Residential estates starting at $35,000 with flexible financing options
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <Building className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Master Planned</h3>
                <p className="text-muted-foreground text-sm">
                  Professionally designed communities with full infrastructure and amenities
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Properties Section */}
        <section className="container mx-auto py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Featured Properties</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Discover our flagship developments offering the perfect blend of natural beauty, 
                modern amenities, and investment potential in Mexico's most sought-after locations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-xl border border-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Waves className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Oasis Park Resort</h3>
                    <p className="text-sm text-muted-foreground">497-acre master planned community</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Located 2.5 hours south of the San Diego-Tijuana Border along the coastal highway 
                  to the San Felipe-Puertecitos corridor. Features 1,344 residential estates with 
                  starting prices at $35,000.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">1,344 residential estates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Starting at $35,000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Coastal highway access</span>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-xl border border-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Mountain className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Property Portfolio</h3>
                    <p className="text-sm text-muted-foreground">Diverse investment opportunities</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Comprehensive portfolio including commercial, recreational, waterfront, 
                  ranch hotel, and marina properties across Baja's most desirable regions.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Commercial developments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Waterfront properties</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Marina & recreational</span>
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
              <h2 className="text-4xl font-bold mb-6">Why Choose International Land Alliance</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Strategic advantages that make ILA the premier choice for Mexico vacation 
                property investment and retirement community development.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <MapPin className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Strategic Location</h3>
                <p className="text-muted-foreground text-sm">
                  Based in San Diego with deep knowledge of Baja's best locations
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <Building className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Master Planning</h3>
                <p className="text-muted-foreground text-sm">
                  Professional development with full infrastructure and community amenities
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <Target className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Diverse Portfolio</h3>
                <p className="text-muted-foreground text-sm">
                  Multiple property types for vacation, retirement, and investment needs
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <DollarSign className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Affordable Access</h3>
                <p className="text-muted-foreground text-sm">
                  Entry-level pricing with financing options for broader accessibility
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
                Positioned at the intersection of growing retirement migration, vacation home demand, 
                and Mexico's expanding real estate market accessibility.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-xl border border-border">
                <TrendingUp className="h-12 w-12 text-highlight-blue mb-6" />
                <h3 className="text-xl font-bold mb-4">Growing Demand</h3>
                <p className="text-muted-foreground mb-4">
                  Increasing U.S. retiree migration to Mexico combined with rising vacation 
                  home ownership creates sustained market demand.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Retirement Migration</span>
                    <span className="font-semibold">Growing</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vacation Homes</span>
                    <span className="font-semibold">Rising Demand</span>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-xl border border-border">
                <Globe className="h-12 w-12 text-green-500 mb-6" />
                <h3 className="text-xl font-bold mb-4">Geographic Advantage</h3>
                <p className="text-muted-foreground mb-4">
                  Strategic positioning in Baja provides easy cross-border access while 
                  offering lower costs and attractive investment potential.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Border Access</span>
                    <span className="font-semibold">2.5 Hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost Advantage</span>
                    <span className="font-semibold">Significant</span>
                  </div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-xl border border-border">
                <Lightbulb className="h-12 w-12 text-purple-500 mb-6" />
                <h3 className="text-xl font-bold mb-4">Development Expertise</h3>
                <p className="text-muted-foreground mb-4">
                  Proven track record in master-planned community development with 
                  comprehensive infrastructure and amenity integration.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Community Size</span>
                    <span className="font-semibold">1,344+ Units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Development</span>
                    <span className="font-semibold">Master Planned</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="container mx-auto py-16 px-4 bg-gradient-to-r from-highlight-blue/10 to-green-500/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Discover Your Paradise</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Explore International Land Alliance's premium Mexico properties and discover 
              how AmplifiX can help showcase your real estate investment story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://www.internationallandalliance.com/" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-highlight-blue text-white hover:bg-highlight-blue/90">
                  Explore Properties
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

        {/* Footer */}
        <footer className="container mx-auto py-8 px-4 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <div className="text-center text-muted-foreground">
              <p className="mb-2">
                <strong>International Land Alliance Showcase</strong> - Powered by AmplifiX AI Communications Platform
              </p>
              <p className="text-sm">
                This showcase demonstrates AmplifiX's ability to create compelling corporate narratives 
                for real estate investment and development companies. 
                <br />
                <em>Information sourced from ILA.company for demonstration purposes.</em>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default InternationalLandAllianceShowcase;