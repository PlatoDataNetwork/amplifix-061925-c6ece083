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
  document.cookie = `googtrans=/en/${target}; path=/`;
  document.cookie = `googtrans=/en/${target}; path=/; domain=${window.location.hostname}`;
}

export async function applyClientSideTranslation(langCode: string) {
  if (!langCode || langCode === "en") return;

  setGoogTransCookie(langCode);
  const ok = await ensureGTranslateReady();
  if (!ok) return;

  const target = getGTranslateCode(langCode);
  window.doGTranslate?.(`en|${target}`);
}
