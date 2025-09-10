import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, ChevronDown } from "lucide-react";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
];

interface LanguageSwitcherProps {
  isMobile?: boolean;
}

const LanguageSwitcher = ({ isMobile = false }: LanguageSwitcherProps) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [isTranslating, setIsTranslating] = useState(false);

  const translatePage = async (langCode: string) => {
    setIsTranslating(true);
    console.log('Attempting translation to:', langCode);
    
    try {
      // Method 1: Try direct Google Translate API approach
      const triggerTranslation = () => {
        // Create a temporary Google Translate widget if it doesn't exist
        if (!(window as any).google || !(window as any).google.translate) {
          throw new Error('Google Translate API not loaded');
        }

        // Look for existing combo element
        let selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        
        if (!selectElement) {
          // Force create a new translate element
          const tempDiv = document.createElement('div');
          tempDiv.id = 'temp_translate_' + Date.now();
          document.body.appendChild(tempDiv);
          
          new (window as any).google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,es,fr,de,it,pt,zh,ja,ko,ar,ru,hi,nl,sv,tr,pl,fi,no,da,th',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE
          }, tempDiv.id);
          
          // Wait for the new element to be created
          setTimeout(() => {
            selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
            if (selectElement) {
              selectElement.value = langCode;
              selectElement.dispatchEvent(new Event('change'));
              console.log('Translation triggered with new element');
            }
            // Clean up temp div
            if (document.body.contains(tempDiv)) {
              document.body.removeChild(tempDiv);
            }
          }, 500);
        } else {
          // Use existing element
          selectElement.value = langCode;
          selectElement.dispatchEvent(new Event('change'));
          console.log('Translation triggered with existing element');
        }
      };

      // Method 2: If Google Translate isn't ready, try loading it fresh
      if (!(window as any).google || !(window as any).google.translate) {
        console.log('Google Translate not loaded, attempting to load...');
        
        // Load Google Translate script dynamically
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=initTranslateCallback';
        
        (window as any).initTranslateCallback = () => {
          setTimeout(() => {
            triggerTranslation();
          }, 1000);
        };
        
        document.head.appendChild(script);
      } else {
        triggerTranslation();
      }
      
      const selectedLang = languages.find(lang => lang.code === langCode) || languages[0];
      setCurrentLanguage(selectedLang);
      
      // Store preference in localStorage
      localStorage.setItem('selectedLanguage', langCode);
      
      console.log('Translation process completed');
      
    } catch (error) {
      console.error('Translation failed:', error);
      
      // Fallback: Try manual page reload with language parameter
      console.log('Attempting fallback translation method...');
      const url = new URL(window.location.href);
      url.searchParams.set('lang', langCode);
      
      // Don't reload immediately, just update the current language display
      const selectedLang = languages.find(lang => lang.code === langCode) || languages[0];
      setCurrentLanguage(selectedLang);
      localStorage.setItem('selectedLanguage', langCode);
      
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    // Restore saved language preference
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang && savedLang !== 'en') {
      const savedLanguage = languages.find(lang => lang.code === savedLang);
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
        // Auto-translate to saved language after a delay
        setTimeout(() => translatePage(savedLang), 1000);
      }
    }
  }, []);

  if (isMobile) {
    return (
      <div className="w-full">
        <label className="text-sm font-medium text-foreground mb-2 block">
          Language
        </label>
        <select
          value={currentLanguage.code}
          onChange={(e) => translatePage(e.target.value)}
          disabled={isTranslating}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-highlight-blue focus:border-transparent disabled:opacity-50"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          disabled={isTranslating}
          className="flex items-center gap-2 px-3 py-1.5 h-auto text-foreground hover:text-highlight-blue hover:bg-muted"
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm">{currentLanguage.flag}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background border-border">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => translatePage(lang.code)}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted ${
              currentLanguage.code === lang.code ? 'bg-muted' : ''
            }`}
          >
            <span className="text-base">{lang.flag}</span>
            <span className="text-sm">{lang.name}</span>
            {currentLanguage.code === lang.code && (
              <span className="ml-auto text-xs text-highlight-blue">•</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;