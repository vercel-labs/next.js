/** @type {import('next').NextConfig} */
module.exports = {
  // Uncomment to transpile the workspace packages.
  // The ESM source package (`@repro/ui`, used by `/`) then works,
  // but the pre-compiled CJS package (`@repro/ui-compiled`, used by `/compiled`)
  // still throws "Calligraffitti is not a function".
  // transpilePackages: ['@repro/ui', '@repro/ui-compiled'],
}
