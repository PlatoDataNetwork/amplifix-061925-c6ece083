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