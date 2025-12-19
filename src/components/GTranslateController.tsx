import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { applyClientSideTranslation } from "@/utils/gtranslate";
import { getLanguageFromPath } from "@/utils/language";

/**
 * Universal, SPA-safe GTranslate driver.
 *
 * Why this exists:
 * - Many pages render async (JSON / Supabase) after navigation.
 * - One-shot translation misses late content.
 *
 * Strategy:
 * - Apply immediately + a few delayed passes.
 * - Observe DOM node insertions for a short window and re-apply (debounced, capped)
 *   to catch late-loaded cards, showcases, and articles without constant flicker.
 */
export default function GTranslateController() {
  const location = useLocation();
  const appliedRef = useRef<string | null>(null);
  const timersRef = useRef<number[]>([]);

  const lang = useMemo(() => getLanguageFromPath() || "en", [location.pathname]);

  useEffect(() => {
    const key = `${lang}:${location.pathname}`;
    if (appliedRef.current === key) return;
    appliedRef.current = key;

    // Cleanup any previous timers
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];

    if (lang === "en") return;

    let cancelled = false;
    let applyCount = 0;
    const maxApplies = 8;

    const apply = () => {
      if (cancelled) return;
      if (applyCount >= maxApplies) return;
      applyCount += 1;
      void applyClientSideTranslation(lang);
    };

    // Immediate + staged passes (covers most async fetches)
    apply();
    [600, 1400, 2600, 4200, 6500].forEach((delay) => {
      const t = window.setTimeout(apply, delay);
      timersRef.current.push(t);
    });

    // Observe DOM insertions for a short time to catch late-loaded content
    let debounceTimer: number | null = null;
    const observer = new MutationObserver((mutations) => {
      if (cancelled) return;
      if (applyCount >= maxApplies) return;

      const hasAddedNodes = mutations.some((m) => m.addedNodes && m.addedNodes.length > 0);
      if (!hasAddedNodes) return;

      if (debounceTimer) window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        apply();
      }, 450);
    });

    // body may be null very early; guard
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
      const stop = window.setTimeout(() => observer.disconnect(), 9000);
      timersRef.current.push(stop);
    }

    return () => {
      cancelled = true;
      if (debounceTimer) window.clearTimeout(debounceTimer);
      observer.disconnect();
      timersRef.current.forEach((t) => window.clearTimeout(t));
      timersRef.current = [];
    };
  }, [lang, location.pathname]);

  return null;
}
