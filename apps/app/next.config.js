const { join } = require('path')
/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  outputFileTracingRoot: join(__dirname, '../../'),
  i18n: { locales: ['en', 'fr'], defaultLocale: 'en' },
}
