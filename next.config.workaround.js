/** @type {import('next').NextConfig} */
module.exports = {
  // Working alternative: barrel optimization resolves each named export to
  // its own file automatically, no transform template needed.
  experimental: { optimizePackageImports: ['@some/library'] },
}
