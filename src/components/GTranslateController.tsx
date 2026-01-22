import { useEffect, useMemo, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
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
 * - Apply immediately + multiple delayed passes for dynamic content.
 * - Observe DOM node insertions and re-apply (debounced, capped)
 *   to catch late-loaded cards, showcases, and articles.
 */
export default function GTranslateController() {
  const location = useLocation();
  const appliedRef = useRef<string | null>(null);
  const timersRef = useRef<number[]>([]);
  const isApplyingRef = useRef(false);
  const observerRef = useRef<MutationObserver | null>(null);

  // Only use URL path for language detection - ignore i18n.language to prevent loops
  const lang = useMemo(
    () => getLanguageFromPath() || "en",
    [location.pathname]
  );

  // Force re-translation of dynamic content
  const forceTranslate = useCallback(() => {
    if (lang === "en") return;
    
    // Call doGTranslate directly if available
    if (typeof window.doGTranslate === "function") {
      const targetCode = lang === "zh" ? "zh-CN" : lang === "he" ? "iw" : lang;
      console.log("[GTranslate] Force applying translation for:", targetCode);
      window.doGTranslate(`en|${targetCode}`);
    }
  }, [lang]);

  useEffect(() => {
    // Prevent re-entry during translation application
    if (isApplyingRef.current) return;

    const key = `${lang}:${location.pathname}`;
    if (appliedRef.current === key) return;
    
    isApplyingRef.current = true;
    appliedRef.current = key;

    const clearAllTimers = () => {
      timersRef.current.forEach((t) => {
        window.clearTimeout(t);
        window.clearInterval(t);
      });
      timersRef.current = [];
    };

    // Cleanup any previous timers and observer
    clearAllTimers();
    observerRef.current?.disconnect();

    // Scrub any injected widget UI that can briefly appear during SPA navigation.
    removeGTranslateUI();
    const scrubId = window.setInterval(removeGTranslateUI, 250);
    const scrubStopId = window.setTimeout(() => window.clearInterval(scrubId), 60000);
    timersRef.current.push(scrubId, scrubStopId);

    let cancelled = false;

    // For English, actively reset translation back to English (clears googtrans)
    if (lang === "en") {
      void applyClientSideTranslation("en");
      isApplyingRef.current = false;
      return () => {
        cancelled = true;
        clearAllTimers();
      };
    }

    let applyCount = 0;
    const maxApplies = 8; // Increased for better coverage of dynamic content

    const apply = () => {
      if (cancelled) return;
      if (applyCount >= maxApplies) return;
      applyCount += 1;
      console.log(`[GTranslate] Applying translation pass ${applyCount}/${maxApplies} for:`, lang);
      // Translate + immediately re-scrub UI (some widgets pop in right after apply)
      void applyClientSideTranslation(lang);
      removeGTranslateUI();
    };

    // Immediate pass + multiple delayed passes for dynamic content
    apply();
    
    // Schedule more aggressive retries for dynamic content
    const delays = [500, 1000, 1500, 2500, 4000, 6000];
    delays.forEach((delay) => {
      const t = window.setTimeout(apply, delay);
      timersRef.current.push(t);
    });

    const isTranslateUiNode = (n: Node) => {
      if (!(n instanceof Element)) return false;
      const el = n as Element;
      const cls = (el.getAttribute("class") || "").toLowerCase();
      const id = (el.getAttribute("id") || "").toLowerCase();
      const tag = el.tagName.toLowerCase();
      const src = tag === "iframe" ? ((el as HTMLIFrameElement).getAttribute("src") || "").toLowerCase() : "";

      return (
        cls.includes("goog-te") ||
        cls.includes("gt_float") ||
        cls.includes("gt-float") ||
        cls.includes("gtranslate") ||
        id.includes("goog-gt") ||
        id.includes("gt_float") ||
        id.includes("gtranslate") ||
        src.includes("translate.google") ||
        src.includes("google_translate") ||
        src.includes("gtranslate") ||
        cls.includes("vipgjd-zvi9od")
      );
    };

    // Check if node contains translatable content
    const hasTranslatableContent = (n: Node): boolean => {
      if (!(n instanceof Element)) return false;
      const el = n as Element;
      // Check if element or children have translate class or significant text
      if (el.classList?.contains("translate")) return true;
      if (el.querySelector?.(".translate")) return true;
      // Check for article-like content
      if (el.tagName === "ARTICLE" || el.closest?.("article")) return true;
      // Check for text content
      const text = el.textContent?.trim() || "";
      return text.length > 50; // Significant text content
    };

    // Observe DOM insertions; debounce heavily to avoid flicker
    let debounceTimer: number | null = null;
    const observer = new MutationObserver((mutations) => {
      if (cancelled) return;
      if (applyCount >= maxApplies) return;

      const addedNodes = mutations.flatMap((m) => Array.from(m.addedNodes || []));
      if (addedNodes.length === 0) return;

      // If ONLY translate UI nodes were injected, just scrub them
      const hasNonUiAdd = addedNodes.some((n) => !isTranslateUiNode(n));
      removeGTranslateUI();
      if (!hasNonUiAdd) return;

      // Check if any added nodes have translatable content
      const hasNewContent = addedNodes.some(hasTranslatableContent);
      if (!hasNewContent) return;

      if (debounceTimer) window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        console.log("[GTranslate] New content detected, re-applying translation");
        apply();
      }, 800);
    });

    observerRef.current = observer;

    // body may be null very early; guard
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
      // Keep observing longer for dynamic content
      const stop = window.setTimeout(() => observer.disconnect(), 30000);
      timersRef.current.push(stop);
    }

    return () => {
      cancelled = true;
      isApplyingRef.current = false;
      if (debounceTimer) window.clearTimeout(debounceTimer);
      observer.disconnect();
      clearAllTimers();
    };
  }, [lang, location.pathname]);

  // Reset applying flag after effect completes
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      isApplyingRef.current = false;
    }, 2000);
    return () => window.clearTimeout(timeout);
  }, [lang]);

  return null;
}
