
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import MobileMenu from "@/components/MobileMenu";
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
    console.log('Setting up Google Translate...');
    
    // Add Google Translate script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);

    // Initialize Google Translate
    (window as any).googleTranslateElementInit = function() {
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,es,fr,de,it,pt,zh,ja,ko,ar',
        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        multilanguagePage: true,
        gaTrack: true,
        gaId: 'G-FQ4G09PD29'
      }, 'google_translate_element');
      
      console.log('Google Translate initialized');
    };

    // Custom function for mobile dropdown
    (window as any).translatePage = function(langCode) {
      console.log('Translating to:', langCode);
      var selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = langCode;
        selectElement.dispatchEvent(new Event('change'));
      } else {
        console.log('Google Translate not ready yet');
      }
    };

    // Add mobile language switcher
    const addMobileSwitcher = () => {
      const mobileWrapper = document.querySelector('.gtranslate_wrapper_mobile');
      if (mobileWrapper && !mobileWrapper.hasChildNodes()) {
        console.log('Adding mobile switcher');
        mobileWrapper.innerHTML = `
          <div style="margin-bottom: 8px;">
            <label style="font-size: 14px; color: var(--foreground); margin-bottom: 4px; display: block;">Language</label>
            <select onchange="translatePage(this.value)" style="
              padding: 8px 12px;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              background: var(--background);
              color: var(--foreground);
              font-size: 14px;
              width: 100%;
            ">
              <option value="">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        `;
      }
    };

    // Check for mobile wrapper periodically
    const interval = setInterval(() => {
      addMobileSwitcher();
      if (document.querySelector('.gtranslate_wrapper_mobile select')) {
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
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
          <div id="google_translate_element" className="gtranslate_wrapper"></div>
        </div>

        {/* Mobile Navigation */}
        <MobileMenu />
      </div>
    </nav>
  );
};

export default MainHeader;
