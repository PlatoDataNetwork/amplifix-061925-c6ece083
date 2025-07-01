
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleMenu}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={closeMenu} />
          <div className="fixed top-0 right-0 h-full w-64 bg-[#0A0A0A] border-l border-gray-800 p-6">
            <div className="flex justify-end mb-8">
              <Button variant="ghost" size="icon" onClick={closeMenu}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/about" 
                className="py-2 hover:text-highlight-blue transition-colors"
                onClick={closeMenu}
              >
                About
              </Link>
              <Link 
                to="/features" 
                className="py-2 hover:text-highlight-blue transition-colors"
                onClick={closeMenu}
              >
                Features
              </Link>
              <Link 
                to="/solutions" 
                className="py-2 hover:text-highlight-blue transition-colors"
                onClick={closeMenu}
              >
                Solutions
              </Link>
              <Link 
                to="/showcase" 
                className="py-2 hover:text-highlight-blue transition-colors"
                onClick={closeMenu}
              >
                Showcase
              </Link>
              <Link 
                to="/blog" 
                className="py-2 hover:text-highlight-blue transition-colors"
                onClick={closeMenu}
              >
                Intel
              </Link>
              <Link 
                to="/faq" 
                className="py-2 hover:text-highlight-blue transition-colors"
                onClick={closeMenu}
              >
                FAQ
              </Link>
              <Link 
                to="/contact" 
                className="py-2 hover:text-highlight-blue transition-colors"
                onClick={closeMenu}
              >
                Contact
              </Link>
              <div className="py-2">
                <ThemeToggle />
              </div>
              <Link to="/showcase/silo-pharma" onClick={closeMenu}>
                <Button className="w-full bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors rounded-lg">
                  SILO Showcase
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
