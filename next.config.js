/** @type {import('next').NextConfig} */
module.exports = {
  deploymentId: process.env.DEPLOYMENT_ID || 'deployment-OLD',
  experimental: {
    cacheComponents: true,
    staleTimes: { static: 1800 },
  },
}
