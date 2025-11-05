/**
 * Utility functions for subdomain-based language routing
 */

// Get the language code from subdomain (e.g., ar.amplifix.net -> 'ar')
export const getLanguageFromSubdomain = (): string | null => {
  const hostname = window.location.hostname;
  
  // For development (localhost)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null;
  }
  
  const parts = hostname.split('.');
  
  // If subdomain exists and is not 'www'
  if (parts.length > 2 && parts[0] !== 'www') {
    return parts[0];
  }
  
  return null;
};

// Get the base domain (without language subdomain)
export const getBaseDomain = (): string => {
  const hostname = window.location.hostname;
  
  // For development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return hostname;
  }
  
  const parts = hostname.split('.');
  
  // Return last two parts (e.g., amplifix.net)
  if (parts.length >= 2) {
    return parts.slice(-2).join('.');
  }
  
  return hostname;
};

// Build URL for specific language subdomain
export const buildLanguageUrl = (langCode: string, path: string = ''): string => {
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';
  const baseDomain = getBaseDomain();
  
  // For development, use query parameter instead
  if (baseDomain === 'localhost' || baseDomain === '127.0.0.1') {
    const currentPath = window.location.pathname;
    return `${protocol}//${baseDomain}${port}${path || currentPath}?lang=${langCode}`;
  }
  
  // For English, use www or root domain
  if (langCode === 'en') {
    return `${protocol}//www.${baseDomain}${port}${path || window.location.pathname}`;
  }
  
  // For other languages, use language subdomain
  return `${protocol}//${langCode}.${baseDomain}${port}${path || window.location.pathname}`;
};

// Check if current subdomain is valid language code
export const isValidLanguageSubdomain = (validLanguages: string[]): boolean => {
  const langCode = getLanguageFromSubdomain();
  return langCode ? validLanguages.includes(langCode) : true;
};
