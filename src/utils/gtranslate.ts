import { getGTranslateCode } from "@/utils/language";

declare global {
  interface Window {
    doGTranslate?: (value: string) => void;
    gtranslateSettings?: Record<string, unknown>;
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
  const cookieAttrs = canUseSecureNone
    ? "; samesite=none; secure"
    : "; samesite=lax";

  // Set a host-scoped cookie (SPA-friendly)
  document.cookie = `googtrans=/en/${target}; path=/; max-age=31536000${cookieAttrs}`;
}

export async function applyClientSideTranslation(langCode: string) {
  if (!langCode || langCode === "en") return;

  setGoogTransCookie(langCode);
  const ok = await ensureGTranslateReady();
  if (!ok) return;

  const target = getGTranslateCode(langCode);

  // GTranslate's doGTranslate can be timing-sensitive in SPAs.
  // A few short, repeated calls dramatically improves reliability for late-rendered content.
  const run = () => window.doGTranslate?.(`en|${target}`);
  run();
  [350, 900, 1700].forEach((delay) => window.setTimeout(run, delay));
}
