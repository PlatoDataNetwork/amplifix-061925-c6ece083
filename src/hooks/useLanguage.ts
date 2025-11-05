import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { translatePage } from '@/utils/translations';
import { getLanguageFromPath } from '@/utils/language';

export function useLanguage() {
  const location = useLocation();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const langCode = getLanguageFromPath() || 'en';
    
    if (langCode !== currentLanguage) {
      setIsTranslating(true);
      setCurrentLanguage(langCode);
      
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        translatePage(langCode);
        setIsTranslating(false);
      }, 50);
    }
  }, [location.pathname]);

  return { currentLanguage, isTranslating };
}
