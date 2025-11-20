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
      const response = await fetch(`/locales/${language}/${namespace}.json`);
      if (response.ok) {
        const content = await response.json();
        this.cache.set(cacheKey, content);
        return content;
      }

      throw new Error(`Failed to load ${language}/${namespace}`);
    } catch (error) {
      console.error(`Error loading translation ${language}/${namespace}:`, error);
      
      // Final fallback to English if available
      if (language !== 'en') {
        try {
          const response = await fetch(`/locales/en/${namespace}.json`);
          if (response.ok) {
            return await response.json();
          }
        } catch (fallbackError) {
          console.error('Fallback to English failed:', fallbackError);
        }
      }
      
      throw error;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}
