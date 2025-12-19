import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getLanguageFromPath } from "@/utils/language";
import { Globe } from "lucide-react";

/**
 * A subtle full-page overlay that briefly appears when switching languages,
 * masking any GTranslate flicker during the translation apply window.
 */
export default function TranslationOverlay() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const prevLangRef = useRef<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const lang = getLanguageFromPath() || "en";
    const prevLang = prevLangRef.current;

    // Only show overlay when language actually changes (not on initial load to same lang)
    const isLangSwitch = prevLang !== null && prevLang !== lang && lang !== "en";

    if (isLangSwitch) {
      setVisible(true);

      // Auto-hide after 1.5s max
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setVisible(false);
      }, 1500);
    }

    prevLangRef.current = lang;

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in"
      style={{ animationDuration: "150ms" }}
    >
      <div className="flex flex-col items-center gap-3 text-muted-foreground animate-scale-in">
        <Globe className="h-8 w-8 animate-pulse text-primary" />
        <span className="text-sm font-medium">Translating…</span>
      </div>
    </div>
  );
}
