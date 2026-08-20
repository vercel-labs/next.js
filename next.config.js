/** @type {import('next').NextConfig} */
module.exports = {
  i18n: {
    locales: ['en-US', 'en-CA'],
    defaultLocale: 'en-US',
    domains: [
      { domain: 'example.co', defaultLocale: 'en-US' },
      { domain: 'example.ca', defaultLocale: 'en-CA' },
    ],
  },
};
