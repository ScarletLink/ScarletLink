
"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';
import { translateText } from '@/ai/flows/translate-text';
import { useToast } from './use-toast';
import { languages } from '@/lib/data';

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  translations: Record<string, string>;
  t: (key: string) => string;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();
  
  const knownKeysRef = useRef<Set<string>>(new Set());
  const pendingKeysRef = useRef<Set<string>>(new Set());
  const translationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerTranslation = useCallback(async (targetLang: string) => {
    if (pendingKeysRef.current.size === 0 || targetLang === 'en') {
      if (targetLang !== 'en') {
        const langName = languages.find(l => l.code === targetLang)?.name || targetLang;
        toast({
          title: "Translation Complete",
          description: `The page has been translated to ${langName}.`,
        });
      }
      return;
    }

    setIsTranslating(true);
    const keysToTranslate = Array.from(pendingKeysRef.current);
    pendingKeysRef.current.clear(); // Clear pending keys before the async call

    try {
      const result = await translateText({
        texts: keysToTranslate,
        targetLanguage: targetLang,
      });

      if (result && result.translations) {
        setTranslations(prev => {
            const newTranslations: Record<string, string> = {...prev};
            result.translations.forEach((translatedText, index) => {
                newTranslations[keysToTranslate[index]] = translatedText;
            });
            return newTranslations;
        });
        const langName = languages.find(l => l.code === targetLang)?.name || targetLang;
        toast({
          title: "Translation Complete",
          description: `The page has been translated to ${langName}.`,
        });
      }
    } catch (error) {
      console.error("Translation failed:", error);
      toast({
        variant: 'destructive',
        title: 'Translation Failed',
        description: 'Could not translate the page. Please try again.',
      });
      // If it fails, add the keys back to be tried again.
      keysToTranslate.forEach(key => pendingKeysRef.current.add(key));
    } finally {
      setIsTranslating(false);
    }
  }, [toast]);

  const t = useCallback((key: string) => {
    if (!key) return '';
    // If the key is new, add it to our known keys and queue it for translation.
    if (!knownKeysRef.current.has(key)) {
        knownKeysRef.current.add(key);
        if (language !== 'en') {
            pendingKeysRef.current.add(key);
            if (translationTimeoutRef.current) clearTimeout(translationTimeoutRef.current);
            translationTimeoutRef.current = setTimeout(() => triggerTranslation(language), 500);
        }
    }

    if (language === 'en') {
      return key;
    }
    return translations[key] || key;
  }, [language, translations, triggerTranslation]);


  const setLanguageAndTranslate = (lang: string) => {
    if (lang === language) return;
    
    setLanguage(lang);
    setTranslations({}); // Clear old translations
    pendingKeysRef.current.clear(); // Clear any pending translations
    if (translationTimeoutRef.current) clearTimeout(translationTimeoutRef.current);

    if (lang !== 'en') {
        // Queue all known keys for translation into the new language
        knownKeysRef.current.forEach(key => pendingKeysRef.current.add(key));
        translationTimeoutRef.current = setTimeout(() => triggerTranslation(lang), 100);
    }
  };


  return (
    <TranslationContext.Provider value={{ language, setLanguage: setLanguageAndTranslate, translations, t, isTranslating }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
