/** @type {import('next').NextConfig} */
module.exports = {
  i18n: {
    locales: ['de', 'fr', 'fr-en', 'nl', 'nl-en', 'it'],
    defaultLocale: 'de',
    localeDetection: false,
    domains: [
      { domain: 'example.fr', defaultLocale: 'fr', locales: ['fr-en'] },
      { domain: 'example.nl', defaultLocale: 'nl', locales: ['nl-en'] },
    ],
  },
}
