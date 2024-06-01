import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import iDe from './locales/de.json';
import iEn from './locales/en.json';
import iEs from './locales/es.json';
import iFr from './locales/fr.json';
import iPt from './locales/pt.json';
import iRu from './locales/ru.json';

export const defaultNS = 'common';
export const defaultLng = 'en';

export type SupportedLanguage = 'de' | 'en' | 'es' | 'fr' | 'pt' | 'ru';
export const supportedLngs: SupportedLanguage[] = ['de', 'en', 'es', 'fr', 'pt', 'ru'];

export const resources = {
  de: { common: iDe },
  en: { common: iEn },
  es: { common: iEs },
  fr: { common: iFr },
  pt: { common: iPt },
  ru: { common: iRu },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: defaultLng,
    fallbackLng: defaultLng,
    supportedLngs,
    defaultNS,
    resources,
    interpolation: {
      escapeValue: false,
    },
  });
