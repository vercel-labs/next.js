// Measures how much of `next build` is spent in output file tracing.
// Usage: node measure.mjs [--webpack]
import { execSync } from 'node:child_process'
import { rmSync, readFileSync } from 'node:fs'

const args = process.argv.slice(2).join(' ')
const runOnce = (env, label) => {
  rmSync('.next', { recursive: true, force: true })
  const start = Date.now()
  execSync(`npx next build ${args}`, { stdio: 'inherit', env: { ...process.env, ...env } })
  const wall = (Date.now() - start) / 1000
  const spans = []
  for (const line of readFileSync('.next/trace', 'utf8').trim().split('\n')) {
    try { spans.push(...JSON.parse(line)) } catch {}
  }
  const sum = (name) =>
    spans.filter((s) => s.name === name).reduce((a, s) => a + s.duration, 0) / 1e6
  console.log(
    `\n[${label}] wall ${wall.toFixed(2)}s | next-build ${sum('next-build').toFixed(2)}s | ` +
      `collect-build-traces ${sum('collect-build-traces').toFixed(2)}s | ` +
      `node-file-trace-build ${sum('node-file-trace-build').toFixed(2)}s\n`
  )
}

runOnce({}, 'outputFileTracing default (on)')
runOnce({ NEXT_REPRO_TRACING: 'false' }, 'outputFileTracing: false (Next <= 14 only)')
