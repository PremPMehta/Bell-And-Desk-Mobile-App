import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
const en = require('./locales/en.json');
const es = require('./locales/es.json');

const LANGUAGE_DETECTOR = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      const language = await AsyncStorage.getItem('app-language');
      if (language) {
        // Should look like "en" or "es" if stored by atomWithStorage
        // Try to parse it, or use raw if not JSON
        try {
          const parsed = JSON.parse(language);
          return callback(parsed);
        } catch {
          return callback(language);
        }
      }
      return callback('en');
    } catch (error) {
      return callback('en');
    }
  },
  init: () => {},
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
