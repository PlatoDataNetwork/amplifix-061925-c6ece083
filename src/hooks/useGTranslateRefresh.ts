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
        
        // Multiple passes to ensure all dynamic content is caught
        setTimeout(() => {
          try {
            w.doGTranslate(`en|${targetCode}`);
            
            // Second pass after DOM updates
            setTimeout(() => {
              w.doGTranslate(`en|${targetCode}`);
            }, 500);

            // Third pass for stubborn elements
            setTimeout(() => {
              w.doGTranslate(`en|${targetCode}`);
            }, 1200);
          } catch (e) {
            console.error('[GTranslate] Refresh failed:', e);
          }
        }, 300);
      } else {
        console.warn('[GTranslate] doGTranslate function not available');
      }
    } catch (e) {
      console.error('[GTranslate] Error in refresh hook:', e);
    }
  }, [contentLoaded, ...dependencies]);
}
