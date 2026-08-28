/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    validateRSCRequestHeaders: process.env.VALIDATE_RSC === 'true',
  },
}
