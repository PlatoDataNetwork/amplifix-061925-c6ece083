import { useEffect } from 'react';
import { getCurrentLanguage, getGTranslateCode } from '@/utils/language';

/**
 * Hook to re-trigger GTranslate when content loads dynamically
 * Use this on pages that load JSON data after initial render
 */
export function useGTranslateRefresh(contentLoaded: boolean, dependencies: any[] = []) {
  useEffect(() => {
    if (!contentLoaded) return;

    try {
      const lang = getCurrentLanguage();
      if (!lang || lang === 'en') return;

      const targetCode = getGTranslateCode(lang);
      const w = window as any;
      
      if (typeof w.doGTranslate === 'function') {
        console.log(`[GTranslate] Refreshing translation for ${targetCode}`);
        
        // Multiple aggressive passes to ensure all dynamic content is caught
        const delays = [100, 300, 600, 1000, 1500, 2500];
        delays.forEach((delay) => {
          setTimeout(() => {
            try {
              if (typeof w.doGTranslate === 'function') {
                w.doGTranslate(`en|${targetCode}`);
              }
            } catch (e) {
              console.error('[GTranslate] Refresh failed:', e);
            }
          }, delay);
        });
      } else {
        console.warn('[GTranslate] doGTranslate function not available');
      }
    } catch (e) {
      console.error('[GTranslate] Error in refresh hook:', e);
    }
  }, [contentLoaded, ...dependencies]);
}
