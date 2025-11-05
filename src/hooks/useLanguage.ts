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
  }, [location.pathname, i18n]);

  return { currentLanguage: i18n.language, isTranslating: false };
}
