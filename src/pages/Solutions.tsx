
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building, Users, Rocket, TrendingUp } from "lucide-react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";

const Solutions = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />
      
      {/* Hero Section */}
      <div className="pt-24 container mx-auto py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            Solutions for <span className="text-highlight-blue">Every Stage</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            From private companies preparing for growth to public companies managing investor relations, 
            AmplifiX provides tailored solutions for your unique needs.
          </p>
        </div>
      </div>

      {/* Solutions Grid */}
      <section className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Link to="/solutions/public-companies" className="group">
            <div className="bg-card p-8 rounded-xl border border-border hover:border-highlight-blue/50 transition-all duration-300 h-full">
              <Building className="h-12 w-12 text-highlight-blue mb-4" />
              <h3 className="text-2xl font-bold mb-4 group-hover:text-highlight-blue transition-colors">
                Public Companies
              </h3>
              <p className="text-muted-foreground mb-6">
                Comprehensive investor relations and corporate communications solutions for publicly traded companies.
              </p>
              <div className="flex items-center text-highlight-blue font-medium">
                Learn More →
              </div>
            </div>
          </Link>

          <Link to="/solutions/private-companies" className="group">
            <div className="bg-card p-8 rounded-xl border border-border hover:border-highlight-blue/50 transition-all duration-300 h-full">
              <Users className="h-12 w-12 text-highlight-blue mb-4" />
              <h3 className="text-2xl font-bold mb-4 group-hover:text-highlight-blue transition-colors">
                Private Companies
              </h3>
              <p className="text-muted-foreground mb-6">
                Scale your communications strategy with AI-powered PR and stakeholder management solutions.
              </p>
              <div className="flex items-center text-highlight-blue font-medium">
                Learn More →
              </div>
            </div>
          </Link>

          <Link to="/solutions/ipo-preparation" className="group">
            <div className="bg-card p-8 rounded-xl border border-border hover:border-highlight-blue/50 transition-all duration-300 h-full">
              <TrendingUp className="h-12 w-12 text-highlight-blue mb-4" />
              <h3 className="text-2xl font-bold mb-4 group-hover:text-highlight-blue transition-colors">
                IPO Preparation
              </h3>
              <p className="text-muted-foreground mb-6">
                Complete preparation for going public with comprehensive communications and compliance support.
              </p>
              <div className="flex items-center text-highlight-blue font-medium">
                Learn More →
              </div>
            </div>
          </Link>

          <Link to="/solutions/fundraising" className="group">
            <div className="bg-card p-8 rounded-xl border border-border hover:border-highlight-blue/50 transition-all duration-300 h-full">
              <Rocket className="h-12 w-12 text-highlight-blue mb-4" />
              <h3 className="text-2xl font-bold mb-4 group-hover:text-highlight-blue transition-colors">
                Fundraising Support
              </h3>
              <p className="text-muted-foreground mb-6">
                AI-optimized pitch decks, investor outreach, and fundraising communications management.
              </p>
              <div className="flex items-center text-highlight-blue font-medium">
                Learn More →
              </div>
            </div>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Solutions;
