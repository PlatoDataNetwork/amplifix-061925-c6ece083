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
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'fa', name: 'Farsi', flag: '🇮🇷' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
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
      const selectedLang = languages.find(lang => lang.code === langCode) || languages[0];
      setCurrentLanguage(selectedLang);
      localStorage.setItem('selectedLanguage', langCode);
      
      // Clear any existing translation indicators first
      clearTranslationIndicators();
      
      // Wait for UI update
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (langCode === 'en') {
        // Return to English - reload page to clear any translations
        window.location.reload();
        return;
      }
      
      // Try to find and trigger existing Google Translate widget
      let attempts = 0;
      const maxAttempts = 10;
      
      const findAndTriggerTranslate = () => {
        const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (selectElement) {
          console.log('Found Google Translate combo, setting language');
          selectElement.value = langCode;
          selectElement.dispatchEvent(new Event('change'));
          return true;
        }
        return false;
      };
      
      // Try immediately
      if (!findAndTriggerTranslate()) {
        // If not found, wait and retry
        const retryInterval = setInterval(() => {
          attempts++;
          if (findAndTriggerTranslate() || attempts >= maxAttempts) {
            clearInterval(retryInterval);
            if (attempts >= maxAttempts) {
              console.log('Translation widget not available');
              // Don't do manual translation - just update the UI state
            }
          }
        }, 300);
      }
      
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setTimeout(() => setIsTranslating(false), 1000);
    }
  };

  const clearTranslationIndicators = () => {
    // Remove any existing translation indicators
    const indicators = document.querySelectorAll('span[style*="opacity: 0.5"]');
    indicators.forEach(indicator => {
      if (indicator.textContent?.match(/\[([A-Z]{2})\]/)) {
        indicator.remove();
      }
    });
    
    // Remove translated class from elements
    const translatedElements = document.querySelectorAll('.translated');
    translatedElements.forEach(element => {
      element.classList.remove('translated');
    });
  };

  useEffect(() => {
    // Clear any existing translation indicators on component mount
    const clearIndicators = () => {
      const indicators = document.querySelectorAll('span[style*="opacity: 0.5"]');
      indicators.forEach(indicator => {
        if (indicator.textContent?.match(/\[([A-Z]{2})\]/)) {
          indicator.remove();
        }
      });
      
      const translatedElements = document.querySelectorAll('.translated');
      translatedElements.forEach(element => {
        element.classList.remove('translated');
      });
    };
    
    clearIndicators();
    
    // Check saved preference but don't auto-translate
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang && savedLang !== 'en') {
      const savedLanguage = languages.find(lang => lang.code === savedLang);
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
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
          onChange={(e) => {
            console.log('Mobile select changed:', e.target.value);
            translatePage(e.target.value);
          }}
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
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background border-border">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onSelect={() => {
              console.log('Desktop dropdown item selected:', lang.code, lang.name);
              translatePage(lang.code);
            }}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted focus:bg-muted ${
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