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
    console.log('Translating page to:', langCode, 'using GTranslate');
    
    try {
      const selectedLang = languages.find(lang => lang.code === langCode) || languages[0];
      setCurrentLanguage(selectedLang);
      localStorage.setItem('selectedLanguage', langCode);
      
      // Use GTranslate's doGTranslate function
      const langPair = `en|${langCode}`;
      
      // Call GTranslate function if available
      if ((window as any).doGTranslate) {
        (window as any).doGTranslate(langPair);
      } else {
        console.log('GTranslate not ready, manual redirect');
        // Fallback manual redirect for GTranslate
        if (langCode === 'en') {
          // Return to original page
          const url = window.location.href;
          const newUrl = url.replace(/\/[a-z]{2}(-[A-Z]{2})?\//g, '/').replace(/\/[a-z]{2}(-[A-Z]{2})?$/g, '');
          window.location.href = newUrl;
        } else {
          // Redirect to translated version
          const url = window.location.href;
          let newUrl = url.replace(/\/[a-z]{2}(-[A-Z]{2})?\//g, '/').replace(/\/[a-z]{2}(-[A-Z]{2})?$/g, '');
          newUrl = newUrl.replace(/\/$/, '') + '/' + langCode + '/';
          window.location.href = newUrl;
        }
      }
      
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    // Check URL for current language (GTranslate style)
    const checkCurrentLanguage = () => {
      const path = window.location.pathname;
      const langMatch = path.match(/\/([a-z]{2})\/$/);
      
      if (langMatch) {
        const langCode = langMatch[1];
        const foundLang = languages.find(lang => lang.code === langCode);
        if (foundLang) {
          setCurrentLanguage(foundLang);
          localStorage.setItem('selectedLanguage', langCode);
          return;
        }
      }
      
      // If no language in URL, check saved preference
      const savedLang = localStorage.getItem('selectedLanguage');
      if (savedLang && savedLang !== 'en') {
        const savedLanguage = languages.find(lang => lang.code === savedLang);
        if (savedLanguage) {
          setCurrentLanguage(savedLanguage);
        }
      }
    };

    checkCurrentLanguage();
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