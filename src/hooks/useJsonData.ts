import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentLanguage } from '@/utils/language';

export interface JsonDataHook<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useJsonData<T>(filename: string): JsonDataHook<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const currentLang = getCurrentLanguage();
        const namespace = filename.replace('.json', '');
        
        // For non-English languages, try to load from Supabase translations first
        if (currentLang !== 'en') {
          try {
            const { data: translationData, error: dbError } = await supabase
              .from('translations')
              .select('content')
              .eq('language_code', currentLang)
              .eq('namespace', namespace)
              .single();
            
            if (!dbError && translationData?.content) {
              console.log(`[useJsonData] Loaded ${namespace} from Supabase for ${currentLang}`);
              setData(translationData.content as T);
              setIsLoading(false);
              return;
            } else {
              console.log(`[useJsonData] No translation found for ${namespace}/${currentLang}, falling back to English with GTranslate`);
            }
          } catch (dbError) {
            console.log(`[useJsonData] Supabase lookup failed for ${namespace}/${currentLang}, using fallback`);
          }
        }
        
        // Fallback to loading English version from static files
        const response = await fetch(`/data/${filename}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load ${filename}: ${response.status}`);
        }
        
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error(`Error loading ${filename}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filename]);

  return { data, isLoading, error };
}