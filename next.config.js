/** Mirrors the reporter's URL shape: /medicare/en/ (basePath + i18n + trailingSlash) */
module.exports = {
  basePath: '/medicare',
  trailingSlash: true,
  i18n: { locales: ['en', 'es'], defaultLocale: 'en' },
}
