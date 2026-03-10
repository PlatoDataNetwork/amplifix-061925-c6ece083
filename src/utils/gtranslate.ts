import { getGTranslateCode } from "@/utils/language";

declare global {
  interface Window {
    doGTranslate?: (value: string) => void;
    gtranslateSettings?: Record<string, unknown>;
    __gtLastApply?: { key: string; ts: number };
    __gtScrub?: { intervalId?: number; timeoutId?: number };
  }
}

const DWF_SRC = "https://cdn.gtranslate.net/widgets/latest/dwf.js";
const SCRIPT_ID = "gtranslate-dwf";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function ensureGTranslateReady(timeoutMs: number = 8000): Promise<boolean> {
  const hasFn = () => typeof window.doGTranslate === "function";
  if (hasFn()) return true;

  // If something (adblock, network) prevented the first load, retry by injecting the script.
  if (!document.getElementById(SCRIPT_ID)) {
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.src = DWF_SRC;
    s.defer = true;
    document.head.appendChild(s);
  }

  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (hasFn()) return true;
    await sleep(200);
  }

  return hasFn();
}

export function setGoogTransCookie(langCode: string) {
  const target = getGTranslateCode(langCode);

  // Clear ALL cookie domain variants to prevent stale cookies from persisting
  // This must match the clearing logic in index.html
  const expire = "Thu, 01 Jan 1970 00:00:00 GMT";
  const host = window.location.hostname;
  const base = host.startsWith('www.') ? host.slice(4) : host;
  const domains = new Set(['', host, '.' + host]);
  if (base !== host) {
    domains.add(base);
    domains.add('.' + base);
  }
  domains.forEach(domain => {
    const domainAttr = domain ? `; domain=${domain}` : '';
    document.cookie = `googtrans=; expires=${expire}; path=/${domainAttr}`;
  });

  // Also clear localStorage variants
  try {
    localStorage.removeItem('googtrans');
    localStorage.removeItem('google_translate_element');
  } catch (e) {}

  // For English, only clear — do NOT set a new cookie
  if (target === 'en') return;

  // In Lovable Preview the app runs inside an iframe; modern browsers often block
  // third-party cookies unless they're SameSite=None; Secure.
  const canUseSecureNone = window.location.protocol === "https:";
  const cookieAttrs = canUseSecureNone ? "; samesite=none; secure" : "; samesite=lax";

  // Set a host-scoped cookie (SPA-friendly)
  document.cookie = `googtrans=/en/${target}; path=/; max-age=31536000${cookieAttrs}`;
}

export async function applyClientSideTranslation(langCode: string) {
  if (!langCode) return;

  const target = getGTranslateCode(langCode);
  const key = `en|${target}`;

  // Reduced throttle for better dynamic content handling
  // Allow re-translation every 500ms for dynamic content
  const now = Date.now();
  if (window.__gtLastApply?.key === key && now - window.__gtLastApply.ts < 500) return;
  window.__gtLastApply = { key, ts: now };

  // Always set the cookie, including when switching back to English.
  // This is what actually "turns off" translation for many widget variants.
  setGoogTransCookie(langCode);

  const ok = await ensureGTranslateReady();
  if (!ok) {
    console.warn("[GTranslate] doGTranslate function not available");
    scrubGTranslateUIWindow();
    return;
  }

  // Note: key can be "en|en" to reset back to English.
  console.log("[GTranslate] Calling doGTranslate with:", key);
  window.doGTranslate?.(key);

  // Some widget UIs are injected *after* doGTranslate runs (and can persist).
  // Scrub briefly on every apply, not just on navigation.
  scrubGTranslateUIWindow();
}

function scrubGTranslateUIWindow(windowMs: number = 30000, everyMs: number = 250) {
  // Clear any previous scrub window to avoid leaking intervals.
  if (window.__gtScrub?.intervalId) window.clearInterval(window.__gtScrub.intervalId);
  if (window.__gtScrub?.timeoutId) window.clearTimeout(window.__gtScrub.timeoutId);

  // Immediate scrub + short burst interval
  removeGTranslateUI();
  const intervalId = window.setInterval(removeGTranslateUI, everyMs);
  const timeoutId = window.setTimeout(() => window.clearInterval(intervalId), windowMs);
  window.__gtScrub = { intervalId, timeoutId };
}

/**
 * Some GTranslate / Google Translate UIs can render briefly during SPA navigation.
 * CSS can be overridden by inline !important styles, so we proactively remove them.
 */
export function removeGTranslateUI() {
  try {
    const selectors = [
      "#gt_float_wrapper",
      ".gt_float_switcher",
      ".gt_float_switcher_wrapper",
      ".gt_switcher",
      "#google_translate_element",
      ".goog-te-banner-frame",
      ".goog-te-balloon-frame",
      "#goog-gt-tt",
      "#goog-gt-vt",
      ".goog-te-gadget",
      ".goog-te-gadget-simple",
      ".goog-logo-link",
      ".goog-te-gadget-icon",
      ".goog-text-highlight",
      ".goog-te-spinner-pos",
      ".goog-te-ftab-float",
      ".gt-current-lang",
      ".gt_selector",
      '[onclick*="doGTranslate"]',
      // Known auto-generated classes
      ".VIpgJd-ZVi9od-l4eHX-hSRGPd",
      ".VIpgJd-ZVi9od-ORHb-OEVmcd",
      "#VIpgJd-ZVi9od-ORHb-OEVmcd",
      // Wildcard attribute selectors for future-proofing
      '[class*="VIpgJd"]',
      '[class*="goog-te-"]',
      '[id*="goog-gt"]',
      // Google Translate's skip-translate wrapper
      ".skiptranslate",
    ];

    const isInternalContainer = (el: Element) => {
      // Keep the offscreen container and anything inside it so doGTranslate keeps working.
      if ((el as HTMLElement).classList?.contains("gtranslate_wrapper")) return true;
      return !!(el as HTMLElement).closest?.(".gtranslate_wrapper");
    };

    const nodes = new Set<Element>();

    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        if (isInternalContainer(el)) return;
        nodes.add(el);
      });
    });

    // Wildcard matches for gt_float patterns
    document
      .querySelectorAll('[class*="gt_float"],[id*="gt_float"],[class*="gt-float"],[id*="gt-float"]')
      .forEach((el) => {
        if (isInternalContainer(el)) return;
        nodes.add(el);
      });

    // Match any element with gtranslate/goog-te in class or id, but never the hidden wrapper container.
    document
      .querySelectorAll('[class*="gtranslate"],[id*="gtranslate"],[class*="goog-te"],[id*="goog-te"]')
      .forEach((el) => {
        if (isInternalContainer(el)) return;
        nodes.add(el);
      });

    // Target iframes from Google Translate / GTranslate
    document.querySelectorAll("iframe").forEach((el) => {
      const iframe = el as HTMLIFrameElement;
      const src = (iframe.getAttribute("src") || "").toLowerCase();
      const id = (iframe.id || "").toLowerCase();
      const className = (iframe.className || "").toLowerCase();

      if (
        src.includes("translate.google") ||
        src.includes("google_translate") ||
        src.includes("gtranslate") ||
        id.includes("gtranslate") ||
        className.includes("goog-te") ||
        className.includes("skiptranslate")
      ) {
        if (isInternalContainer(iframe)) return;
        nodes.add(iframe);
      }
    });

    // Target fixed-position elements in top-left that look like translate widgets
    // (some variants inject a round "G" icon without obvious classes)
    document.querySelectorAll("body > div, body > a, body > span, body > button").forEach((el) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      const isFixed = style.position === "fixed";
      const top = parseFloat(style.top || "0");
      const left = parseFloat(style.left || "0");
      const isTopLeft = rect.top < 80 && rect.left < 80 && top < 120 && left < 120;
      const isSmall = rect.width > 20 && rect.width < 120 && rect.height > 20 && rect.height < 120;
      const z = Number(style.zIndex || 0);
      const isOnTop = z >= 999;

      if (!(isFixed && isTopLeft && isSmall && isOnTop)) return;

      const aria = (el.getAttribute("aria-label") || "").toLowerCase();
      const title = (el.getAttribute("title") || "").toLowerCase();
      const href = (el as HTMLAnchorElement).href?.toLowerCase?.() || "";
      const text = (el.textContent || "").trim().toLowerCase();

      const hasMedia = !!el.querySelector("img,svg");
      const imgSrc = (el.querySelector("img") as HTMLImageElement | null)?.src?.toLowerCase?.() || "";

      const looksLikeTranslate =
        aria.includes("translate") ||
        aria.includes("gtranslate") ||
        aria.includes("google") ||
        title.includes("translate") ||
        title.includes("gtranslate") ||
        title.includes("google") ||
        href.includes("translate") ||
        imgSrc.includes("translate") ||
        imgSrc.includes("gtranslate") ||
        imgSrc.includes("google") ||
        text === "g" ||
        text === "gtranslate";

      if (hasMedia && looksLikeTranslate) {
        if (isInternalContainer(el)) return;
        nodes.add(el);
      }
    });

    const hardHide = (el: Element) => {
      const node = el as HTMLElement;
      if (!node?.style?.setProperty) return;

      node.style.setProperty("display", "none", "important");
      node.style.setProperty("visibility", "hidden", "important");
      node.style.setProperty("opacity", "0", "important");
      node.style.setProperty("pointer-events", "none", "important");
      node.style.setProperty("position", "fixed", "important");
      node.style.setProperty("left", "-99999px", "important");
      node.style.setProperty("top", "-99999px", "important");
      node.style.setProperty("width", "0", "important");
      node.style.setProperty("height", "0", "important");
      node.style.setProperty("overflow", "hidden", "important");

      node.setAttribute("aria-hidden", "true");
    };

    nodes.forEach((el) => {
      try {
        // Never touch root nodes
        if (el === document.documentElement) return;
        if (el === document.body) return;
        if ((el as HTMLElement).id === "root") return;
        if (isInternalContainer(el)) return;

        // Hide instead of removing to avoid breaking doGTranslate internals.
        hardHide(el);
      } catch {
        // no-op
      }
    });
  } catch {
    // no-op
  }
}
