import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { applyClientSideTranslation, removeGTranslateUI } from "@/utils/gtranslate";
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
  const { i18n } = useTranslation();
  const appliedRef = useRef<string | null>(null);
  const timersRef = useRef<number[]>([]);

  const lang = useMemo(
    () => getLanguageFromPath() || i18n.language || "en",
    [location.pathname, i18n.language]
  );

  useEffect(() => {
    const key = `${lang}:${location.pathname}`;
    if (appliedRef.current === key) return;
    appliedRef.current = key;

    const clearAllTimers = () => {
      timersRef.current.forEach((t) => {
        window.clearTimeout(t);
        window.clearInterval(t);
      });
      timersRef.current = [];
    };

    // Cleanup any previous timers
    clearAllTimers();

    // Scrub any injected widget UI that can briefly appear during SPA navigation.
    removeGTranslateUI();
    const scrubId = window.setInterval(removeGTranslateUI, 200);
    const scrubStopId = window.setTimeout(() => window.clearInterval(scrubId), 2500);
    timersRef.current.push(scrubId, scrubStopId);

    let cancelled = false;

    // For English, we still keep the short scrub window above, then stop.
    if (lang === "en") {
      return () => {
        cancelled = true;
        clearAllTimers();
      };
    }

    let applyCount = 0;
    const maxApplies = 3;

    const apply = () => {
      if (cancelled) return;
      if (applyCount >= maxApplies) return;
      applyCount += 1;
      // Translate + immediately re-scrub UI (some widgets pop in right after apply)
      void applyClientSideTranslation(lang);
      removeGTranslateUI();
    };

    // One immediate pass + one delayed pass; the observer handles late content.
    apply();
    [1800].forEach((delay) => {
      const t = window.setTimeout(apply, delay);
      timersRef.current.push(t);
    });

    // Observe DOM insertions briefly; debounce heavily to avoid flicker
    let debounceTimer: number | null = null;
    const observer = new MutationObserver((mutations) => {
      if (cancelled) return;
      if (applyCount >= maxApplies) return;

      const hasAddedNodes = mutations.some((m) => m.addedNodes && m.addedNodes.length > 0);
      if (!hasAddedNodes) return;

      // If the widget injects UI nodes, remove them ASAP.
      removeGTranslateUI();

      if (debounceTimer) window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        apply();
      }, 1400);
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
      clearAllTimers();
    };
  }, [lang, location.pathname]);

  return null;
}
