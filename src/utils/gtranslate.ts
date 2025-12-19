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

  // Clear any previously-set variants to avoid duplicate googtrans cookies
  const expire = "Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `googtrans=; expires=${expire}; path=/`;
  document.cookie = `googtrans=; expires=${expire}; path=/; domain=${window.location.hostname}`;

  // In Lovable Preview the app runs inside an iframe; modern browsers often block
  // third-party cookies unless they're SameSite=None; Secure.
  const canUseSecureNone = window.location.protocol === "https:";
  const cookieAttrs = canUseSecureNone ? "; samesite=none; secure" : "; samesite=lax";

  // Set a host-scoped cookie (SPA-friendly)
  document.cookie = `googtrans=/en/${target}; path=/; max-age=31536000${cookieAttrs}`;
}

export async function applyClientSideTranslation(langCode: string) {
  if (!langCode || langCode === "en") return;

  const target = getGTranslateCode(langCode);
  const key = `en|${target}`;

  // Throttle: repeated doGTranslate calls cause visible flicker.
  // We keep it SPA-safe by allowing at most one apply per language per ~1.2s.
  const now = Date.now();
  if (window.__gtLastApply?.key === key && now - window.__gtLastApply.ts < 1200) return;
  window.__gtLastApply = { key, ts: now };

  setGoogTransCookie(langCode);
  const ok = await ensureGTranslateReady();
  if (!ok) return;

  window.doGTranslate?.(key);

  // Some widget UIs are injected *after* doGTranslate runs (and can persist).
  // Scrub briefly on every apply, not just on navigation.
  scrubGTranslateUIWindow();
}

function scrubGTranslateUIWindow(windowMs: number = 2500, everyMs: number = 200) {
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
    ];

    const nodes = new Set<Element>();

    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => nodes.add(el));
    });

    document
      .querySelectorAll('[class*="gt_float"],[id*="gt_float"]')
      .forEach((el) => nodes.add(el));

    document.querySelectorAll("iframe").forEach((el) => {
      const iframe = el as HTMLIFrameElement;
      const src = iframe.getAttribute("src") || "";
      if (
        src.includes("translate.google") ||
        src.includes("google_translate") ||
        src.includes("gtranslate")
      ) {
        nodes.add(iframe);
      }
    });

    nodes.forEach((el) => {
      try {
        el.remove();
      } catch {
        // no-op
      }
    });
  } catch {
    // no-op
  }
}
