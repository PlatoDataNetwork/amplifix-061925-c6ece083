
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
    <nav className="flex items-center justify-between p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="flex items-center space-x-2">
        <Link to="/" className="text-2xl font-bold text-primary">
          AmplifiX
        </Link>
      </div>
      
      <div className="hidden md:flex items-center space-x-6">
        <Link to="/features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Features
        </Link>
        <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Dashboard
        </Link>
        <Link to="/documentation" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Documentation
        </Link>
        <Link to="/api" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          API
        </Link>
        <Link to="/blog" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Blog
        </Link>
        <Link to="/support" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Support
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <Button>
          Get Started
        </Button>
      </div>
    </nav>
  );
};

export default SharedHeader;
