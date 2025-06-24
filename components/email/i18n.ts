// TypeScript: ensure this file is always imported first in your app entrypoint for i18n to work everywhere
// This file is production-ready and will not error if types are missing due to the included i18n.d.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'Email Analytics': 'Email Analytics',
      'Full Report': 'Full Report',
      'Export Data': 'Export Data',
      '7 Days': '7 Days',
      '30 Days': '30 Days',
      '90 Days': '90 Days',
      'Campaign': 'Campaign',
      'No analytics data available': 'No analytics data available',
      'Send some campaigns to see analytics': 'Send some campaigns to see analytics',
      // ...add more keys as needed
    }
  },
  // Add more languages here
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
