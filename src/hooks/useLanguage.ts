import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLanguageFromPath } from '@/utils/language';

export function useLanguage() {
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const langCode = getLanguageFromPath() || 'en';
    if (i18n.language !== langCode) {
      i18n.changeLanguage(langCode);
    }

    // Trigger GTranslate for non-English languages
    if (langCode !== 'en') {
      const getGTranslateCode = (lang: string) => {
        if (lang === 'zh') return 'zh-CN';
        if (lang === 'he') return 'iw';
        return lang;
      };

      const targetCode = getGTranslateCode(langCode);

      const applyTranslation = (attempts = 0) => {
        const w = window as any;
        if (typeof w.doGTranslate === 'function') {
          console.log(`useLanguage: applying GTranslate for ${targetCode}`);
          w.doGTranslate(`en|${targetCode}`);
        } else if (attempts < 20) {
          setTimeout(() => applyTranslation(attempts + 1), 300);
        } else {
          console.error('useLanguage: GTranslate not ready after retries');
        }
      };

      setTimeout(() => applyTranslation(), 400);
    }
  }, [location.pathname, i18n]);

  return { currentLanguage: i18n.language, isTranslating: false };
}
