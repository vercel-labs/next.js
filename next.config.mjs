/** @type {import('next').NextConfig} */
export default {
  transpilePackages: ['react-native-web'],
  webpack: (config) => {
    config.resolve.alias = { ...config.resolve.alias, 'react-native$': 'react-native-web' }
    return config
  },
}
