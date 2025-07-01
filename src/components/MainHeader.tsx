
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

const MainHeader = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-gray-800/50">
      <div className="container mx-auto flex items-center justify-between py-6 px-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center">
            <img 
              src="/lovable-uploads/27fcb1ac-666f-4a63-a383-b63576970769.png" 
              alt="AmplifiX Logo" 
              className="w-10 h-10"
            />
          </div>
          <Link to="/" className="text-2xl font-bold">
            AmplifiX
          </Link>
        </div>
        <div className="flex items-center gap-6">
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
      </div>
    </nav>
  );
};

export default MainHeader;
