const basePath = '/my-base-path'

module.exports = {
  basePath,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
  },
  redirects: async () => [
    {
      source: '/',
      destination: basePath,
      permanent: false,
      basePath: false,
    },
  ],
}
