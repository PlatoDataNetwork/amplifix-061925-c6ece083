import { useEffect } from "react";
import { getCurrentLanguage } from "@/utils/language";
import { applyClientSideTranslation } from "@/utils/gtranslate";

/**
 * Minimal re-trigger for pages that render data AFTER mount.
 * The global GTranslateController already handles most cases; this is a single,
 * throttled nudge to catch late content without flicker.
 */
export function useGTranslateRefresh(contentLoaded: boolean, dependencies: any[] = []) {
  useEffect(() => {
    if (!contentLoaded) return;

    const lang = getCurrentLanguage();
    if (!lang || lang === "en") return;

    void applyClientSideTranslation(lang);
  }, [contentLoaded, ...dependencies]);
}
