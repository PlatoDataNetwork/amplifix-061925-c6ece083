import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { translatePage } from '@/utils/translations';
import { getLanguageFromPath } from '@/utils/language';

export function useLanguage() {
  const location = useLocation();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const langCode = getLanguageFromPath() || 'en';
    setCurrentLanguage(langCode);
  }, [location.pathname]);

  useEffect(() => {
    if (currentLanguage === 'en') return;
    
    setIsTranslating(true);
    
    // Wait for content to fully render before translating
    const translateWithRetries = (attempts = 0) => {
      const maxAttempts = 10;
      const delay = 100;
      
      // Check if content is loaded by looking for key elements
      const hasContent = document.body.textContent && 
                        document.body.textContent.length > 100;
      
      if (hasContent || attempts >= maxAttempts) {
        translatePage(currentLanguage);
        setIsTranslating(false);
      } else {
        setTimeout(() => translateWithRetries(attempts + 1), delay);
      }
    };
    
    // Initial delay to let React render
    setTimeout(() => translateWithRetries(), 200);
  }, [currentLanguage]);

  return { currentLanguage, isTranslating };
}
