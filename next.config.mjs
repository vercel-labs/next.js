/** @type {import('next').NextConfig} */
const nextConfig = {
  // CACHE_COMPONENTS=false to observe the pre-cacheComponents (correct) behavior
  cacheComponents: process.env.CACHE_COMPONENTS !== 'false',
}

export default nextConfig
