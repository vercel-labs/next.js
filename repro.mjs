// Reproduction for vercel/next.js#77539
// next.config.ts rewrites() reads process.env.REWRITE_URL.
// Build WITHOUT the env var, then start the standalone server WITH it set at runtime.
// Expected by reporter: /rewrite proxies to https://www.example.com
// Actual: the destination baked into .next/routes-manifest.json at build time wins,
// so /rewrite serves /fail-to-rewrite. Same effect as `docker compose up` with env vars.
import { execSync, spawn } from 'node:child_process'
import { cpSync, readFileSync } from 'node:fs'

const buildEnv = { ...process.env }
delete buildEnv.REWRITE_URL
execSync('next build', { stdio: 'inherit', env: buildEnv })

console.log('\nrewrites in .next/routes-manifest.json:')
console.log(JSON.stringify(JSON.parse(readFileSync('.next/routes-manifest.json', 'utf8')).rewrites, null, 1))

cpSync('.next/static', '.next/standalone/.next/static', { recursive: true })
const server = spawn('node', ['server.js'], {
  cwd: '.next/standalone',
  env: { ...process.env, REWRITE_URL: 'https://www.example.com', PORT: '3000', HOSTNAME: '127.0.0.1' },
  stdio: 'inherit',
})

await new Promise((r) => setTimeout(r, 6000))
const html = await fetch('http://127.0.0.1:3000/rewrite').then((r) => r.text())
const failed = html.includes('process.env.REWRITE_URL is undefined')
console.log(`\nGET /rewrite -> ${failed ? 'served /fail-to-rewrite (BUG REPRODUCED)' : 'proxied to example.com'}`)
server.kill()
process.exit(failed ? 1 : 0)
