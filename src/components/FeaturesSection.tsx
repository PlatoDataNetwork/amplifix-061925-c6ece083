
import { Button } from "@/components/ui/button";
import { BarChart3, MessageSquare, Users, Lightbulb } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section id="features" className="container mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-6">Powerful AI Features</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Transform your corporate communications with our comprehensive suite of AI-powered tools.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="mb-4 w-12 h-12 rounded-lg bg-highlight-blue/20 flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-highlight-blue" />
          </div>
          <h3 className="text-xl font-bold mb-2">Smart Analytics Dashboard</h3>
          <p className="text-muted-foreground">
            Real-time insights into market sentiment, media coverage, and investor engagement 
            with AI-powered predictive analytics.
          </p>
          <Button variant="link" className="text-highlight-blue mt-4 p-0">
            Learn more →
          </Button>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="mb-4 w-12 h-12 rounded-lg bg-highlight-blue/20 flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-highlight-blue" />
          </div>
          <h3 className="text-xl font-bold mb-2">AI Content Generation</h3>
          <p className="text-muted-foreground">
            Generate compelling press releases, investor updates, and corporate communications 
            tailored to your brand voice and audience.
          </p>
          <Button variant="link" className="text-highlight-blue mt-4 p-0">
            Learn more →
          </Button>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="mb-4 w-12 h-12 rounded-lg bg-highlight-blue/20 flex items-center justify-center">
            <Users className="h-6 w-6 text-highlight-blue" />
          </div>
          <h3 className="text-xl font-bold mb-2">Stakeholder Management</h3>
          <p className="text-muted-foreground">
            Intelligent CRM for investors, analysts, media contacts, and other key stakeholders 
            with automated engagement tracking.
          </p>
          <Button variant="link" className="text-highlight-blue mt-4 p-0">
            Learn more →
          </Button>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="mb-4 w-12 h-12 rounded-lg bg-highlight-blue/20 flex items-center justify-center">
            <Lightbulb className="h-6 w-6 text-highlight-blue" />
          </div>
          <h3 className="text-xl font-bold mb-2">Strategic Insights</h3>
          <p className="text-muted-foreground">
            AI-driven recommendations for timing, messaging, and channel optimization 
            to maximize impact and reach.
          </p>
          <Button variant="link" className="text-highlight-blue mt-4 p-0">
            Learn more →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
