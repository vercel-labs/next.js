/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = {
        ...(config.externals || {}),
        react: 'React',
        'react-dom': 'ReactDOM',
      }
    }
    return config
  },
}
