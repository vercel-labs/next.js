/** @type {import('next').NextConfig} */
module.exports = {
  // Comment out `i18n` and `/en` starts working (200) again.
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
  },
}
