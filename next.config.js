/**
 * @type {import("next").NextConfig}
 **/
const baseConfig = {};

/**
 * Do not upload sourcemaps to Sentry for non-tagged builds.
 * They have this semantic version: x.y.z-integer-sha_commit (1.46.0-1-gc67c699).
 * Permitted versions: x.y.x or x.y.z-v
 * Not permitted: x.y.z-v1-v2 (only one "-")
 */

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
const getConfig = () => {
  return baseConfig;
};

module.exports = getConfig();
