import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLanguageFromPath, getGTranslateCode } from '@/utils/language';
import { ensureGTranslateReady, setGoogTransCookie } from '@/utils/gtranslate';

const isPageTranslated = () => {
  const el = document.documentElement;
  const body = document.body;

  // Google Translate commonly toggles these classes
  const hasTranslatedClass =
    el.classList.contains('translated-ltr') ||
    el.classList.contains('translated-rtl') ||
    body.classList.contains('translated-ltr') ||
    body.classList.contains('translated-rtl');

  // Some implementations inject these iframes
  const hasTranslateIframe = !!document.querySelector(
    'iframe.goog-te-banner-frame, iframe.skiptranslate, iframe[id*="goog"], iframe[src*="translate"]'
  );

  return hasTranslatedClass || hasTranslateIframe;
};

export function useLanguage() {
  const location = useLocation();
  const { i18n } = useTranslation();

  const applyGTranslate = useCallback((langCode: string) => {
    if (langCode === 'en') return;

    // Ensure Google Translate cookie is set for the whole site
    setGoogTransCookie(langCode);

    const targetCode = getGTranslateCode(langCode);
    const w = window as any;

    const doTranslate = (attempts = 0) => {
      if (typeof w.doGTranslate === 'function') {
        console.log(`useLanguage: applying GTranslate for ${targetCode}`);
        w.doGTranslate(`en|${targetCode}`);

        // Verify translation actually applied; if not, do a one-time hard reload.
        setTimeout(() => {
          const translated = isPageTranslated();
          console.log('[GTranslate] post-apply check:', { targetCode, translated, htmlClass: document.documentElement.className });

          const reloadKey = `gt_reload_once_${targetCode}`;
          if (!translated && !sessionStorage.getItem(reloadKey)) {
            sessionStorage.setItem(reloadKey, '1');
            console.warn('[GTranslate] not applied; forcing hard reload once');
            window.location.reload();
          }
        }, 2500);
      } else if (attempts < 30) {
        setTimeout(() => doTranslate(attempts + 1), 200);
      } else {
        console.error('useLanguage: GTranslate doGTranslate not available');
      }
    };

    // Make sure the widget script is present (dev / adblock resilience)
    void ensureGTranslateReady().finally(() => {
      // Small delay to let DOM settle after navigation
      setTimeout(() => doTranslate(), 100);
    });
  }, []);

  useEffect(() => {
    const langCode = getLanguageFromPath() || 'en';

    if (i18n.language !== langCode) {
      void i18n.changeLanguage(langCode).catch((e) => {
        console.warn('useLanguage: i18n.changeLanguage failed (continuing):', e);
      });
    }

    // Apply GTranslate for non-English languages
    applyGTranslate(langCode);
  }, [location.pathname, i18n, applyGTranslate]);

  return {
    currentLanguage: i18n.language,
    isTranslating: false,
    retriggerTranslation: () => applyGTranslate(i18n.language),
  };
}

