import { useEffect, useRef } from "react";
import { getCurrentLanguage } from "@/utils/language";
import { applyClientSideTranslation } from "@/utils/gtranslate";

/**
 * Re-trigger for pages that render data AFTER mount.
 * The global GTranslateController handles most cases; this provides
 * additional retries for pages with heavy dynamic content.
 */
export function useGTranslateRefresh(contentLoaded: boolean, dependencies: any[] = []) {
  const retriesRef = useRef(0);
  const maxRetries = 5;

  useEffect(() => {
    if (!contentLoaded) return;

    const lang = getCurrentLanguage();
    if (!lang || lang === "en") return;

    // Reset retry counter when dependencies change
    retriesRef.current = 0;

    const applyWithRetries = () => {
      if (retriesRef.current >= maxRetries) return;
      retriesRef.current += 1;
      console.log(`[useGTranslateRefresh] Applying translation (attempt ${retriesRef.current}/${maxRetries})`);
      void applyClientSideTranslation(lang);
    };

    // Immediate + delayed retries for dynamic content
    applyWithRetries();
    
    const timers = [
      setTimeout(applyWithRetries, 300),
      setTimeout(applyWithRetries, 800),
      setTimeout(applyWithRetries, 1500),
      setTimeout(applyWithRetries, 3000),
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [contentLoaded, ...dependencies]);
}
