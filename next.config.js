/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/bug',
                destination: '/error'
            }
        ]
    }
}

module.exports = nextConfig
