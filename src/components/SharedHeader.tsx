
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
        {/* AmplifiX Logo - Correct Flower Icon */}
        <div className="w-10 h-10 flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
              {/* 8 rounded petals in flower pattern */}
              <path d="M20 2C16 2 12 6 12 10C12 14 16 18 20 18C24 18 28 14 28 10C28 6 24 2 20 2Z" fill="#1E9BF0" rx="4"/>
              <path d="M30.142 5.858C28.284 4 25.716 4 23.858 5.858C22 7.716 22 10.284 23.858 12.142C25.716 14 28.284 14 30.142 12.142C32 10.284 32 7.716 30.142 5.858Z" fill="#1E9BF0"/>
              <path d="M38 20C38 16 34 12 30 12C26 12 22 16 22 20C22 24 26 28 30 28C34 28 38 24 38 20Z" fill="#1E9BF0"/>
              <path d="M30.142 27.858C32 26 32 23.716 30.142 21.858C28.284 20 25.716 20 23.858 21.858C22 23.716 22 26.284 23.858 28.142C25.716 30 28.284 30 30.142 28.142Z" fill="#1E9BF0"/>
              <path d="M20 38C24 38 28 34 28 30C28 26 24 22 20 22C16 22 12 26 12 30C12 34 16 38 20 38Z" fill="#1E9BF0"/>
              <path d="M9.858 27.858C11.716 30 14.284 30 16.142 28.142C18 26.284 18 23.716 16.142 21.858C14.284 20 11.716 20 9.858 21.858C8 23.716 8 26.284 9.858 28.142Z" fill="#1E9BF0"/>
              <path d="M2 20C2 24 6 28 10 28C14 28 18 24 18 20C18 16 14 12 10 12C6 12 2 16 2 20Z" fill="#1E9BF0"/>
              <path d="M9.858 5.858C8 7.716 8 10.284 9.858 12.142C11.716 14 14.284 14 16.142 12.142C18 10.284 18 7.716 16.142 5.858C14.284 4 11.716 4 9.858 5.858Z" fill="#1E9BF0"/>
              {/* Center circle */}
              <circle cx="20" cy="20" r="3" fill="#1E9BF0"/>
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
        <Link to="/solutions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Solutions
        </Link>
        <Link to="/showcase" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Showcase
        </Link>
        <a href="https://www.amplifix.net/intel" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Intel
        </a>
        <Link to="/faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          FAQ
        </Link>
        <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Contact
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default SharedHeader;
