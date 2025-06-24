
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import SignUpModal from "@/components/SignUpModal";
import { useState } from "react";

const PricingSection = () => {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const handleGetStartedClick = () => {
    setIsSignUpModalOpen(true);
  };

  const handleCloseSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

  return (
    <>
      <section id="pricing" className="container mx-auto py-16 px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Flexible Pricing Plans</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that fits your company's size and communication needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card p-8 rounded-xl border border-border">
            <h3 className="text-2xl font-bold mb-4">Startup</h3>
            <div className="text-4xl font-bold mb-6">$499<span className="text-lg text-muted-foreground">/month</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-highlight-blue mr-2" />
                <span>AI content generation</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-highlight-blue mr-2" />
                <span>Basic analytics dashboard</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-highlight-blue mr-2" />
                <span>Email support</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-highlight-blue mr-2" />
                <span>Up to 3 users</span>
              </li>
            </ul>
            <Button className="w-full" variant="outline" onClick={handleGetStartedClick}>Get Started</Button>
          </div>
          
          <div className="bg-gradient-to-b from-highlight-blue/10 to-secondary/10 p-8 rounded-xl border border-highlight-blue/30 relative">
            <div className="absolute top-4 right-4 bg-highlight-blue text-white px-3 py-1 rounded-full text-sm">Popular</div>
            <h3 className="text-2xl font-bold mb-4">Growth</h3>
            <div className="text-4xl font-bold mb-6">$1,499<span className="text-lg text-muted-foreground">/month</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-highlight-blue mr-2" />
                <span>Everything in Startup</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-highlight-blue mr-2" />
                <span>Advanced AI insights</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-highlight-blue mr-2" />
                <span>Stakeholder CRM</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-highlight-blue mr-2" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-highlight-blue mr-2" />
                <span>Up to 10 users</span>
              </li>
            </ul>
            <Button className="w-full bg-highlight-blue text-white" onClick={handleGetStartedClick}>Get Started</Button>
          </div>
          
          <div className="bg-card p-8 rounded-xl border border-border">
            <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
            <div className="text-4xl font-bold mb-6">Custom</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-highlight-blue mr-2" />
                <span>Everything in Growth</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-highlight-blue mr-2" />
                <span>Custom AI models</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-highlight-blue mr-2" />
                <span>White-label options</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-highlight-blue mr-2" />
                <span>Dedicated support</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-highlight-blue mr-2" />
                <span>Unlimited users</span>
              </li>
            </ul>
            <Button className="w-full" variant="outline">Contact Sales</Button>
          </div>
        </div>
      </section>
      
      <SignUpModal 
        isOpen={isSignUpModalOpen} 
        onClose={handleCloseSignUpModal} 
      />
    </>
  );
};

export default PricingSection;
