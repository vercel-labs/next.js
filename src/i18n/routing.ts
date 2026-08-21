import { defineRouting } from 'next-intl/routing';
export const routing = defineRouting({
  locales: ['en', 'el'],
  defaultLocale: 'en',
  localePrefix: 'always'
});
