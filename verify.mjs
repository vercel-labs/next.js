// Checks whether the @splunk/otel native prebuilds landed in .next/standalone
import { existsSync, readdirSync } from 'node:fs'

const dir = '.next/standalone/node_modules/@splunk/otel/prebuilds'
if (!existsSync('.next/standalone/node_modules/@splunk/otel')) {
  console.log('FAIL: @splunk/otel is not present in .next/standalone/node_modules at all')
  process.exit(1)
}
if (!existsSync(dir)) {
  console.log('FAIL: @splunk/otel copied but prebuilds/ (native .node files) missing')
  process.exit(1)
}
console.log('prebuilds present:', readdirSync(dir).join(', '))
console.log('Now run: cd .next/standalone && node server.js  (expect "No native build was found ... loaded from: /ROOT/node_modules/@splunk/otel")')
