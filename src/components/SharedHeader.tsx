
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
        {/* AmplifiX Logo - Flower Icon */}
        <div className="w-10 h-10 flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
              {/* Flower petals */}
              <ellipse cx="20" cy="12" rx="4" ry="8" fill="#3B82F6" />
              <ellipse cx="28" cy="20" rx="8" ry="4" fill="#3B82F6" />
              <ellipse cx="20" cy="28" rx="4" ry="8" fill="#3B82F6" />
              <ellipse cx="12" cy="20" rx="8" ry="4" fill="#3B82F6" />
              <ellipse cx="26.5" cy="13.5" rx="4" ry="8" fill="#60A5FA" transform="rotate(45 26.5 13.5)" />
              <ellipse cx="26.5" cy="26.5" rx="4" ry="8" fill="#60A5FA" transform="rotate(-45 26.5 26.5)" />
              <ellipse cx="13.5" cy="26.5" rx="4" ry="8" fill="#60A5FA" transform="rotate(45 13.5 26.5)" />
              <ellipse cx="13.5" cy="13.5" rx="4" ry="8" fill="#60A5FA" transform="rotate(-45 13.5 13.5)" />
              {/* Center circle */}
              <circle cx="20" cy="20" r="3" fill="#1E40AF" />
            </g>
          </svg>
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
