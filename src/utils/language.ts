/**
 * Utility functions for path-based language routing
 * e.g., amplifix.net/ar, amplifix.net/fr, amplifix.net/zh-TW
 */

import { supportedLanguages } from "@/i18n/config";

const SUPPORTED = new Set<string>(supportedLanguages as unknown as string[]);

// Map app language codes to GTranslate codes
export const getGTranslateCode = (langCode: string): string => {
  const mapping: Record<string, string> = {
    zh: "zh-CN",
    "zh-TW": "zh-TW",
    he: "iw",
  };
  return mapping[langCode] || langCode;
};

// Get the language code from URL path (e.g., /ar/about -> 'ar')
export const getLanguageFromPath = (): string | null => {
  const segments = window.location.pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const potentialLang = segments[0];
  if (SUPPORTED.has(potentialLang)) return potentialLang;

  // Back-compat: accept any 2-letter code
  if (potentialLang.length === 2) return potentialLang;

  return null;
};

// Build URL for specific language
export const buildLanguageUrl = (
  langCode: string,
  currentPath: string = window.location.pathname
): string => {
  const segments = currentPath.split("/").filter(Boolean);
  let pathWithoutLang = currentPath;

  if (segments.length > 0) {
    const first = segments[0];
    if (SUPPORTED.has(first) || first.length === 2) {
      pathWithoutLang = "/" + segments.slice(1).join("/");
    }
  }

  if (langCode === "en") {
    return pathWithoutLang || "/";
  }

  return `/${langCode}${pathWithoutLang || ""}`;
};

// Get the current language code or default to 'en'
export const getCurrentLanguage = (): string => {
  return getLanguageFromPath() || "en";
};

// Check if a path contains a language prefix
export const hasLanguagePrefix = (path: string): boolean => {
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return false;
  const first = segments[0];
  return SUPPORTED.has(first) || first.length === 2;
};
