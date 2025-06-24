
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SignUpModal from "@/components/SignUpModal";
import { useState } from "react";

const HeroSection = () => {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const handleGetStartedClick = () => {
    setIsSignUpModalOpen(true);
  };

  const handleCloseSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

  return (
    <>
      <div className="container mx-auto py-20 px-4">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-block mb-8">
            <div className="bg-highlight-blue/10 text-highlight-blue rounded-full px-6 py-2 border border-highlight-blue/20">
              AI-Powered PR & Content Syndication
            </div>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Amplifi Your <br />
            <span className="text-highlight-blue">
              Communications
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            AmplifiX leverages cutting-edge AI to transform how public and private companies 
            manage investor relations, public relations, and corporate communications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleGetStartedClick}
              className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors px-8 py-4 text-lg rounded-lg"
            >
              Start Free Trial →
            </Button>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-border hover:bg-accent transition-colors px-8 py-4 text-lg rounded-lg">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <SignUpModal 
        isOpen={isSignUpModalOpen} 
        onClose={handleCloseSignUpModal} 
      />
    </>
  );
};

export default HeroSection;
