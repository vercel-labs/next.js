/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true, layers: true }
    return config
  },
}
