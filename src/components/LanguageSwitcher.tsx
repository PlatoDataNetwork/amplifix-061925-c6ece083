import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getLanguageFromPath, buildLanguageUrl } from "@/utils/language";

interface Language {
  code: string;      // app / URL / i18next code
  name: string;
  flag: string;
  gCode?: string;    // GTranslate target code (may differ, e.g. zh-CN, iw)
}

const languages: Language[] = [
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', gCode: 'ar' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩', gCode: 'bn' },
  { code: 'zh', name: 'Chinese (Simplified)', flag: '🇨🇳', gCode: 'zh-CN' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', flag: '🇹🇼', gCode: 'zh-TW' },
  { code: 'da', name: 'Danish', flag: '🇩🇰', gCode: 'da' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', gCode: 'nl' },
  { code: 'en', name: 'English', flag: '🇺🇸', gCode: 'en' },
  { code: 'et', name: 'Estonian', flag: '🇪🇪', gCode: 'et' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', gCode: 'fi' },
  { code: 'fr', name: 'French', flag: '🇫🇷', gCode: 'fr' },
  { code: 'de', name: 'German', flag: '🇩🇪', gCode: 'de' },
  { code: 'el', name: 'Greek', flag: '🇬🇷', gCode: 'el' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', gCode: 'iw' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', gCode: 'hi' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺', gCode: 'hu' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', gCode: 'id' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', gCode: 'it' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', gCode: 'ja' },
  { code: 'km', name: 'Khmer', flag: '🇰🇭', gCode: 'km' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', gCode: 'ko' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', gCode: 'no' },
  { code: 'fa', name: 'Persian', flag: '🇮🇷', gCode: 'fa' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', gCode: 'pl' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', gCode: 'pt' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳', gCode: 'pa' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴', gCode: 'ro' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', gCode: 'ru' },
  { code: 'sl', name: 'Slovenian', flag: '🇸🇮', gCode: 'sl' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', gCode: 'es' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', gCode: 'sv' },
  { code: 'th', name: 'Thai', flag: '🇹🇭', gCode: 'th' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', gCode: 'tr' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦', gCode: 'uk' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰', gCode: 'ur' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', gCode: 'vi' },
];

interface LanguageSwitcherProps {
  isMobile?: boolean;
}

const LanguageSwitcher = ({ isMobile = false }: LanguageSwitcherProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async (langCode: string) => {
    setIsTranslating(true);
    console.log('Switching to language:', langCode);
    
    try {
      const selectedLang = languages.find((lang) => lang.code === langCode) || languages[0];

      setCurrentLanguage(selectedLang);
      localStorage.setItem('selectedLanguage', langCode);
      
      // Change i18next language
      await i18n.changeLanguage(langCode);
      
      // Build new path-based URL
      const newPath = buildLanguageUrl(langCode, location.pathname);
      console.log('Navigating to:', newPath);

      // When switching TO English or FROM a non-English language back to English,
      // GTranslate's in-memory translation state doesn't reliably reset with
      // doGTranslate("en|en"). A full page reload is the only reliable way to
      // clear the translated DOM and cookies.
      if (langCode === 'en') {
        // Clear cookies before reload so index.html script sees clean state
        const { setGoogTransCookie } = await import('@/utils/gtranslate');
        setGoogTransCookie('en');
        window.location.href = newPath || '/';
        return;
      }

      navigate(newPath);

      // Translation is applied globally by GTranslateController on navigation.
      setIsTranslating(false);

    } catch (error) {
      console.error('Language switch failed:', error);
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    // Detect language from URL path ONLY - do not auto-apply saved preference
    const pathLang = getLanguageFromPath();
    
    if (pathLang) {
      const detectedLanguage = languages.find(lang => lang.code === pathLang);
      if (detectedLanguage) {
        console.log('Detected language from path:', pathLang);
        setCurrentLanguage(detectedLanguage);
        localStorage.setItem('selectedLanguage', pathLang);
        if (i18n.language !== pathLang) {
          i18n.changeLanguage(pathLang);
        }
      }
    } else {
      // No language prefix in URL = default to English
      // Do NOT auto-apply saved preference - user must explicitly choose language
      const englishLang = languages.find(lang => lang.code === 'en');
      if (englishLang) {
        setCurrentLanguage(englishLang);
        if (i18n.language !== 'en') {
          i18n.changeLanguage('en');
        }
      }
    }
  }, [location.pathname, i18n]);

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
            handleTranslate(e.target.value);
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
      <DropdownMenuContent align="end" className="w-48 max-h-[400px] overflow-y-auto bg-background border-border">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onSelect={() => {
              console.log('Desktop dropdown item selected:', lang.code, lang.name);
              handleTranslate(lang.code);
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