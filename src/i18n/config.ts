import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const supportedLanguages = ['en', 'ar', 'zh', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'ru', 'hi', 'nl', 'sv', 'tr'];
const rtlLanguages = ['ar', 'he', 'fa'];

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: supportedLanguages,
    ns: ['common', 'home'],
    defaultNS: 'common',
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    detection: {
      order: ['path', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: true,
    },
  });

// Set document direction based on language
i18n.on('languageChanged', (lng) => {
  const dir = rtlLanguages.includes(lng) ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lng);
});

export default i18n;
export { rtlLanguages };
