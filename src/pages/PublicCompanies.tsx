import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, TrendingUp, FileText, Users, BarChart3, Shield } from "lucide-react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";

const PublicCompanies = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />
      
      {/* Hero Section */}
      <div className="pt-24 container mx-auto py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            Solutions for <span className="text-highlight-blue">Public Companies</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Comprehensive AI-powered investor relations and corporate communications 
            solutions designed specifically for publicly traded companies.
          </p>
          <a 
            href="https://calendly.com/amplifix/demo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-highlight-blue text-white hover:bg-highlight-blue/90">
              Schedule a Demo
            </Button>
          </a>
        </div>
      </div>

      {/* Key Features */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Built for Public Company Compliance</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-xl border border-border">
            <FileText className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">SEC Filing Support</h3>
            <p className="text-muted-foreground">
              Automated assistance for 10-K, 10-Q, 8-K filings with AI-powered compliance checking and formatting.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <TrendingUp className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Earnings Communications</h3>
            <p className="text-muted-foreground">
              Streamlined earnings call preparation, press release generation, and investor materials creation.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <Users className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Analyst Relations</h3>
            <p className="text-muted-foreground">
              AI-powered sentiment tracking, analyst coverage management, and relationship optimization.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <BarChart3 className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Market Intelligence</h3>
            <p className="text-muted-foreground">
              Real-time market sentiment analysis, competitor tracking, and investor behavior insights.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <Shield className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Regulatory Compliance</h3>
            <p className="text-muted-foreground">
              Automated compliance monitoring, disclosure management, and regulatory requirement tracking.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <CheckCircle className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Crisis Management</h3>
            <p className="text-muted-foreground">
              Rapid response protocols, stakeholder communication, and reputation management during crises.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto py-16 px-4 bg-accent/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Public Companies Choose AmplifiX</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-highlight-blue mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Regulatory Expertise</h3>
                <p className="text-muted-foreground">
                  Built-in knowledge of SEC requirements, disclosure rules, and public company best practices.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-highlight-blue mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Institutional-Grade Security</h3>
                <p className="text-muted-foreground">
                  Enterprise security standards with SOC 2 compliance and data encryption at rest and in transit.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-highlight-blue mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Scalable Infrastructure</h3>
                <p className="text-muted-foreground">
                  Cloud-native platform that scales with your company's growth and communication needs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-highlight-blue mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
                <p className="text-muted-foreground">
                  Dedicated support team with public company IR expertise available around the clock.
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

export default PublicCompanies;
