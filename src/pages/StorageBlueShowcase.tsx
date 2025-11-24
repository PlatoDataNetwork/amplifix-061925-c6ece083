import { Button } from "@/components/ui/button";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import { ExternalLink, Building2, MapPin, TrendingUp, Users, Shield, Key, Home, Briefcase, CheckCircle, BarChart3, DollarSign, Globe } from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";
import { useGTranslateRefresh } from "@/hooks/useGTranslateRefresh";

const StorageBlueShowcase = () => {
  useGTranslateRefresh(true);
  return (
    <>
      <Helmet>
        <title>StorageBlue - Real Estate Investment & Management | AmplifiX Showcase</title>
        <meta name="description" content="Discover how StorageBlue is leading real estate investment and management with strategic storage facilities and commercial properties across prime locations." />
        <meta name="keywords" content="StorageBlue, real estate investment, storage facilities, commercial real estate, property management, REIT, storage solutions, real estate portfolio" />
        <meta property="og:title" content="StorageBlue - Strategic Real Estate Investment" />
        <meta property="og:description" content="Leading real estate investment and management company specializing in storage facilities and commercial properties." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/showcase/storageblue" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="StorageBlue - Real Estate Excellence" />
        <meta name="twitter:description" content="Strategic real estate investment and management across premium locations." />
        <link rel="canonical" href="https://amplifix.ai/showcase/storageblue" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        <MainHeader />

        {/* Hero Section */}
        <div className="container mx-auto py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block mb-6">
                  <div className="bg-highlight-blue/10 text-highlight-blue rounded-full px-4 py-2 border border-highlight-blue/20 text-sm font-medium">
                    Private Real Estate Company
                  </div>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                  <span className="text-highlight-blue">StorageBlue</span><br />
                  Strategic Real Estate Excellence
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Leading real estate investment and management company specializing in storage facilities and commercial properties across strategic locations, delivering exceptional value through innovative property solutions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://storagebluecapital.com" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors">
                      Visit Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <LanguageAwareLink to="/contact">
                    <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors">
                      Contact for Investment
                      <Briefcase className="ml-2 h-4 w-4" />
                    </Button>
                  </LanguageAwareLink>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-highlight-blue/20 to-highlight-blue/10 rounded-2xl p-8 border border-border">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                      <Building2 className="h-8 w-8 text-highlight-blue mx-auto mb-2" />
                      <div className="text-2xl font-bold">Premium</div>
                      <div className="text-sm text-muted-foreground">Locations</div>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                      <MapPin className="h-8 w-8 text-highlight-blue mx-auto mb-2" />
                      <div className="text-2xl font-bold">Strategic</div>
                      <div className="text-sm text-muted-foreground">Markets</div>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                      <TrendingUp className="h-8 w-8 text-highlight-blue mx-auto mb-2" />
                      <div className="text-2xl font-bold">Growth</div>
                      <div className="text-sm text-muted-foreground">Portfolio</div>
                    </div>
                    <div className="bg-card p-6 rounded-xl border border-border text-center">
                      <Users className="h-8 w-8 text-highlight-blue mx-auto mb-2" />
                      <div className="text-2xl font-bold">Expert</div>
                      <div className="text-sm text-muted-foreground">Management</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">About StorageBlue</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Building2 className="w-12 h-12 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-bold mb-3">Storage Facilities</h3>
                  <p className="text-muted-foreground">
                    Premier self-storage and commercial storage facilities in high-demand markets, offering climate-controlled units, state-of-the-art security, and flexible rental options for businesses and individuals.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Home className="w-12 h-12 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-bold mb-3">Commercial Properties</h3>
                  <p className="text-muted-foreground">
                    Diverse portfolio of commercial real estate assets including retail spaces, office buildings, and mixed-use developments positioned in prime locations with strong tenant demand.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Shield className="w-12 h-12 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-bold mb-3">Asset Management</h3>
                  <p className="text-muted-foreground">
                    Professional property management services with proactive maintenance, tenant relations, and strategic asset optimization to maximize property value and investor returns.
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Key className="w-12 h-12 text-highlight-blue mb-4" />
                  <h3 className="text-xl font-bold mb-3">Investment Strategy</h3>
                  <p className="text-muted-foreground">
                    Data-driven acquisition approach targeting undervalued assets with value-add opportunities, focusing on markets with strong demographic trends and economic fundamentals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why StorageBlue</h2>
              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-highlight-blue/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-highlight-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Strategic Locations</h3>
                    <p className="text-muted-foreground">
                      Properties positioned in high-growth markets with strong demographics, excellent transportation access, and proven rental demand across multiple economic cycles.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-highlight-blue/10 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-highlight-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Proven Track Record</h3>
                    <p className="text-muted-foreground">
                      Consistent portfolio performance with strong occupancy rates, revenue growth, and property value appreciation delivered through disciplined investment and operational excellence.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-highlight-blue/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-highlight-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Experienced Team</h3>
                    <p className="text-muted-foreground">
                      Seasoned real estate professionals with decades of combined experience in acquisition, development, property management, and institutional investment strategies.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-highlight-blue/10 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-highlight-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Investor Value</h3>
                    <p className="text-muted-foreground">
                      Commitment to delivering superior risk-adjusted returns through careful underwriting, active asset management, and alignment of interests with all stakeholders.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Highlights */}
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Investment Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <TrendingUp className="w-12 h-12 text-highlight-blue mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Growth Markets</h3>
                  <p className="text-muted-foreground">
                    Targeted investments in expanding markets with favorable supply-demand dynamics
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <Shield className="w-12 h-12 text-highlight-blue mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Risk Management</h3>
                  <p className="text-muted-foreground">
                    Diversified portfolio and conservative leverage protecting capital in all conditions
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <Globe className="w-12 h-12 text-highlight-blue mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Sustainable Practices</h3>
                  <p className="text-muted-foreground">
                    ESG-focused operations with energy efficiency and community impact initiatives
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Partner with StorageBlue</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Explore investment opportunities and discover how StorageBlue can help you achieve your real estate investment goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://storagebluecapital.com" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors">
                    Learn More
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <LanguageAwareLink to="/contact">
                  <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors">
                    Contact Us
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

export default StorageBlueShowcase;
