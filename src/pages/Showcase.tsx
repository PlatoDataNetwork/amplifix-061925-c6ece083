import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink, TrendingUp, Users, Award, Calendar, DollarSign, Building, Globe, Lightbulb, Target, CheckCircle, BarChart3, Brain, Stethoscope, Pill, Beaker, Microscope } from "lucide-react";
import { Helmet } from "react-helmet-async";
import MainHeader from "@/components/MainHeader";

const Showcase = () => {
  return (
    <>
      <Helmet>
        <title>Client Showcase - AmplifiX AI-Powered Corporate Communications</title>
        <meta name="description" content="Explore successful case studies and showcases of companies using AmplifiX's AI-driven corporate communications and investor relations solutions. See how we help businesses amplify their message and accelerate growth." />
        <meta name="keywords" content="AmplifiX showcase, corporate communications case studies, investor relations success stories, AI-powered communications, client testimonials, business growth solutions" />
        <meta property="og:title" content="Client Showcase - AmplifiX Success Stories" />
        <meta property="og:description" content="Discover how leading companies leverage AmplifiX's AI-powered platform to enhance their corporate communications and investor relations strategies." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://amplifix.ai/showcase" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AmplifiX Client Showcase - Success Stories" />
        <meta name="twitter:description" content="See how companies achieve exceptional results with AmplifiX's AI-driven corporate communications platform." />
        <link rel="canonical" href="https://amplifix.ai/showcase" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        {/* Navigation */}
        <MainHeader />

        {/* Hero Section */}
        <div className="pt-24 container mx-auto py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                <span className="text-highlight-blue">Client Showcase</span><br />
                Success Stories & Case Studies
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto">
                Discover how leading companies leverage AmplifiX's AI-powered platform to transform their 
                corporate communications, enhance investor relations, and accelerate business growth.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* SILO Pharma Showcase Card */}
              <div className="bg-card p-8 rounded-xl border border-border hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Pill className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">SILO Pharma Inc.</h3>
                    <p className="text-sm text-muted-foreground">NASDAQ: SILO</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  Pioneering neuropsychiatric drug development through AI-driven research and 
                  innovative therapeutic approaches for mental health conditions.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-highlight-blue/10 text-highlight-blue px-3 py-1 rounded-full text-sm">Pharmaceutical</span>
                  <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm">Biotech</span>
                  <span className="bg-purple-500/10 text-purple-500 px-3 py-1 rounded-full text-sm">CNS Therapeutics</span>
                </div>
                <Link to="/showcase/silo-pharma">
                  <Button className="w-full bg-highlight-blue hover:bg-highlight-blue/90 text-white">
                    View Case Study
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Placeholder for Future Showcases */}
              <div className="bg-card p-8 rounded-xl border border-dashed border-border opacity-60">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Building className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-muted-foreground">Coming Soon</h3>
                    <p className="text-sm text-muted-foreground">Next Success Story</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  More exciting case studies and client success stories are coming soon. 
                  Stay tuned for additional showcases.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </div>

              <div className="bg-card p-8 rounded-xl border border-dashed border-border opacity-60">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-muted-foreground">Your Company</h3>
                    <p className="text-sm text-muted-foreground">Next Success Story</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  Could your company be our next showcase? Contact us to learn how 
                  AmplifiX can transform your corporate communications.
                </p>
                <Link to="/contact">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose AmplifiX Section */}
        <section className="container mx-auto py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Why Leading Companies Choose AmplifiX</h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Our AI-powered platform delivers measurable results across all aspects of 
                corporate communications and investor relations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <TrendingUp className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Growth Focus</h3>
                <p className="text-muted-foreground text-sm">
                  Accelerate business growth through strategic communications
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <Lightbulb className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">AI Innovation</h3>
                <p className="text-muted-foreground text-sm">
                  Cutting-edge AI technology for content creation and optimization
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Expert Team</h3>
                <p className="text-muted-foreground text-sm">
                  Experienced professionals with deep industry knowledge
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border text-center">
                <Award className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Proven Results</h3>
                <p className="text-muted-foreground text-sm">
                  Track record of success across multiple industries
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="container mx-auto py-16 px-4 bg-gradient-to-r from-highlight-blue/10 to-green-500/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Amplify Your Success?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join the growing list of companies transforming their corporate communications 
              with AmplifiX's AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors">
                  Get Started Today
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors">
                  Explore Features
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
                AmplifiX - AI-driven corporate communications platform
              </p>
              <p className="text-sm">
                Transforming how companies communicate with stakeholders and investors.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Showcase;
