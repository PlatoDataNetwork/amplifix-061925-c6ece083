import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { removeGTranslateUI } from "@/utils/gtranslate";
import { getLanguageFromPath } from "@/utils/language";

/**
 * Simplified GTranslate controller.
 * 
 * Translation is now handled by:
 * 1. index.html sets googtrans cookie BEFORE React loads
 * 2. GTranslate dwf.js auto-applies translation on page load
 * 
 * This controller only needs to:
 * - Hide GTranslate UI elements
 * - Trigger translation on SPA navigation (when language changes)
 */
export default function GTranslateController() {
  const location = useLocation();
  const prevLangRef = useRef<string | null>(null);

  const lang = useMemo(
    () => getLanguageFromPath() || "en",
    [location.pathname]
  );

  useEffect(() => {
    // Always hide GTranslate UI
    removeGTranslateUI();
    const scrubInterval = window.setInterval(removeGTranslateUI, 500);
    const scrubTimeout = window.setTimeout(() => window.clearInterval(scrubInterval), 10000);

    // Only trigger translation on language CHANGE (not initial load - cookie handles that)
    const prevLang = prevLangRef.current;
    prevLangRef.current = lang;

    if (prevLang !== null && prevLang !== lang && typeof window.doGTranslate === "function") {
      const targetCode = lang === "zh" ? "zh-CN" : lang === "he" ? "iw" : lang;
      
      if (lang === "en") {
        // Reset to English
        window.doGTranslate("en|en");
      } else {
        // Apply translation once
        window.doGTranslate(`en|${targetCode}`);
      }
    }

    return () => {
      window.clearInterval(scrubInterval);
      window.clearTimeout(scrubTimeout);
    };
  }, [lang, location.pathname]);

  return null;
}
