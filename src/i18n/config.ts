import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import SupabaseBackend from './supabaseBackend';

export const supportedLanguages = [
  'en', 'ar', 'bn', 'zh', 'zh-TW', 'da', 'nl', 'et', 'fi', 'fr', 'de', 'el',
  'he', 'hi', 'hu', 'id', 'it', 'ja', 'km', 'ko', 'no', 'fa', 'pl', 'pt',
  'pa', 'ro', 'ru', 'sl', 'es', 'sv', 'th', 'tr', 'uk', 'ur', 'vi'
] as const;

const rtlLanguages = ['ar', 'he', 'fa', 'ur'] as const;

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
  const dir = (rtlLanguages as readonly string[]).includes(lng) ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);

  // Keep the source language as English so the GTranslate widget reliably applies
  // client-side translations. (We store the user's intended language separately.)
  document.documentElement.setAttribute('lang', 'en');
  document.documentElement.setAttribute('data-user-lang', lng);
});

export default i18n;
