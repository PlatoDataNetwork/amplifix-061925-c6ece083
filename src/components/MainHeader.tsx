
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import MobileMenu from "@/components/MobileMenu";
import { useState, useEffect } from "react";

const MainHeader = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${
      isSticky ? 'fixed' : 'relative'
    } top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-gray-800/50 transition-all duration-300`}>
      <div className="container mx-auto flex items-center justify-between py-3 md:py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
            <img 
              src="/lovable-uploads/27fcb1ac-666f-4a63-a383-b63576970769.png" 
              alt="AmplifiX Logo" 
              className="w-8 h-8 md:w-10 md:h-10"
            />
          </div>
          <Link to="/" className="text-xl md:text-2xl font-bold">
            AmplifiX
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/about" className="hover:text-highlight-blue transition-colors">About</Link>
          <Link to="/features" className="hover:text-highlight-blue transition-colors">Features</Link>
          <Link to="/solutions" className="hover:text-highlight-blue transition-colors">Solutions</Link>
          <Link to="/showcase" className="hover:text-highlight-blue transition-colors">Showcase</Link>
          <Link to="/blog" className="hover:text-highlight-blue transition-colors">Intel</Link>
          <Link to="/faq" className="hover:text-highlight-blue transition-colors">FAQ</Link>
          <Link to="/contact" className="hover:text-highlight-blue transition-colors">Contact</Link>
          <ThemeToggle />
          <Link to="/showcase/silo-pharma">
            <Button 
              className="bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors rounded-lg"
            >
              SILO Showcase
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <MobileMenu />
      </div>
    </nav>
  );
};

export default MainHeader;
