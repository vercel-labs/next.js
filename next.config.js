/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  // Removing pageExtensions makes the instrumentation hook work again.
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
}
