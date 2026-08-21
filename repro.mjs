// Automated check for https://github.com/vercel/next.js/issues/75372
// Run this project from a directory whose name starts with ".git"
// (e.g. /tmp/.git-projects/app).
import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

const PORT = process.env.PORT || 3000
const page = new URL('./app/page.js', import.meta.url)
writeFileSync(page, readFileSync(page, 'utf8').replace(/VERSION_\w+/, 'VERSION_ONE'))

const args = process.env.BUNDLER === 'turbopack' ? '--turbopack' : '--webpack'
const dev = spawn('npx', ['next', 'dev', args, '--port', String(PORT)], {
  stdio: 'inherit',
})
const get = async () => (await fetch(`http://localhost:${PORT}/`)).text()
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

await sleep(12000)
let html = await get()
console.log('initial render contains VERSION_ONE:', html.includes('VERSION_ONE'))

writeFileSync(page, readFileSync(page, 'utf8').replace('VERSION_ONE', 'VERSION_TWO'))
await sleep(12000)
html = await get()
console.log('after edit contains VERSION_TWO:', html.includes('VERSION_TWO'))
console.log(
  html.includes('VERSION_TWO')
    ? 'PASS: file change was picked up'
    : 'FAIL: file change ignored (bug reproduced)'
)
dev.kill('SIGKILL')
process.exit(0)
