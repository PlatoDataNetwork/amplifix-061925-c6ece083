
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, Rocket, Target, DollarSign, Globe, Lightbulb } from "lucide-react";
import SharedHeader from "@/components/SharedHeader";
import Footer from "@/components/Footer";

const PrivateCompanies = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SharedHeader />
      
      {/* Hero Section */}
      <div className="container mx-auto py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            Solutions for <span className="text-highlight-blue">Private Companies</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Scale your communications strategy with AI-powered PR and stakeholder 
            management solutions tailored for private companies and growth-stage businesses.
          </p>
          <Link to="/contact">
            <Button className="bg-highlight-blue text-white hover:bg-highlight-blue/90">
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Features */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Built for Growth-Stage Companies</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-xl border border-border">
            <DollarSign className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Fundraising Support</h3>
            <p className="text-muted-foreground">
              AI-optimized pitch decks, investor outreach automation, and due diligence preparation.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <Globe className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Brand Building</h3>
            <p className="text-muted-foreground">
              Strategic PR campaigns, thought leadership content, and market positioning strategies.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <Target className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Stakeholder Engagement</h3>
            <p className="text-muted-foreground">
              Investor updates, board communications, and employee engagement platforms.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <Rocket className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Growth Marketing</h3>
            <p className="text-muted-foreground">
              Content marketing automation, media outreach, and digital presence optimization.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <Lightbulb className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Strategic Advisory</h3>
            <p className="text-muted-foreground">
              AI-powered insights for market timing, messaging optimization, and competitive positioning.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <CheckCircle className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">IPO Readiness</h3>
            <p className="text-muted-foreground">
              Comprehensive preparation for public market transition and regulatory compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto py-16 px-4 bg-accent/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Private Companies Love AmplifiX</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-highlight-blue mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Cost-Effective Solutions</h3>
                <p className="text-muted-foreground">
                  Get enterprise-grade communications capabilities at a fraction of traditional agency costs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-highlight-blue mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Rapid Implementation</h3>
                <p className="text-muted-foreground">
                  Go live in days, not months, with our streamlined onboarding process.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-highlight-blue mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Scalable Growth</h3>
                <p className="text-muted-foreground">
                  Platform grows with your business from startup to IPO and beyond.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-highlight-blue mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Expert Guidance</h3>
                <p className="text-muted-foreground">
                  Access to experienced communications professionals and strategic advisors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivateCompanies;
