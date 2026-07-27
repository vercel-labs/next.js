import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'pt'],
  defaultLocale: 'en',
  // The unprefixed default-locale path is the one that has to be rewritten,
  // and it is the only one that fails.
  localePrefix: 'as-needed',
})
