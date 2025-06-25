
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
    <nav className="flex items-center justify-between p-6 bg-background">
      <div className="flex items-center space-x-3">
        {/* AmplifiX Logo - Simple A Icon */}
        <div className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-lg">
          <span className="text-white font-bold text-xl">A</span>
        </div>
        <Link to="/" className="text-2xl font-bold text-foreground tracking-tight">
          AmplifiX
        </Link>
      </div>
      
      <div className="hidden md:flex items-center space-x-8">
        <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          About
        </Link>
        <Link to="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Features
        </Link>
        <Link to="/solutions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Solutions
        </Link>
        <Link to="/faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          FAQ
        </Link>
        <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Contact
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <Link to="/showcase/silo-pharma">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Showcase
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default SharedHeader;
