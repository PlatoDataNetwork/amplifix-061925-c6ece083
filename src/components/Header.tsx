
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useState } from "react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="container mx-auto flex items-center justify-between py-6 px-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center">
          <img 
            src="/lovable-uploads/27fcb1ac-666f-4a63-a383-b63576970769.png" 
            alt="AmplifiX Logo" 
            className="w-10 h-10"
          />
        </div>
        <h1 className="text-2xl font-bold">
          AmplifiX
        </h1>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-6">
        <a href="#about" className="hover:text-highlight-blue transition-colors">About</a>
        <a href="#features" className="hover:text-highlight-blue transition-colors">Features</a>
        <a href="#solutions" className="hover:text-highlight-blue transition-colors">Solutions</a>
        <a href="#pricing" className="hover:text-highlight-blue transition-colors">Pricing</a>
        <a href="#faq" className="hover:text-highlight-blue transition-colors">FAQ</a>
        <a href="#contact" className="hover:text-highlight-blue transition-colors">Contact</a>
        <ThemeToggle />
        <Link to="/showcase/silo-pharma">
          <Button 
            className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors rounded-lg"
          >
            View Showcase
          </Button>
        </Link>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden flex items-center gap-4">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="hover:text-highlight-blue transition-colors"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-background border-b border-border lg:hidden z-50">
          <div className="container mx-auto py-6 px-4 space-y-4">
            <a 
              href="#about" 
              className="block hover:text-highlight-blue transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
            <a 
              href="#features" 
              className="block hover:text-highlight-blue transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#solutions" 
              className="block hover:text-highlight-blue transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Solutions
            </a>
            <a 
              href="#pricing" 
              className="block hover:text-highlight-blue transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a 
              href="#faq" 
              className="block hover:text-highlight-blue transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </a>
            <a 
              href="#contact" 
              className="block hover:text-highlight-blue transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
            <Link to="/showcase/silo-pharma" onClick={() => setIsMobileMenuOpen(false)}>
              <Button 
                className="w-full bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors rounded-lg"
              >
                View Showcase
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
