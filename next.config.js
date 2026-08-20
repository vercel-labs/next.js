/** @type {import('next').NextConfig} */
module.exports = {
  // Remove this i18n block and /de/broken + /de/favorite start returning 200.
  i18n: { locales: ['default', 'de', 'en'], defaultLocale: 'default' },
}
