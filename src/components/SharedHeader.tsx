
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
    <nav className="container mx-auto flex items-center justify-between py-6 px-4 border-b border-border">
      <div className="flex items-center gap-6">
        {showBackButton && (
          <Link to={backButtonHref} className="flex items-center gap-2 text-highlight-blue hover:text-highlight-blue/80 transition-colors">
            <span>{backButtonText}</span>
          </Link>
        )}
        <Link to="/" className="text-2xl font-bold text-highlight-blue">
          AmplifiX
        </Link>
        <div className="hidden md:flex items-center gap-6">
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
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button>Get Started</Button>
      </div>
    </nav>
  );
};

export default SharedHeader;
