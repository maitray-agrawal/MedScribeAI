import React, { createContext, useContext, useState, useEffect } from 'react';
import { en, Translations } from './locales/en';
import { es } from './locales/es';
import { hi } from './locales/hi';
import { mr } from './locales/mr';
import { ta } from './locales/ta';

export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'ta' | 'es';

export interface LanguageMeta {
  code: string;
  name: string;
  nativeName: string;
  script: 'Latin' | 'Devanagari' | 'Tamil';
}

export const SUPPORTED_LANGUAGES_META: Record<SupportedLanguage, LanguageMeta> = {
  en: { code: 'EN', name: 'English', nativeName: 'English', script: 'Latin' },
  hi: { code: 'HI', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari' },
  mr: { code: 'MR', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari' },
  ta: { code: 'TA', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil' },
  es: { code: 'ES', name: 'Spanish', nativeName: 'Español', script: 'Latin' },
};

/**
 * Creates a recursive fallback proxy so that missing keys in any language
 * seamlessly and reliably fall back to English without crashing or returning undefined.
 */
function createFallbackProxy<T extends object>(target: T, fallback: T): T {
  return new Proxy(target, {
    get(obj, prop: string | symbol) {
      const val = (obj as any)[prop];
      const fallbackVal = (fallback as any)[prop];

      if (val === undefined || val === null || val === '') {
        return fallbackVal;
      }
      if (
        typeof val === 'object' &&
        val !== null &&
        !Array.isArray(val) &&
        typeof fallbackVal === 'object' &&
        fallbackVal !== null
      ) {
        return createFallbackProxy(val, fallbackVal);
      }
      return val;
    },
  });
}

const rawTranslations: Record<SupportedLanguage, Translations> = {
  en,
  es,
  hi,
  mr,
  ta,
};

// Safe dictionaries with guaranteed English fallback
const translations: Record<SupportedLanguage, Translations> = {
  en,
  es: createFallbackProxy(es, en),
  hi: createFallbackProxy(hi, en),
  mr: createFallbackProxy(mr, en),
  ta: createFallbackProxy(ta, en),
};

const LANGUAGE_STORAGE_KEY = 'vaidhya_language_v2';
const LEGACY_LANGUAGE_STORAGE_KEY = 'medscribe_lite_language_v1';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  languageMeta: LanguageMeta;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = (localStorage.getItem(LANGUAGE_STORAGE_KEY) ||
        localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY)) as SupportedLanguage | null;
      if (saved && (['en', 'hi', 'mr', 'ta', 'es'] as SupportedLanguage[]).includes(saved)) {
        return saved;
      }
    } catch {
      // Fallback to English if localStorage unavailable
    }
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      localStorage.setItem(LEGACY_LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    languageMeta: SUPPORTED_LANGUAGES_META[language],
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return default English context if rendered outside provider (e.g. in standalone unit tests)
    return {
      language: 'en',
      setLanguage: () => {},
      languageMeta: SUPPORTED_LANGUAGES_META.en,
      t: en,
    };
  }
  return context;
};
