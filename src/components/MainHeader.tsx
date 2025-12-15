import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import ThemeToggle from "@/components/ThemeToggle";
import MobileMenu from "@/components/MobileMenu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MainHeader = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on route change and reset sticky state
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsSticky(false);
  }, [location.pathname]);

  return (
    <nav className={`${
      isSticky ? 'fixed' : 'relative'
    } top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-all duration-300`}>
      <div className="container mx-auto flex items-center justify-between py-3 md:py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
            <img 
              src="/lovable-uploads/27fcb1ac-666f-4a63-a383-b63576970769.png" 
              alt="AmplifiX Logo"
              className="w-8 h-8 md:w-10 md:h-10"
            />
          </div>
          <LanguageAwareLink to="/" className="text-xl md:text-2xl font-bold text-foreground">
            AmplifiX
          </LanguageAwareLink>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <LanguageAwareLink to="/about" className="text-foreground hover:text-highlight-blue transition-colors translate">
            About
          </LanguageAwareLink>
          <LanguageAwareLink to="/about#process" className="text-foreground hover:text-highlight-blue transition-colors translate">
            Process
          </LanguageAwareLink>
          <LanguageAwareLink to="/solutions/research" className="text-foreground hover:text-highlight-blue transition-colors translate">
            Research
          </LanguageAwareLink>
          <LanguageAwareLink to="/solutions" className="text-foreground hover:text-highlight-blue transition-colors translate">
            Solutions
          </LanguageAwareLink>
          <LanguageAwareLink to="/showcase" className="text-foreground hover:text-highlight-blue transition-colors translate">
            Showcase
          </LanguageAwareLink>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSignOut} className="translate">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" className="bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white hover:opacity-90 transition-opacity translate">
              <LanguageAwareLink to="/login">
                Login
              </LanguageAwareLink>
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <MobileMenu />
      </div>
    </nav>
  );
};

export default MainHeader;
