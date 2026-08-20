// Optional variant: copy over next.config.js to observe the ERR_TOO_MANY_REDIRECTS loop.
module.exports = {
  i18n: { locales: ['en-US', 'fr', 'nl-NL'], defaultLocale: 'en-US' },
  async redirects() {
    return [
      { source: '/en-US', destination: '/', locale: false, permanent: true },
      { source: '/en-US/:path*', destination: '/:path*', locale: false, permanent: true },
    ];
  },
};
