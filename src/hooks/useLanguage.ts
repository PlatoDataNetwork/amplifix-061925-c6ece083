import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLanguageFromPath, getGTranslateCode } from '@/utils/language';

export function useLanguage() {
  const location = useLocation();
  const { i18n } = useTranslation();

  const applyGTranslate = useCallback((langCode: string) => {
    if (langCode === 'en') return;
    
    const targetCode = getGTranslateCode(langCode);
    const w = window as any;

    const doTranslate = (attempts = 0) => {
      if (typeof w.doGTranslate === 'function') {
        console.log(`useLanguage: applying GTranslate for ${targetCode}`);
        w.doGTranslate(`en|${targetCode}`);
      } else if (attempts < 30) {
        setTimeout(() => doTranslate(attempts + 1), 200);
      } else {
        console.error('useLanguage: GTranslate doGTranslate not available');
      }
    };

    // Small delay to let DOM settle after navigation
    setTimeout(() => doTranslate(), 100);
  }, []);

  useEffect(() => {
    const langCode = getLanguageFromPath() || 'en';
    
    if (i18n.language !== langCode) {
      i18n.changeLanguage(langCode);
    }

    // Apply GTranslate for non-English languages
    applyGTranslate(langCode);
  }, [location.pathname, i18n, applyGTranslate]);

  return { 
    currentLanguage: i18n.language, 
    isTranslating: false,
    retriggerTranslation: () => applyGTranslate(i18n.language)
  };
}
