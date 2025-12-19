import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLanguageFromPath } from "@/utils/language";
import { applyClientSideTranslation } from "@/utils/gtranslate";

/**
 * Keeps i18n in sync with the URL prefix, but lets the global GTranslateController
 * handle translation application (to avoid duplicate triggers + flicker).
 */
export function useLanguage() {
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const pathLang = getLanguageFromPath();

    // If URL explicitly requests a language, sync i18n to it.
    if (pathLang && i18n.language !== pathLang) {
      void i18n.changeLanguage(pathLang).catch((e) => {
        console.warn("useLanguage: i18n.changeLanguage failed (continuing):", e);
      });
    }
  }, [location.pathname, i18n]);

  const retriggerTranslation = useCallback(() => {
    const lang = getLanguageFromPath() || i18n.language || "en";
    void applyClientSideTranslation(lang);
  }, [i18n.language]);

  return {
    currentLanguage: i18n.language,
    isTranslating: false,
    retriggerTranslation,
  };
}
