import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const supportedLanguages = [
  'en', 'ar', 'bn', 'zh', 'zh-TW', 'da', 'nl', 'et', 'fi', 'fr', 'de', 'el',
  'he', 'hi', 'hu', 'id', 'it', 'ja', 'km', 'ko', 'no', 'fa', 'pl', 'pt',
  'pa', 'ro', 'ru', 'sl', 'es', 'sv', 'th', 'tr', 'uk', 'ur', 'vi'
] as const;

const rtlLanguages = ['ar', 'he', 'fa', 'ur'] as const;

// Simple i18n setup - GTranslate handles all translations
// We only need English as the source language
i18n
  .use(initReactI18next)
  .init({
    lng: 'en', // Always use English - GTranslate translates the page
    fallbackLng: 'en',
    supportedLngs: ['en'], // Only load English resources
    
    // Empty resources - we don't need translation files
    // GTranslate handles all client-side translation
    resources: {
      en: {
        common: {},
      },
    },
    
    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false, // Disable suspense to prevent loading states
    },
  });

// Set document direction based on URL language prefix
const updateDocumentDirection = () => {
  const pathLang = window.location.pathname.split('/').filter(Boolean)[0] || 'en';
  const isRtl = (rtlLanguages as readonly string[]).includes(pathLang);
  document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  
  // Keep source language as English for GTranslate
  document.documentElement.setAttribute('lang', 'en');
  document.documentElement.setAttribute('data-user-lang', pathLang);
};

// Update on load
updateDocumentDirection();

// Listen for navigation changes
window.addEventListener('popstate', updateDocumentDirection);

export default i18n;
