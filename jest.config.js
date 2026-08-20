const nextJest = require('next/jest')
const createJestConfig = nextJest({ dir: './' })

module.exports = createJestConfig({
  testEnvironment: 'jest-environment-jsdom',
  // User attempt to opt nanoid (ESM-only dep) into transformation:
  transformIgnorePatterns: ['/node_modules/(?!nanoid/)'],
})
