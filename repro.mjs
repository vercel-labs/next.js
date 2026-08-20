// Reproduction driver for vercel/next.js#95635
// Duplicate identifier 'PagesPageConfig' on `next build` after `next dev`
// in a Pages Router app that has no pages/api routes.
import { spawn, spawnSync } from 'node:child_process'
import { rmSync, readFileSync, existsSync } from 'node:fs'
import path from 'node:path'

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx'

function run(cmd, args, env = {}) {
  console.log(`\n$ ${cmd} ${args.join(' ')}${env.NODE_ENV ? ` (NODE_ENV=${env.NODE_ENV})` : ''}`)
  const res = spawnSync(cmd, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, ...env },
  })
  console.log(`-> exit code: ${res.status}`)
  return res.status
}

async function devOnce() {
  console.log('\n$ next dev (started, will stop after first successful request)')
  const port = 3000 + Math.floor(Math.random() * 2000)
  const dev = spawn(npx, ['next', 'dev', '--port', String(port)], {
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: process.platform === 'win32',
  })
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 1000))
    try {
      const res = await fetch(`http://localhost:${port}/`)
      if (res.ok) break
    } catch {}
  }
  await new Promise((r) => setTimeout(r, 3000))
  dev.kill('SIGINT')
  await new Promise((r) => setTimeout(r, 3000))
  try { dev.kill('SIGKILL') } catch {}
}

console.log('=== 1. clean .next and run next dev once, then stop it ===')
rmSync('.next', { recursive: true, force: true })
rmSync('tsconfig.tsbuildinfo', { force: true })
await devOnce()

if (!existsSync('.next/dev/types/validator.ts')) {
  console.error('ERROR: next dev did not generate .next/dev/types/validator.ts - see output above')
  process.exit(1)
}
for (const p of ['.next/dev/types/validator.ts', '.next/types/validator.ts']) {
  if (existsSync(p)) {
    const hit = readFileSync(p, 'utf8').includes('type PagesPageConfig')
    console.log(`${p}: declares global "type PagesPageConfig" = ${hit}`)
  }
}

console.log('\n=== 2. next build (FAILS on Windows with TS2300; passes on macOS/Linux) ===')
const buildStatus = run(npx, ['next', 'build'])

console.log('\n=== 3. plain tsc over the tsconfig Next.js generated (FAILS everywhere) ===')
const tscStatus = run(npx, ['tsc', '--noEmit'])

console.log('\n=== 4. same Next.js type check without the dev-types path filter ===')
const devEnvStatus = run(npx, ['next', 'build'], { NODE_ENV: 'development' })

console.log('\n=== summary ===')
console.log(`next build                      -> ${buildStatus}`)
console.log(`tsc --noEmit                    -> ${tscStatus} (expected 2, TS2300 Duplicate identifier 'PagesPageConfig')`)
console.log(`NODE_ENV=development next build -> ${devEnvStatus} (expected 1, "Duplicate identifier 'PagesPageConfig'")`)
console.log(`\nBoth ${path.join('.next', 'types', 'validator.ts')} and ${path.join('.next', 'dev', 'types', 'validator.ts')}`)
console.log('are global scripts (no imports) when the app has no pages/api route, so the same')
console.log("top-level `type PagesPageConfig` is declared twice in the program.")
console.log('With a pages/api route present, the generated file imports NextApiHandler, becomes a')
console.log('module, and the collision disappears - which is why the bug needs an api-less app.')
