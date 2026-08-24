// Builds the app 4 times: {typeof-guard, plain-guard} x {sourcemaps off, sourcemaps on}
// and reports whether the dead subtree survives in the client bundle.
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const GUARDS = {
  'typeof __FLAG__ === "undefined" || __FLAG__': "typeof __MY_FLAG__ === 'undefined' || __MY_FLAG__",
  'if (__FLAG__)': '__MY_FLAG__',
}

function writeSdk(guard) {
  fs.writeFileSync('fake-sdk/index.js', `import { feature } from './feature.js'

function getDefaultIntegrations() {
  const integrations = []
  if (${guard}) {
    integrations.push(feature())
  }
  return integrations
}

export function init() { return { defaultIntegrations: getDefaultIntegrations() } }
`)
}

function writeConfig(sourcemaps) {
  fs.writeFileSync('next.config.mjs', `/** @type {import('next').NextConfig} */
const nextConfig = {
  ${sourcemaps ? 'productionBrowserSourceMaps: true,' : ''}
  compiler: { define: { __MY_FLAG__: false } },
}
export default nextConfig
`)
}

const dir = '.next/static/chunks'
const rows = []
for (const [label, guard] of Object.entries(GUARDS)) {
  for (const sourcemaps of [false, true]) {
    writeSdk(guard)
    writeConfig(sourcemaps)
    fs.rmSync('.next', { recursive: true, force: true })
    execSync('npx next build', { stdio: 'inherit' })
    const files = fs.readdirSync(dir)
    const js = files.filter((f) => f.endsWith('.js'))
    const maps = files.filter((f) => f.endsWith('.map'))
    const read = (f) => fs.readFileSync(path.join(dir, f), 'utf8')
    const bytes = js.reduce((n, f) => n + fs.statSync(path.join(dir, f)).size, 0)
    rows.push({
      guard: label,
      productionBrowserSourceMaps: sourcemaps,
      'marker in .js': js.some((f) => read(f).includes('FEATURE_MARKER_SHOULD_BE_TREESHAKEN')),
      'marker in .map': maps.some((f) => read(f).includes('FEATURE_MARKER_SHOULD_BE_TREESHAKEN')),
      'client js bytes': bytes,
    })
  }
}
console.table(rows)
