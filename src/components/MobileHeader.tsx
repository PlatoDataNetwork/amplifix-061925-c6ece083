
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const MobileHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <nav className="container mx-auto flex items-center justify-between py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
            <img 
              src="/lovable-uploads/27fcb1ac-666f-4a63-a383-b63576970769.png" 
              alt="AmplifiX Logo" 
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">
            AmplifiX
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <Link to="/documentation" className="text-muted-foreground hover:text-highlight-blue transition-colors">
            Documentation
          </Link>
          <Link to="/api" className="text-muted-foreground hover:text-highlight-blue transition-colors">
            API
          </Link>
          <Link to="/blog" className="text-muted-foreground hover:text-highlight-blue transition-colors">
            Blog
          </Link>
          <Link to="/support" className="text-muted-foreground hover:text-highlight-blue transition-colors">
            Support
          </Link>
          <Button asChild variant="ghost">
            <Link to="/dashboard">
              Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <div className="container mx-auto py-4 px-4 space-y-3">
            <Link 
              to="/documentation" 
              className="block py-3 px-2 text-muted-foreground hover:text-highlight-blue transition-colors rounded-md hover:bg-muted/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Documentation
            </Link>
            <Link 
              to="/api" 
              className="block py-3 px-2 text-muted-foreground hover:text-highlight-blue transition-colors rounded-md hover:bg-muted/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              API
            </Link>
            <Link 
              to="/blog" 
              className="block py-3 px-2 text-muted-foreground hover:text-highlight-blue transition-colors rounded-md hover:bg-muted/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              to="/support" 
              className="block py-3 px-2 text-muted-foreground hover:text-highlight-blue transition-colors rounded-md hover:bg-muted/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Support
            </Link>
            <Button asChild variant="ghost" className="w-full justify-start py-3 px-2 h-auto">
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default MobileHeader;
