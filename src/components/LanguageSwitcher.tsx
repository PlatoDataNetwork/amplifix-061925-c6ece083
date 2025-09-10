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
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

interface LanguageSwitcherProps {
  isMobile?: boolean;
}

const LanguageSwitcher = ({ isMobile = false }: LanguageSwitcherProps) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [isTranslating, setIsTranslating] = useState(false);

  const translatePage = async (langCode: string) => {
    setIsTranslating(true);
    console.log('Translating to:', langCode);
    
    try {
      // First, try to find the Google Translate combo element
      let selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      
      if (!selectElement) {
        // If not found, wait a bit longer and try again
        console.log('Waiting for Google Translate to initialize...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      }
      
      if (selectElement) {
        console.log('Found Google Translate combo, setting language to:', langCode);
        selectElement.value = langCode;
        selectElement.dispatchEvent(new Event('change'));
        
        const selectedLang = languages.find(lang => lang.code === langCode) || languages[0];
        setCurrentLanguage(selectedLang);
        
        // Store preference in localStorage
        localStorage.setItem('selectedLanguage', langCode);
        
        console.log('Translation triggered successfully');
      } else {
        console.error('Google Translate combo element still not found');
        // Fallback: Try to initialize Google Translate again
        if ((window as any).google && (window as any).google.translate) {
          console.log('Attempting to reinitialize Google Translate...');
          (window as any).googleTranslateElementInit();
        } else {
          throw new Error('Google Translate API not loaded');
        }
      }
      
    } catch (error) {
      console.error('Translation failed:', error);
      // Don't change the UI state on error, so user knows it didn't work
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