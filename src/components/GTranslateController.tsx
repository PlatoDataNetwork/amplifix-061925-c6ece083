import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { applyClientSideTranslation } from "@/utils/gtranslate";

/**
 * Applies GTranslate once on navigation and once after a delay for async content.
 * Removed aggressive MutationObserver to prevent flickering/jumping text.
 */
export default function GTranslateController() {
  const location = useLocation();
  const appliedRef = useRef<string | null>(null);

  const lang = useMemo(() => {
    const seg = location.pathname.split("/").filter(Boolean)[0];
    return seg && seg.length === 2 ? seg : "en";
  }, [location.pathname]);

  useEffect(() => {
    // Skip if already applied for this lang + path combo
    const key = `${lang}:${location.pathname}`;
    if (appliedRef.current === key) return;
    appliedRef.current = key;

    if (lang === "en") return;

    // Apply once immediately
    void applyClientSideTranslation(lang);

    // One delayed pass for async-loaded content (e.g., from DB queries)
    const t1 = window.setTimeout(() => void applyClientSideTranslation(lang), 1200);

    return () => {
      window.clearTimeout(t1);
    };
  }, [lang, location.pathname]);

  return null;
}
