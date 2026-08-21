// Expect: named ESM imports from the CJS plugin work. Actual: SyntaxError.
import { configs, rules } from '@next/eslint-plugin-next'
console.log('named import OK', Object.keys(configs), Object.keys(rules).length)
