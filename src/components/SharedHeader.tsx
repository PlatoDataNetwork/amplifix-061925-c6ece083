
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
              {/* Flower petals - 8 teardrop shapes */}
              <path d="M20 4 C16 4, 12 8, 12 12 C12 16, 16 20, 20 20 C24 20, 28 16, 28 12 C28 8, 24 4, 20 4 Z" fill="#1E9BF0" />
              <path d="M36 20 C36 16, 32 12, 28 12 C24 12, 20 16, 20 20 C20 24, 24 28, 28 28 C32 28, 36 24, 36 20 Z" fill="#1E9BF0" />
              <path d="M20 36 C24 36, 28 32, 28 28 C28 24, 24 20, 20 20 C16 20, 12 24, 12 28 C12 32, 16 36, 20 36 Z" fill="#1E9BF0" />
              <path d="M4 20 C4 24, 8 28, 12 28 C16 28, 20 24, 20 20 C20 16, 16 12, 12 12 C8 12, 4 16, 4 20 Z" fill="#1E9BF0" />
              <path d="M31.31 8.69 C28.69 6.07, 24.24 6.07, 21.62 8.69 C19 11.31, 19 15.76, 21.62 18.38 C24.24 21, 28.69 21, 31.31 18.38 C33.93 15.76, 33.93 11.31, 31.31 8.69 Z" fill="#1E9BF0" />
              <path d="M31.31 31.31 C33.93 28.69, 33.93 24.24, 31.31 21.62 C28.69 19, 24.24 19, 21.62 21.62 C19 24.24, 19 28.69, 21.62 31.31 C24.24 33.93, 28.69 33.93, 31.31 31.31 Z" fill="#1E9BF0" />
              <path d="M8.69 31.31 C11.31 33.93, 15.76 33.93, 18.38 31.31 C21 28.69, 21 24.24, 18.38 21.62 C15.76 19, 11.31 19, 8.69 21.62 C6.07 24.24, 6.07 28.69, 8.69 31.31 Z" fill="#1E9BF0" />
              <path d="M8.69 8.69 C6.07 11.31, 6.07 15.76, 8.69 18.38 C11.31 21, 15.76 21, 18.38 18.38 C21 15.76, 21 11.31, 18.38 8.69 C15.76 6.07, 11.31 6.07, 8.69 8.69 Z" fill="#1E9BF0" />
              {/* Center circle */}
              <circle cx="20" cy="20" r="3" fill="#1E9BF0" />
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
