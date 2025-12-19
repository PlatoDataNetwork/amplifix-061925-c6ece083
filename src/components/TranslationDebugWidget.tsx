import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { getLanguageFromPath } from "@/utils/language";
import { Bug, X, ChevronDown, ChevronUp } from "lucide-react";

declare global {
  interface Window {
    doGTranslate?: (value: string) => void;
  }
}

export default function TranslationDebugWidget() {
  const isDev = import.meta.env.DEV;
  const { isAdmin, loading } = useAdminCheck();
  const location = useLocation();
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [gtLoaded, setGtLoaded] = useState(false);
  const [docDir, setDocDir] = useState("ltr");
  const [htmlLang, setHtmlLang] = useState("en");
  const [googTransCookie, setGoogTransCookie] = useState<string>("");

  const urlLang = getLanguageFromPath() || "en";

  useEffect(() => {
    const check = () => {
      setGtLoaded(typeof window.doGTranslate === "function");
      setDocDir(document.documentElement.getAttribute("dir") || "ltr");
      setHtmlLang(document.documentElement.getAttribute("lang") || "en");
      setGoogTransCookie(
        document.cookie
          .split("; ")
          .find((c) => c.startsWith("googtrans="))
          ?.split("=")[1] || ""
      );
    };
    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  // Don't render in production builds, and don't render for non-admins (or while loading)
  if (!isDev || loading || !isAdmin) return null;

  const retrigger = () => {
    if (typeof window.doGTranslate === "function" && urlLang !== "en") {
      const targetCode = urlLang === "zh" ? "zh-CN" : urlLang === "he" ? "iw" : urlLang;
      window.doGTranslate(`en|${targetCode}`);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999] text-xs font-mono">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-black rounded shadow-lg hover:bg-yellow-400 transition-colors"
          title="Translation Debug"
        >
          <Bug className="h-3 w-3" />
          <span>i18n</span>
        </button>
      ) : (
        <div className="bg-gray-900 text-gray-100 rounded-lg shadow-xl border border-gray-700 w-64">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700 bg-gray-800 rounded-t-lg">
            <span className="font-semibold flex items-center gap-1">
              <Bug className="h-3 w-3 text-yellow-400" />
              Translation Debug
            </span>
            <button onClick={() => setIsOpen(false)} className="hover:text-red-400">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">URL lang:</span>
              <span className="text-cyan-400 font-bold">{urlLang}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">i18n lang:</span>
              <span className="text-cyan-400 font-bold">{i18n.language || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">html lang:</span>
              <span className={`font-bold ${htmlLang === "en" ? "text-green-400" : "text-orange-400"}`}>
                {htmlLang}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">dir:</span>
              <span className={`font-bold ${docDir === "rtl" ? "text-orange-400" : "text-green-400"}`}>
                {docDir}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">doGTranslate:</span>
              <span className={`font-bold ${gtLoaded ? "text-green-400" : "text-red-400"}`}>
                {gtLoaded ? "✓ loaded" : "✗ missing"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">googtrans:</span>
              <span className={`font-bold ${googTransCookie ? "text-cyan-400" : "text-gray-400"}`}>
                {googTransCookie || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Path:</span>
              <span className="text-gray-300 truncate max-w-[120px]" title={location.pathname}>
                {location.pathname}
              </span>
            </div>
            <button
              onClick={retrigger}
              disabled={!gtLoaded || urlLang === "en"}
              className="w-full mt-2 px-2 py-1 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:text-gray-400 rounded text-center transition-colors"
            >
              Re-trigger GTranslate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
