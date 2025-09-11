import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, Target, DollarSign, Users, BarChart3, Lightbulb } from "lucide-react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";

const Fundraising = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />
      
      {/* Hero Section */}
      <div className="pt-24 container mx-auto py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            AI-Powered <span className="text-highlight-blue">Fundraising</span> Solutions
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Accelerate your fundraising process with intelligent investor targeting, 
            automated outreach, and AI-optimized pitch materials that convert.
          </p>
          <a 
            href="https://calendly.com/amplifix/amplifix-discovery"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-highlight-blue text-white hover:bg-highlight-blue/90">
              Optimize Your Fundraise
            </Button>
          </a>
        </div>
      </div>

      {/* Key Features */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Complete Fundraising Platform</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-xl border border-border">
            <Target className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Intelligent Investor Matching</h3>
            <p className="text-muted-foreground">
              AI-powered database of 10,000+ investors with smart matching based on stage, sector, and thesis.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <DollarSign className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Pitch Deck Optimization</h3>
            <p className="text-muted-foreground">
              AI analysis of successful pitch decks with recommendations for content, flow, and visual design.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <Users className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Automated Outreach</h3>
            <p className="text-muted-foreground">
              Personalized email campaigns with AI-generated messaging tailored to each investor's interests.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <BarChart3 className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Deal Room Management</h3>
            <p className="text-muted-foreground">
              Secure data rooms with automated due diligence tracking and investor communication logs.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <Lightbulb className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Market Intelligence</h3>
            <p className="text-muted-foreground">
              Real-time funding trends, valuation benchmarks, and competitive landscape analysis.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <CheckCircle className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Term Sheet Analysis</h3>
            <p className="text-muted-foreground">
              AI-powered term sheet comparison and negotiation guidance based on market standards.
            </p>
          </div>
        </div>
      </section>

      {/* Fundraising Process */}
      <section className="container mx-auto py-16 px-4 bg-accent/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Streamlined Fundraising Process</h2>
          
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-highlight-blue text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Strategy & Preparation</h3>
                <p className="text-muted-foreground">
                  Define fundraising goals, optimize pitch materials, and develop investor targeting strategy with AI insights.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-highlight-blue text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Investor Outreach</h3>
                <p className="text-muted-foreground">
                  Launch automated outreach campaigns with personalized messaging and intelligent follow-up sequences.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-highlight-blue text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Meeting Management</h3>
                <p className="text-muted-foreground">
                  Schedule and track investor meetings with automated follow-up and next step recommendations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-highlight-blue text-white flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Due Diligence</h3>
                <p className="text-muted-foreground">
                  Manage secure data rooms and track investor engagement with comprehensive analytics and reporting.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-highlight-blue text-white flex items-center justify-center font-bold text-lg">
                5
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Term Negotiation</h3>
                <p className="text-muted-foreground">
                  Compare term sheets, negotiate with AI-powered market intelligence, and close your round successfully.
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

export default Fundraising;
