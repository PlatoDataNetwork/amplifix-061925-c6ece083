import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, FileText, Shield, Users, Clock, TrendingUp } from "lucide-react";
import MainHeader from "@/components/MainHeader";
import Footer from "@/components/Footer";

const IPOPreparation = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MainHeader />
      
      {/* Hero Section */}
      <div className="pt-24 container mx-auto py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            <span className="text-highlight-blue">IPO Preparation</span> Solutions
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Navigate your path to public markets with confidence. Our comprehensive IPO 
            preparation platform ensures you're ready for the rigorous demands of being a public company.
          </p>
          <a 
            href="https://calendly.com/amplifix/demo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-highlight-blue text-white hover:bg-highlight-blue/90">
              Start IPO Assessment
            </Button>
          </a>
        </div>
      </div>

      {/* IPO Process */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Complete IPO Readiness Platform</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-xl border border-border">
            <FileText className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">S-1 Preparation</h3>
            <p className="text-muted-foreground">
              AI-assisted registration statement preparation with compliance checking and formatting optimization.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <Shield className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Compliance Readiness</h3>
            <p className="text-muted-foreground">
              Comprehensive SOX compliance preparation, internal controls assessment, and audit readiness.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <Users className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Roadshow Support</h3>
            <p className="text-muted-foreground">
              Investor presentation optimization, Q&A preparation, and roadshow logistics management.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <Clock className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Timeline Management</h3>
            <p className="text-muted-foreground">
              Detailed project management with milestone tracking and critical path optimization.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <TrendingUp className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Market Positioning</h3>
            <p className="text-muted-foreground">
              Strategic narrative development, competitive analysis, and valuation optimization.
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border">
            <CheckCircle className="h-12 w-12 text-highlight-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Post-IPO Transition</h3>
            <p className="text-muted-foreground">
              Seamless transition to public company operations with ongoing IR and compliance support.
            </p>
          </div>
        </div>
      </section>

      {/* IPO Checklist */}
      <section className="container mx-auto py-16 px-4 bg-accent/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">IPO Readiness Checklist</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">Financial & Legal Preparation</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-5 w-5 text-highlight-blue mt-1" />
                  <span className="text-muted-foreground">Audited financial statements (3 years)</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-5 w-5 text-highlight-blue mt-1" />
                  <span className="text-muted-foreground">SOX compliance implementation</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-5 w-5 text-highlight-blue mt-1" />
                  <span className="text-muted-foreground">Corporate governance structure</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-5 w-5 text-highlight-blue mt-1" />
                  <span className="text-muted-foreground">Board composition optimization</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-bold mb-4">Communications & IR</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-5 w-5 text-highlight-blue mt-1" />
                  <span className="text-muted-foreground">Investment thesis development</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-5 w-5 text-highlight-blue mt-1" />
                  <span className="text-muted-foreground">Management presentation materials</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-5 w-5 text-highlight-blue mt-1" />
                  <span className="text-muted-foreground">IR website and materials</span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-5 w-5 text-highlight-blue mt-1" />
                  <span className="text-muted-foreground">Media and analyst strategy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IPOPreparation;
