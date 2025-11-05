/**
 * Utility functions for path-based language routing
 * Supports URLs like: amplifix.net/ar/about, amplifix.net/fr/contact
 */

export const SUPPORTED_LANGUAGES = [
  'en', 'ar', 'zh', 'da', 'nl', 'fa', 'fi', 'fr', 'de', 'he', 
  'hi', 'it', 'ja', 'ko', 'no', 'pl', 'pt', 'ru', 'es', 'sv', 'th', 'tr'
];

/**
 * Get the language code from URL path (e.g., /ar/about -> 'ar')
 * Returns null if no language prefix or if it's English
 */
export const getLanguageFromPath = (): string | null => {
  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(Boolean);
  
  // Check if first segment is a valid language code
  if (segments.length > 0 && SUPPORTED_LANGUAGES.includes(segments[0])) {
    return segments[0];
  }
  
  // Check for URL parameter (for development/testing)
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang)) {
    return urlLang;
  }
  
  return null;
};

/**
 * Strip language prefix from path
 * e.g., /ar/about -> /about, /contact -> /contact
 */
export const stripLanguageFromPath = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length > 0 && SUPPORTED_LANGUAGES.includes(segments[0])) {
    return '/' + segments.slice(1).join('/');
  }
  
  return pathname || '/';
};

/**
 * Build URL for specific language
 * e.g., ('ar', '/about') -> '/ar/about'
 * e.g., ('en', '/about') -> '/about'
 */
export const buildLanguageUrl = (langCode: string, path?: string): string => {
  // Get current path without language prefix
  const currentPath = path || stripLanguageFromPath(window.location.pathname);
  
  // For English, use root path without prefix
  if (langCode === 'en') {
    return currentPath;
  }
  
  // For other languages, add language prefix
  return `/${langCode}${currentPath}`;
};

/**
 * Get current language or default to 'en'
 */
export const getCurrentLanguage = (): string => {
  return getLanguageFromPath() || 'en';
};

/**
 * Check if current path has valid language prefix
 */
export const isValidLanguagePath = (): boolean => {
  const lang = getLanguageFromPath();
  return lang === null || SUPPORTED_LANGUAGES.includes(lang);
};
