/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    // Every (width, quality) pair is a separate cache key, so allowing several
    // qualities simply gives the sweep in repro.sh more cold keys to work with.
    qualities: [50, 60, 70, 75, 80, 90],
    // Only so the external-image control can point at the local origin server.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [{ protocol: 'http', hostname: '127.0.0.1', port: '9999' }],
  },
}
