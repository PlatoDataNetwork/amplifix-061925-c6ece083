import { useLocation } from "react-router-dom";
import { LanguageAwareLink } from "@/components/LanguageAwareLink";
import ThemeToggle from "@/components/ThemeToggle";
import MobileMenu from "@/components/MobileMenu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const MainHeader = () => {
  const { t } = useTranslation('common');
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();


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
            {t("nav.about")}
          </LanguageAwareLink>
          <LanguageAwareLink to="/about#process" className="text-foreground hover:text-highlight-blue transition-colors translate">
            {t("nav.process")}
          </LanguageAwareLink>
          <LanguageAwareLink to="/solutions/research" className="text-foreground hover:text-highlight-blue transition-colors translate">
            {t("nav.research")}
          </LanguageAwareLink>
          <LanguageAwareLink to="/solutions" className="text-foreground hover:text-highlight-blue transition-colors translate">
            {t("nav.solutions")}
          </LanguageAwareLink>
          <LanguageAwareLink to="/intel" className="text-foreground hover:text-highlight-blue transition-colors translate">
            {t("nav.intel")}
          </LanguageAwareLink>
          <LanguageAwareLink to="/showcase" className="text-foreground hover:text-highlight-blue transition-colors translate">
            {t("nav.showcase")}
          </LanguageAwareLink>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileMenu />
      </div>
    </nav>
  );
};

export default MainHeader;
