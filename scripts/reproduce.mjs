import { spawn } from 'node:child_process'
import { readFile, readdir, rm } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const port = Number(process.env.PORT || 3099)

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: 'inherit', ...options })
    child.on('error', reject)
    child.on('exit', (code, signal) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} exited with ${code ?? signal}`))
    })
  })
}

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await filesUnder(file)))
    else files.push(file)
  }
  return files
}

await rm(path.join(root, '.next'), { recursive: true, force: true })
await run(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'build'])

const chunks = (await filesUnder(path.join(root, '.next/server/chunks'))).filter((file) => file.endsWith('.js'))
let emittedChunk
let emittedCode
for (const chunk of chunks) {
  const code = await readFile(chunk, 'utf8')
  if (code.includes('stats:') && code.includes('schemaVersion')) {
    emittedChunk = path.relative(root, chunk)
    emittedCode = code
    break
  }
}
if (!emittedChunk) throw new Error('Could not locate the emitted cash-game stats chunk')

const branchSurvived = emittedCode.includes('.items.create(')
const server = spawn(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'start', '-p', String(port)], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'pipe'],
})
server.stdout.pipe(process.stdout)
server.stderr.pipe(process.stderr)

let response
try {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      const result = await fetch(`http://127.0.0.1:${port}/api/test`)
      response = { status: result.status, body: await result.json() }
      break
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }
  if (!response) throw new Error('next start did not become ready')
} finally {
  server.kill('SIGTERM')
  await new Promise((resolve) => server.once('exit', resolve))
}

console.log(JSON.stringify({
  nextVersion: JSON.parse(await readFile(path.join(root, 'node_modules/next/package.json'), 'utf8')).version,
  emittedChunk,
  branchSurvived,
  response,
}, null, 2))

if (!branchSurvived) throw new Error('The production chunk deleted the items.create branch')
if (response.status !== 200 || !response.body.log.some((entry) => entry.startsWith('create:'))) {
  throw new Error('The missing-document request did not reach the create branch')
}
