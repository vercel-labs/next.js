// Mimics how Vercel's Next.js builder invokes the stable adapter pipeline for
// Next.js >= 16.2: it sets NEXT_ADAPTER_PATH to @next-community/adapter-vercel
// and passes the parsed vercel.json through NEXT_ADAPTER_VERCEL_CONFIG.
import { spawnSync } from 'node:child_process'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const adapterPath = path.dirname(
  require.resolve('@next-community/adapter-vercel/package.json')
)
const vercelConfig = readFileSync('vercel.json', 'utf8')
const adapterVersion = require('@next-community/adapter-vercel/package.json').version

console.log(`adapter: @next-community/adapter-vercel@${adapterVersion}`)
console.log(`vercel.json bunVersion: ${JSON.parse(vercelConfig).bunVersion}`)

const res = spawnSync(
  process.execPath,
  [require.resolve('next/dist/bin/next'), 'build'],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_ADAPTER_PATH: adapterPath,
      NEXT_ADAPTER_VERCEL_CONFIG: vercelConfig,
    },
  }
)
if (res.status !== 0) process.exit(res.status ?? 1)

const fnDir = path.join('.next', 'output', 'functions')
if (!existsSync(fnDir)) {
  console.error(`no functions emitted at ${fnDir}`)
  process.exit(1)
}
console.log('\n--- .next/output/functions/*/.vc-config.json runtimes ---')
let bad = 0
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name.endsWith('.func')) {
        const cfg = JSON.parse(readFileSync(path.join(p, '.vc-config.json'), 'utf8'))
        console.log(`${p}: runtime=${cfg.runtime}`)
        if (!String(cfg.runtime).startsWith('bun')) bad++
      } else walk(p)
    }
  }
}
walk(fnDir)
console.log(
  bad > 0
    ? `\nFAIL: ${bad} function(s) use a non-bun runtime despite bunVersion "1.x"`
    : '\nPASS: all functions use a bun runtime'
)
process.exit(bad > 0 ? 1 : 0)
