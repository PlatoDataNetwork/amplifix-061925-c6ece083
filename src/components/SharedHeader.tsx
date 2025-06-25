
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

interface SharedHeaderProps {
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
}

const SharedHeader = ({ 
  showBackButton = false, 
  backButtonText = "Back to AmplifiX",
  backButtonHref = "/"
}: SharedHeaderProps) => {
  return (
    <header className="container mx-auto px-4 py-6">
      <nav className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-bold text-highlight-blue">
            AmplifiX
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/features" className="text-foreground hover:text-highlight-blue transition-colors">
              Features
            </Link>
            <Link to="/dashboard" className="text-foreground hover:text-highlight-blue transition-colors">
              Dashboard
            </Link>
            <Link to="/documentation" className="text-foreground hover:text-highlight-blue transition-colors">
              Documentation
            </Link>
            <Link to="/api" className="text-foreground hover:text-highlight-blue transition-colors">
              API
            </Link>
            <Link to="/blog" className="text-foreground hover:text-highlight-blue transition-colors">
              Blog
            </Link>
            <Link to="/support" className="text-foreground hover:text-highlight-blue transition-colors">
              Support
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors">
            Get Started
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default SharedHeader;
