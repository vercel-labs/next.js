/** @type {import('next').NextConfig} */
module.exports = {
  adapterPath: require.resolve('./adapter.js'),
  i18n: {
    defaultLocale: 'en',
    localeDetection: false,
    locales: ['en', 'es', 'pt-BR'],
  },
}
