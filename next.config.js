/** @type {import('next').NextConfig} */
// Toggle with SWC=1 (forceSwcTransforms) vs default (Babel via babel.config.js)
module.exports = {
  experimental: { forceSwcTransforms: process.env.SWC === '1' },
}
