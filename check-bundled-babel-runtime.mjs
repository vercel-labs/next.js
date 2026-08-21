// Prints the @babel/runtime version bundled inside published `next` tarballs,
// and benchmarks the GHSA-968p-4wvh-cqc8 (wrapRegExp ReDoS) code path.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const versions = process.argv.slice(2)
if (versions.length === 0) versions.push('15.3.1', '15.4.0', '15.5.23', '16.3.0', '14.2.35', 'canary')

const dir = mkdtempSync(join(tmpdir(), 'next-babel-'))
const results = []

for (const v of versions) {
  const out = execFileSync('npm', ['pack', `next@${v}`, '--silent', '--pack-destination', dir], {
    encoding: 'utf8',
  })
  const tgz = join(dir, out.trim().split('\n').pop().trim())
  const target = join(dir, v.replace(/[^\w.-]/g, '_'))
  execFileSync('mkdir', ['-p', target])
  execFileSync('tar', [
    '-xzf', tgz, '-C', target, '--strip-components=1',
    'package/dist/compiled/@babel/runtime',
  ])
  const pkg = JSON.parse(
    readFileSync(join(target, 'dist/compiled/@babel/runtime/package.json'), 'utf8')
  )
  const helper = join(target, 'dist/compiled/@babel/runtime/helpers/wrapRegExp.js')
  let ms = null
  if (existsSync(helper)) {
    ms = Number(
      execFileSync(process.execPath, ['bench-wrapregexp.cjs', helper], { encoding: 'utf8' }).trim()
    )
  }
  results.push({ next: v, '@babel/runtime': pkg.version, 'wrapRegExp ReDoS (ms)': ms })
}

console.table(results)
