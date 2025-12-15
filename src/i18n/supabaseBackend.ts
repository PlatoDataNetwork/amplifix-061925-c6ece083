import { supabase } from '@/integrations/supabase/client';

const isPlainObject = (v: unknown): v is Record<string, any> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

const deepMerge = (...sources: any[]) => {
  const out: Record<string, any> = {};
  for (const src of sources) {
    if (!isPlainObject(src)) continue;
    for (const [k, v] of Object.entries(src)) {
      if (isPlainObject(v) && isPlainObject(out[k])) {
        out[k] = deepMerge(out[k], v);
      } else {
        out[k] = v;
      }
    }
  }
  return out;
};

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
      let dbContent: any | null = null;

      // Try to load from database
      const { data, error } = await supabase
        .from('translations')
        .select('content')
        .eq('language_code', language)
        .eq('namespace', namespace)
        .single();

      if (!error && data?.content) {
        dbContent = data.content;
      }

      // Always attempt static fallbacks too, then merge so DB can override but never “drop” new keys.
      const fromStatic = await tryFetchLocale(language);
      const fromEn = language !== 'en' ? await tryFetchLocale('en') : null;

      const merged = deepMerge(fromEn || {}, fromStatic || {}, dbContent || {});

      this.cache.set(cacheKey, merged);
      return merged;
    } catch (error) {
      console.error(`Error loading translation ${language}/${namespace}:`, error);
      return {};
    }
  }

  clearCache() {
    this.cache.clear();
  }
}
