/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  // Intent: exclude the local ./data folder from the standalone output.
  // Actual: picomatch is called with { contains: true } in
  // next/dist/build/collect-build-traces.js, so "data/**/*" also matches
  // node_modules/next/dist/lib/metadata/**/* (substring "data/..."),
  // which deletes Next.js' own metadata lib from the standalone output.
  outputFileTracingExcludes: {
    '*': ['data/**/*'],
  },
};
