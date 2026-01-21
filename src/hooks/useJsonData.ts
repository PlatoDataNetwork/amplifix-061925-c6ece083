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
        
        // Handle both full paths (/data/file.json) and just filenames (file.json)
        const isFullPath = filename.startsWith('/');
        const baseFilename = isFullPath ? filename.split('/').pop() || filename : filename;
        const namespace = baseFilename.replace('.json', '');
        
        // For non-English languages, try to load from Supabase translations first
        if (currentLang !== 'en') {
          try {
            const { data: translationData, error: dbError } = await supabase
              .from('translations')
              .select('content')
              .eq('language_code', currentLang)
              .eq('namespace', namespace)
              .maybeSingle();
            
            if (!dbError && translationData?.content) {
              // Validate that the content has data before using it
              const content = translationData.content as any;
              if (content && Object.keys(content).length > 0) {
                console.log(`[useJsonData] Loaded ${namespace} from Supabase for ${currentLang}`);
                setData(content as T);
                setIsLoading(false);
                return;
              } else {
                console.warn(`[useJsonData] Translation for ${namespace}/${currentLang} is empty, falling back`);
              }
            } else {
              console.log(`[useJsonData] No translation found for ${namespace}/${currentLang}, falling back to English`);
            }
          } catch (dbError) {
            console.warn(`[useJsonData] Supabase lookup failed for ${namespace}/${currentLang}:`, dbError);
          }
        }
        
        // Fallback to loading English version from static files
        // If full path provided, use it directly; otherwise try /data/ first
        let fetchPath = isFullPath ? filename : `/data/${baseFilename}`;
        let response = await fetch(fetchPath);
        
        // Fallback to /locales/en/ for i18n files
        if (!response.ok && (baseFilename === 'common.json' || baseFilename === 'home.json')) {
          response = await fetch(`/locales/en/${baseFilename}`);
        }
        
        if (!response.ok) {
          throw new Error(`Failed to load ${fetchPath}: ${response.status}`);
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