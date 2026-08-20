// Reproduction for vercel/next.js#71807
// Verifies that caniuse-lite (CC-BY-4.0) is part of next's *production*
// dependency tree, so it lands in consumers' prod SBOM / license scans.
import { execFileSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'

console.log('# 1. next manifest dependency section')
const nextPkg = JSON.parse(readFileSync('node_modules/next/package.json', 'utf8'))
console.log(`next@${nextPkg.version} dependencies:`, nextPkg.dependencies)
const declared = Boolean(nextPkg.dependencies?.['caniuse-lite'])
console.log(`caniuse-lite declared in next "dependencies": ${declared}`)

console.log('\n# 2. production-only dependency tree (npm ls --omit=dev)')
let tree = ''
try {
  tree = execFileSync(npm, ['ls', 'caniuse-lite', '--omit=dev', '--all'], {
    encoding: 'utf8',
  })
} catch (e) {
  tree = e.stdout || ''
}
console.log(tree.trim())

console.log('\n# 3. installed caniuse-lite license')
const clPath = 'node_modules/caniuse-lite/package.json'
const cl = existsSync(clPath) ? JSON.parse(readFileSync(clPath, 'utf8')) : null
if (cl) console.log(`${cl.name}@${cl.version} license: ${cl.license}`)

const reproduced = declared && cl?.license === 'CC-BY-4.0'
console.log(
  `\nRESULT: ${reproduced ? 'REPRODUCED' : 'NOT REPRODUCED'} - caniuse-lite (CC-BY-4.0) is a runtime dependency of next@${nextPkg.version}`
)
process.exit(reproduced ? 0 : 1)
