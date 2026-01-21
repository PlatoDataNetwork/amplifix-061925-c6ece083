import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { getLanguageFromPath } from "@/utils/language";
import { applyClientSideTranslation } from "@/utils/gtranslate";

/**
 * Keeps i18n in sync with the URL prefix, but lets the global GTranslateController
 * handle translation application (to avoid duplicate triggers + flicker).
 */
export function useLanguage() {
  const location = useLocation();

  // Get language purely from URL path - no i18n state to prevent loops
  const currentLanguage = getLanguageFromPath() || "en";

  const retriggerTranslation = useCallback(() => {
    const lang = getLanguageFromPath() || "en";
    void applyClientSideTranslation(lang);
  }, []);

  return {
    currentLanguage,
    isTranslating: false,
    retriggerTranslation,
  };
}
