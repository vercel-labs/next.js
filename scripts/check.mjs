// Automated check for vercel/next.js#98212.
//
// Starts the custom dev server (node server.js) and drives a real Chrome with
// NO DevTools/CDP client attached, because attaching one makes Chrome refuse to
// prerender (Preload.prerenderStatusUpdated => "PrerenderingDisabledByDevTools").
// All evidence is therefore collected server-side: every /_next/hmr WebSocket
// upgrade is logged by server.js.
//
// Usage: node scripts/check.mjs [prerender|control]
//   prerender -> loads "/?auto", which navigates to the prerendered /target
//   control   -> loads "/target" directly
//
// Expected on a fixed Next.js: 1 upgrade in both modes.

import { spawn } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const mode = process.argv[2] === 'control' ? 'control' : 'prerender'
const WINDOW_MS = 25_000
const CHROME =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const upgrades = []
let serverReady

const server = spawn('node', ['server.js'], { cwd: process.cwd() })
const ready = new Promise((resolve) => (serverReady = resolve))
for (const stream of [server.stdout, server.stderr]) {
  stream.setEncoding('utf8')
  stream.on('data', (chunk) => {
    process.stdout.write(chunk)
    for (const line of chunk.split('\n')) {
      if (line.includes('[HMR-UPGRADE')) upgrades.push({ line, t: Date.now() })
      if (line.includes('ready on http://localhost:3000')) serverReady()
    }
  })
}

await ready
await new Promise((r) => setTimeout(r, 2000))

const url =
  mode === 'prerender'
    ? 'http://localhost:3000/?auto'
    : 'http://localhost:3000/target'

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--no-first-run',
    '--no-sandbox',
    `--user-data-dir=${mkdtempSync(join(tmpdir(), 'chrome-98212-'))}`,
    url,
  ],
  { stdio: 'ignore' }
)

console.log(`\n[check] mode=${mode} url=${url}; observing ${WINDOW_MS / 1000}s\n`)
await new Promise((r) => setTimeout(r, WINDOW_MS))

chrome.kill('SIGKILL')
server.kill('SIGKILL')

console.log(`\n[check] mode=${mode}: ${upgrades.length} /_next/hmr upgrade(s)`)
console.log(`[check] expected: 1`)
if (upgrades.length > 2) {
  console.log('[check] BUG REPRODUCED: endless HMR reconnect loop (~1/second)')
  process.exitCode = 1
} else {
  console.log('[check] ok')
}
