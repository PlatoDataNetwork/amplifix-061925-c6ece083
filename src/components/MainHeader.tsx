
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import MobileMenu from "@/components/MobileMenu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useState, useEffect } from "react";
import { useJsonData } from "@/hooks/useJsonData";
import { CommonData } from "@/types/common";
import { Skeleton } from "@/components/ui/skeleton";

const MainHeader = () => {
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();
  const { data: commonData, isLoading, error } = useJsonData<CommonData>('common.json');

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


  useEffect(() => {
    console.log('Setting up GTranslate...');
    
    // Add GTranslate settings
    (window as any).gtranslateSettings = {
      default_language: "en",
      wrapper_selector: ".gtranslate_wrapper",
      url_structure: "none",
      native_language_names: true,
      flag_style: "3d",
      flag_size: 16,
      horizontal_position: "right",
      vertical_position: "top"
    };

    // Initialize Google Translate Element directly
    const initGoogleTranslate = () => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      
      (window as any).googleTranslateElementInit = function() {
        new (window as any).google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,es,fr,de,it,pt,zh,ja,ko,ar,ru,hi,nl,sv,tr,pl,fi,no,da,th,he,fa',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          multilanguagePage: true
        }, 'google_translate_element');
        console.log('Google Translate Element initialized');
      };
      
      document.head.appendChild(script);
    };

    // Try Google Translate first
    initGoogleTranslate();
    
    // Fallback to GTranslate if needed
    setTimeout(() => {
      if (!document.querySelector('.goog-te-combo')) {
        console.log('Google Translate not loaded, trying GTranslate...');
        const gtScript = document.createElement('script');
        gtScript.src = 'https://cdn.gtranslate.net/widgets/latest/float.js';
        gtScript.defer = true;
        gtScript.onload = () => {
          console.log('GTranslate script loaded');
        };
        document.body.appendChild(gtScript);
      }
    }, 2000);

    return () => {
      // Cleanup
      const scripts = document.querySelectorAll('script[src*="translate"]');
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };

  }, []);

  return (
    <nav className={`${
      isSticky ? 'fixed' : 'relative'
    } top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-all duration-300`}>
      <div className="container mx-auto flex items-center justify-between py-3 md:py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
            <img 
              src="/lovable-uploads/27fcb1ac-666f-4a63-a383-b63576970769.png" 
              alt={`${commonData?.branding.name || 'AmplifiX'} Logo`}
              className="w-8 h-8 md:w-10 md:h-10"
            />
          </div>
          <Link to="/" className="text-xl md:text-2xl font-bold text-foreground">
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              commonData?.branding.name || 'AmplifiX'
            )}
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {isLoading ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-16" />
              ))}
            </>
          ) : commonData ? (
            <>
              <Link to="/about" className="text-foreground hover:text-highlight-blue transition-colors">
                {commonData.navigation.main_menu.find(item => item.label === 'About')?.label || 'About'}
              </Link>
              <Link to="/solutions" className="text-foreground hover:text-highlight-blue transition-colors">
                {commonData.navigation.main_menu.find(item => item.label === 'Solutions')?.label || 'Solutions'}
              </Link>
              <Link to="/showcase" className="text-foreground hover:text-highlight-blue transition-colors">
                {commonData.navigation.main_menu.find(item => item.label === 'Showcase')?.label || 'Showcase'}
              </Link>
               <Link to="/intel" className="text-foreground hover:text-highlight-blue transition-colors">
                 Intel
               </Link>
              <Link to="/faq" className="text-foreground hover:text-highlight-blue transition-colors">
                {commonData.navigation.main_menu.find(item => item.label === 'FAQ')?.label || 'FAQ'}
              </Link>
              <Link to="/contact" className="text-foreground hover:text-highlight-blue transition-colors">
                {commonData.navigation.main_menu.find(item => item.label === 'Contact')?.label || 'Contact'}
              </Link>
            </>
          ) : (
            <>
              <Link to="/about" className="text-foreground hover:text-highlight-blue transition-colors">About</Link>
              <Link to="/solutions" className="text-foreground hover:text-highlight-blue transition-colors">Solutions</Link>
              <Link to="/showcase" className="text-foreground hover:text-highlight-blue transition-colors">Showcase</Link>
              <Link to="/intel" className="text-foreground hover:text-highlight-blue transition-colors">Intel</Link>
              <Link to="/faq" className="text-foreground hover:text-highlight-blue transition-colors">FAQ</Link>
              <Link to="/contact" className="text-foreground hover:text-highlight-blue transition-colors">Contact</Link>
            </>
          )}
          <ThemeToggle />
          <LanguageSwitcher />
          <div id="google_translate_element" className="gtranslate_wrapper" style={{ 
            position: 'fixed', 
            top: '-1000px', 
            left: '-1000px', 
            visibility: 'hidden',
            width: '1px',
            height: '1px',
            opacity: 0
          }}></div>
        </div>

        {/* Mobile Navigation */}
        <MobileMenu />
      </div>
    </nav>
  );
};

export default MainHeader;
