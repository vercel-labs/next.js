// Mimics config wrappers such as `next-compose-plugins` that spread the
// `defaultConfig` Next.js hands to the config function back into the
// user config. See https://github.com/vercel/next.js/issues/39161
module.exports = (phase, { defaultConfig }) => {
  return {
    ...defaultConfig,
    reactStrictMode: true,
  }
}
