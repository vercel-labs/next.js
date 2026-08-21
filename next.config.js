/** @type {import('next').NextConfig} */
module.exports = {
  // webpack parity knob; there is no turbopack equivalent
  webpack: (config) => {
    config.resolve.extensionAlias = { '.js': ['.ts', '.tsx', '.js'] }
    return config
  },
}
