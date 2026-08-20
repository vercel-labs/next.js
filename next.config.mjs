/** @type {import('next').NextConfig} */
export default {
  images: {
    remotePatterns: [{ protocol: 'http', hostname: '127.0.0.1' }],
    // Next >= 15.5.x blocks private IPs for remote images, so opt in when testing
    // those versions: ALLOW_LOCAL_IP=1 npm run dev
    ...(process.env.ALLOW_LOCAL_IP ? { dangerouslyAllowLocalIP: true } : {}),
  },
}
