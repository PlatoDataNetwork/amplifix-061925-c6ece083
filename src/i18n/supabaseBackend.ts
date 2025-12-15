import { supabase } from '@/integrations/supabase/client';

export default class SupabaseBackend {
  type = 'backend' as const;
  static type = 'backend' as const;
  
  private cache: Map<string, any> = new Map();

  async read(language: string, namespace: string): Promise<any> {
    const cacheKey = `${language}-${namespace}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const tryFetchLocale = async (lng: string) => {
      const res = await fetch(`/locales/${lng}/${namespace}.json`);
      if (!res.ok) return null;

      // In dev, missing files can fall back to index.html (text/html) with 200.
      // Avoid parsing HTML as JSON.
      const contentType = (res.headers.get('content-type') || '').toLowerCase();
      if (!contentType.includes('application/json')) return null;

      try {
        return await res.json();
      } catch {
        return null;
      }
    };

    try {
      // Try to load from database
      const { data, error } = await supabase
        .from('translations')
        .select('content')
        .eq('language_code', language)
        .eq('namespace', namespace)
        .single();

      if (!error && data?.content) {
        this.cache.set(cacheKey, data.content);
        return data.content;
      }

      // Fallback to static files if not in database
      const fromStatic = await tryFetchLocale(language);
      if (fromStatic) {
        this.cache.set(cacheKey, fromStatic);
        return fromStatic;
      }

      // Final fallback to English static files
      if (language !== 'en') {
        const fromEn = await tryFetchLocale('en');
        if (fromEn) return fromEn;
      }

      // Never hard-fail i18n loads; return empty namespace so changeLanguage doesn't reject.
      return {};
    } catch (error) {
      console.error(`Error loading translation ${language}/${namespace}:`, error);
      return {};
    }
  }

  clearCache() {
    this.cache.clear();
  }
}
