import i18n, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const options: InitOptions = {
  fallbackLng: 'fr',
  lng: 'fr',
  debug: false  ,
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['querystring', 'cookie', 'localStorage', 'navigator'],
    caches: ['localStorage', 'cookie'],
    cookieOptions: {
      path: '/',
      sameSite: 'strict',
      expires: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
    },
  },
  backend: {
    loadPath: '/locales/{{lng}}.json',
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(options);

export default i18n;
