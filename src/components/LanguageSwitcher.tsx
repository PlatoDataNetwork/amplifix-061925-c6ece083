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
    console.log('Starting translation to:', langCode);
    
    try {
      const selectedLang = languages.find(lang => lang.code === langCode) || languages[0];
      setCurrentLanguage(selectedLang);
      localStorage.setItem('selectedLanguage', langCode);
      
      // Wait a moment for UI to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Method 1: Try to find and use GTranslate's native dropdown
      const gtCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (gtCombo) {
        console.log('Using GTranslate native combo');
        gtCombo.value = langCode;
        gtCombo.dispatchEvent(new Event('change'));
        return;
      }
      
      // Method 2: Use direct Google Translate redirect (most reliable)
      console.log('Using direct Google Translate redirect');
      
      if (langCode === 'en') {
        // If returning to English and we're on a translated page
        if (window.location.href.includes('translate.google.com')) {
          const originalUrl = window.location.origin + window.location.pathname.replace(/^\/[a-z]{2}\//, '/');
          window.location.href = originalUrl;
        }
      } else {
        // Create Google Translate URL
        const currentUrl = encodeURIComponent(window.location.origin + window.location.pathname);
        const translateUrl = `https://translate.google.com/translate?sl=en&tl=${langCode}&u=${currentUrl}`;
        console.log('Redirecting to:', translateUrl);
        window.location.href = translateUrl;
      }
      
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      // Keep loading state for a bit to show user something is happening
      setTimeout(() => setIsTranslating(false), 2000);
    }
  };

  useEffect(() => {
    // Check if we're on a Google Translate page and update language accordingly
    const checkTranslatedPage = () => {
      if (window.location.href.includes('translate.google.com')) {
        // Extract target language from Google Translate URL
        const urlParams = new URLSearchParams(window.location.search);
        const targetLang = urlParams.get('tl');
        if (targetLang) {
          const foundLang = languages.find(lang => lang.code === targetLang);
          if (foundLang) {
            setCurrentLanguage(foundLang);
            localStorage.setItem('selectedLanguage', targetLang);
            return;
          }
        }
      }
      
      // Check saved preference
      const savedLang = localStorage.getItem('selectedLanguage');
      if (savedLang && savedLang !== 'en') {
        const savedLanguage = languages.find(lang => lang.code === savedLang);
        if (savedLanguage) {
          setCurrentLanguage(savedLanguage);
        }
      }
    };

    checkTranslatedPage();
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