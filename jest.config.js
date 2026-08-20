const nextJest = require('next/jest')

// `dir` makes next/jest read tsconfig `baseUrl`/`paths` and pass them to SWC,
// which rewrites `@/hooks/useTest` to a relative path at compile time.
const createJestConfig = nextJest({ dir: './' })

module.exports = createJestConfig({
  testEnvironment: 'node',
})
