/**
 * Utility functions for path-based language routing
 * e.g., amplifix.net/ar, amplifix.net/fr
 */

// Map app language codes to GTranslate codes
export const getGTranslateCode = (langCode: string): string => {
  const mapping: Record<string, string> = {
    'zh': 'zh-CN',
    'he': 'iw',
  };
  return mapping[langCode] || langCode;
};

// Get the language code from URL path (e.g., /ar/about -> 'ar')
export const getLanguageFromPath = (): string | null => {
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);
  
  // Check if first segment is a valid language code
  if (segments.length > 0) {
    const potentialLang = segments[0];
    // Check if it's a 2-letter language code
    if (potentialLang.length === 2) {
      return potentialLang;
    }
  }
  
  return null; // Default to English
};

// Build URL for specific language
export const buildLanguageUrl = (langCode: string, currentPath: string = window.location.pathname): string => {
  // Remove existing language prefix from path
  const segments = currentPath.split('/').filter(Boolean);
  let pathWithoutLang = currentPath;
  
  if (segments.length > 0 && segments[0].length === 2) {
    // Remove first segment if it's a language code
    pathWithoutLang = '/' + segments.slice(1).join('/');
  }
  
  // For English, use root domain without prefix
  if (langCode === 'en') {
    return pathWithoutLang || '/';
  }
  
  // For other languages, add language prefix
  return `/${langCode}${pathWithoutLang || ''}`;
};

// Get the current language code or default to 'en'
export const getCurrentLanguage = (): string => {
  return getLanguageFromPath() || 'en';
};

// Check if a path contains a language prefix
export const hasLanguagePrefix = (path: string): boolean => {
  const segments = path.split('/').filter(Boolean);
  return segments.length > 0 && segments[0].length === 2;
};
