/** @type {import('next').NextConfig} */
const noCompress = process.env.COMPRESS === 'false'
module.exports = {
  // `compress` defaults to true. Set COMPRESS=false to see streaming work.
  compress: !noCompress,
  // separate dist dir so both variants can run side by side
  distDir: noCompress ? '.next-nocompress' : '.next',
  rewrites: async () => [
    { source: '/api/:path*', destination: 'http://127.0.0.1:8000/api/:path*' },
  ],
}
