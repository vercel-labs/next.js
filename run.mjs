// Starts the payload server, runs `next build`, then inspects .next/cache/fetch-cache.
import { spawn, spawnSync } from 'node:child_process'
const server = spawn(process.execPath, ['server.mjs'], { stdio: 'inherit' })
await new Promise((r) => setTimeout(r, 800))
const build = spawnSync('npx', ['next', 'build'], { stdio: 'inherit' })
server.kill()
console.log('\n--- next build exit code:', build.status, '---\n')
spawnSync(process.execPath, ['check-cache.mjs'], { stdio: 'inherit' })
process.exit(build.status ?? 0)
