// Automated check for https://github.com/vercel/next.js/issues/17338
// Case A: plain `next dev`            -> .env.local wins (documented behavior)
// Case B: `next dev` started the way the Vercel CLI (`vercel dev`) starts it,
//         i.e. with `.env` values already injected into process.env
//                                     -> .env wins (bug reported in #17338)
import { spawn } from 'node:child_process'
import { readFileSync, rmSync } from 'node:fs'
import dotenv from 'dotenv'

const dotEnv = dotenv.parse(readFileSync(new URL('.env', import.meta.url)))

async function run(label, port, extraEnv) {
  const child = spawn('next', ['dev', '-p', String(port)], {
    env: { ...process.env, ...extraEnv, NEXT_TELEMETRY_DISABLED: '1' },
    stdio: ['ignore', 'inherit', 'inherit'],
  })
  let body = ''
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 1000))
    try {
      const res = await fetch(`http://localhost:${port}/api/env`)
      if (res.ok) {
        body = await res.text()
        break
      }
    } catch {}
  }
  child.kill('SIGTERM')
  await new Promise((r) => setTimeout(r, 4000))
  try {
    child.kill('SIGKILL')
  } catch {}
  rmSync(new URL('.next/dev', import.meta.url), { recursive: true, force: true })
  console.log(`\n### ${label}\n${body}\n`)
  return JSON.parse(body || '{}')
}

const a = await run('A: next dev (no pre-existing process.env)', 3100, {})
const b = await run('B: next dev with .env pre-injected (what `vercel dev` does)', 3101, dotEnv)
console.log('A.TEST =', a.TEST, ' (expected from-dot-env-local)')
console.log('B.TEST =', b.TEST, ' (docs say .env.local always overrides -> from-dot-env-local)')
process.exit(b.TEST === 'from-dot-env-local' ? 0 : 1)
