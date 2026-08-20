/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // Relay's multi-project config format defines sources/projects in relay.config.js,
    // so there is no single `src` root to give Next.js here.
    relay: {
      language: 'typescript',
      artifactDirectory: '__generated__',
    },
  },
}
export default nextConfig
