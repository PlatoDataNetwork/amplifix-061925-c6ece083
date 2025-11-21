import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import SupabaseBackend from './supabaseBackend';

const supportedLanguages = ['en', 'ar', 'bn', 'zh', 'da', 'nl', 'et', 'fi', 'fr', 'de', 'el', 'he', 'hi', 'hu', 'id', 'it', 'ja', 'km', 'ko', 'no', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sl', 'es', 'sv', 'th', 'tr', 'uk', 'ur', 'vi'];
const rtlLanguages = ['ar', 'he', 'fa'];

i18n
  .use(SupabaseBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: supportedLanguages,
    ns: ['common', 'home', 'about', 'solutions', 'faq', 'contact', 'blog', 'showcase'],
    defaultNS: 'common',
    
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
