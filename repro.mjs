// Repro for https://github.com/vercel/next.js/issues/30738
// Starts `next dev`, waits until it serves a page, then runs `next build`
// in the same project while dev is still running, and prints the build exit code.
import { spawn } from 'node:child_process'
import fs from 'node:fs'

const log = fs.createWriteStream('dev-server.log')
const dev = spawn('npx', ['--no-install', 'next', 'dev', '-p', '3333'], {
  stdio: ['ignore', 'pipe', 'pipe'],
})
dev.stdout.pipe(log)
dev.stderr.pipe(log)

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch('http://localhost:3333/')
      if (res.status === 200) return true
    } catch {}
    await new Promise((r) => setTimeout(r, 1000))
  }
  return false
}

const ok = await waitForServer()
console.log('dev server serving 200:', ok)
console.log('trace files present:', fs.readdirSync('.next'), fs.existsSync('.next/dev/trace') ? '(dev writes .next/dev/trace)' : '')

const build = spawn('npx', ['--no-install', 'next', 'build'], { stdio: 'inherit' })
const code = await new Promise((r) => build.on('exit', r))
console.log('next build exit code while `next dev` is running:', code)
dev.kill('SIGKILL')
process.exit(code === 0 ? 0 : 1)
