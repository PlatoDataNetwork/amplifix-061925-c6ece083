
import { Brain, TrendingUp, Target } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="container mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-6">About AmplifiX</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We're revolutionizing corporate communications through AI-driven insights, 
          automated content generation, and intelligent stakeholder engagement platforms.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-card p-6 rounded-xl border border-border text-center">
          <Brain className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">AI-Powered Intelligence</h3>
          <p className="text-muted-foreground">
            Advanced machine learning algorithms analyze market sentiment and optimize communications.
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-xl border border-border text-center">
          <TrendingUp className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Market Leadership</h3>
          <p className="text-muted-foreground">
            Trusted by Fortune 500 companies and emerging growth businesses worldwide.
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-xl border border-border text-center">
          <Target className="h-12 w-12 text-highlight-blue mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Strategic Focus</h3>
          <p className="text-muted-foreground">
            Tailored solutions for both public and private companies at every stage of growth.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
