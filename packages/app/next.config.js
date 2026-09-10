const isRspack = process.env.NEXT_RSPACK === 'true';

const baseConfig = {
  reactStrictMode: false,
  // Both packages are declared in transpilePackages, expected to be bundled into the pages router server bundle
  transpilePackages: ['@demo/di-core', '@demo/service'],
  // bundlePagesRouterDependencies: false — the Next 16 default, i.e. the trigger condition for this bug
};

// In webpack mode the next-rspack plugin is not loaded; used as the control group
module.exports = isRspack ? require('next-rspack')(baseConfig) : baseConfig;
