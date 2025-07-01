
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
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={closeMenu} />
          <div className="fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl z-[101]">
            <div className="flex justify-end p-4 border-b border-gray-200 dark:border-gray-700">
              <Button variant="ghost" size="icon" onClick={closeMenu}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col p-4 bg-white dark:bg-gray-900">
              <Link 
                to="/about" 
                className="py-3 text-foreground hover:text-highlight-blue transition-colors border-b border-gray-100 dark:border-gray-800"
                onClick={closeMenu}
              >
                About
              </Link>
              <Link 
                to="/features" 
                className="py-3 text-foreground hover:text-highlight-blue transition-colors border-b border-gray-100 dark:border-gray-800"
                onClick={closeMenu}
              >
                Features
              </Link>
              <Link 
                to="/solutions" 
                className="py-3 text-foreground hover:text-highlight-blue transition-colors border-b border-gray-100 dark:border-gray-800"
                onClick={closeMenu}
              >
                Solutions
              </Link>
              <Link 
                to="/showcase" 
                className="py-3 text-foreground hover:text-highlight-blue transition-colors border-b border-gray-100 dark:border-gray-800"
                onClick={closeMenu}
              >
                Showcase
              </Link>
              <Link 
                to="/blog" 
                className="py-3 text-foreground hover:text-highlight-blue transition-colors border-b border-gray-100 dark:border-gray-800"
                onClick={closeMenu}
              >
                Intel
              </Link>
              <Link 
                to="/faq" 
                className="py-3 text-foreground hover:text-highlight-blue transition-colors border-b border-gray-100 dark:border-gray-800"
                onClick={closeMenu}
              >
                FAQ
              </Link>
              <Link 
                to="/contact" 
                className="py-3 text-foreground hover:text-highlight-blue transition-colors border-b border-gray-100 dark:border-gray-800"
                onClick={closeMenu}
              >
                Contact
              </Link>
              <div className="py-3 border-b border-gray-100 dark:border-gray-800">
                <ThemeToggle />
              </div>
              <div className="pt-4">
                <Link to="/showcase/silo-pharma" onClick={closeMenu}>
                  <Button className="w-full bg-highlight-blue text-white hover:bg-highlight-blue/90 transition-colors rounded-lg">
                    SILO Showcase
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
