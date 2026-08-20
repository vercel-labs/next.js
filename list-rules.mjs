import nextPlugin from '@next/eslint-plugin-next'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { version } = require('@next/eslint-plugin-next/package.json')
console.log('@next/eslint-plugin-next', version)
console.log('rules:', Object.keys(nextPlugin.rules).sort().join(', '))
console.log("has 'link-passhref':", 'link-passhref' in nextPlugin.rules)
