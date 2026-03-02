import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import i18n from "@/i18n/config";
import { removeGTranslateUI, applyClientSideTranslation } from "@/utils/gtranslate";
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

    // Keep i18next synced with URL language for routes without LanguageSwitcher (e.g. /legal)
    if (i18n.language !== lang) {
      void i18n.changeLanguage(lang);
    }

    const prevLang = prevLangRef.current;
    const isInitialMount = prevLang === null;
    prevLangRef.current = lang;

    // On first mount with an English URL, force-reset stale translated state (e.g. persisted Arabic cookie)
    if (isInitialMount && lang === "en") {
      void applyClientSideTranslation("en");
    }

    // Trigger translation only when URL language changes
    if (prevLang !== null && prevLang !== lang) {
      void applyClientSideTranslation(lang);
    }

    return () => {
      window.clearInterval(scrubInterval);
      window.clearTimeout(scrubTimeout);
    };
  }, [lang, location.pathname]);

  return null;
}
