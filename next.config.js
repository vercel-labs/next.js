/** @type {import("next").NextConfig} */
const generateBuildId = () => process.env.GIT_SHA || Date.now().toString()
module.exports = {
  distDir: `dist/build/${generateBuildId()}`,
}
