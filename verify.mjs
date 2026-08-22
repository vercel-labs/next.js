// Repro for vercel/next.js#92950
// Shows that next/dist/compiled/picomatch is still picomatch 4.0.3 (CVE-2026-33671)
// even when the top-level picomatch is pinned to 4.0.4 via dependencies/overrides.
import { createRequire } from 'node:module'
import { readFileSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'

const require = createRequire(import.meta.url)
const nextPkg = require('next/package.json')
const bundledPath = require.resolve('next/dist/compiled/picomatch')
const bundled = require('next/dist/compiled/picomatch')
const top = require('picomatch')
const topVersion = require('picomatch/package.json').version

const buf = readFileSync(bundledPath)
console.log(`next version            : ${nextPkg.version}`)
console.log(`top-level picomatch     : ${topVersion}`)
console.log(`bundled picomatch file  : ${bundledPath}`)
console.log(`bundled size / sha1     : ${statSync(bundledPath).size} bytes / ${createHash('sha1').update(buf).digest('hex')}`)

// Behavioural fingerprint: 4.0.4 refuses to expand risky repeated extglobs,
// 4.0.3 compiles them into a catastrophically backtracking regex.
const PATTERN = '*(a|a)'
const bundledRe = bundled.makeRe(PATTERN)
const topRe = top.makeRe(PATTERN)
console.log(`\nmakeRe('${PATTERN}')`)
console.log(`  bundled (next)        : ${bundledRe.source}`)
console.log(`  top-level ${topVersion}     : ${topRe.source}`)
console.log(`  bundled is 4.0.3-style: ${bundledRe.source === '^(?:(?=.)(?:a|a)*)$'}`)

const input = 'a'.repeat(28) + '!'
for (const [label, re] of [['bundled (next)', bundledRe], [`top-level ${topVersion}`, topRe]]) {
  const t = process.hrtime.bigint()
  re.test(input)
  console.log(`  ReDoS test ${label.padEnd(18)}: ${(Number(process.hrtime.bigint() - t) / 1e6).toFixed(1)} ms for a 29-char input`)
}

// Runtime reachability: image optimizer remotePatterns matching uses the bundled copy.
const { matchRemotePattern } = require('next/dist/shared/lib/match-remote-pattern')
const pattern = { protocol: 'https', hostname: 'cdn.example.com', pathname: '/img/*(a|a)' }
const url = new URL('https://cdn.example.com/img/' + 'a'.repeat(28) + '!')
const t0 = process.hrtime.bigint()
matchRemotePattern(pattern, url)
console.log(`\nmatchRemotePattern (next/dist/shared/lib/match-remote-pattern): ${(Number(process.hrtime.bigint() - t0) / 1e6).toFixed(1)} ms`)
