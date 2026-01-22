import { useEffect } from "react";
import { getCurrentLanguage } from "@/utils/language";

/**
 * Simplified hook - GTranslate is now handled by:
 * 1. Cookie set in index.html before React loads
 * 2. GTranslateController for SPA navigation
 * 
 * This hook is kept for backwards compatibility but no longer does retries.
 */
export function useGTranslateRefresh(_contentLoaded: boolean, _dependencies: any[] = []) {
  useEffect(() => {
    // No-op: Translation is handled globally by GTranslateController
    // Keeping this hook for backwards compatibility with existing components
    const lang = getCurrentLanguage();
    if (lang && lang !== "en") {
      // Single delayed call for dynamic content that loads after mount
      const timer = setTimeout(() => {
        if (typeof window.doGTranslate === "function") {
          const targetCode = lang === "zh" ? "zh-CN" : lang === "he" ? "iw" : lang;
          window.doGTranslate(`en|${targetCode}`);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [_contentLoaded]);
}
