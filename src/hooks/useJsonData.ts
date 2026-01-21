import { useState, useEffect } from 'react';

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
        
        // Handle both full paths (/data/file.json) and just filenames (file.json)
        const isFullPath = filename.startsWith('/');
        const baseFilename = isFullPath ? filename.split('/').pop() || filename : filename;
        
        // Load English version from static files - GTranslate handles translation
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