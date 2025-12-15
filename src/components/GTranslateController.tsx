import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { applyClientSideTranslation } from "@/utils/gtranslate";

/**
 * Keeps GTranslate applied in a React app where re-renders can overwrite
 * translated DOM nodes (common with Google Translate + React).
 */
export default function GTranslateController() {
  const location = useLocation();
  const debounceRef = useRef<number | null>(null);

  const lang = useMemo(() => {
    const seg = location.pathname.split("/").filter(Boolean)[0];
    return seg && seg.length === 2 ? seg : "en";
  }, [location.pathname]);

  useEffect(() => {
    // Always try on navigation (covers header/footer + page content)
    void applyClientSideTranslation(lang);

    if (lang === "en") return;

    const root = document.getElementById("root");
    if (!root) return;

    const schedule = () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(() => {
        void applyClientSideTranslation(lang);
      }, 400);
    };

    const observer = new MutationObserver(() => schedule());
    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    // Also do a couple of delayed passes for async-loaded content
    const t1 = window.setTimeout(() => void applyClientSideTranslation(lang), 800);
    const t2 = window.setTimeout(() => void applyClientSideTranslation(lang), 1800);

    return () => {
      observer.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    };
  }, [lang]);

  return null;
}
