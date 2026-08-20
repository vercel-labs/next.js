// Verifies `next lint --max-warnings <n>` exit codes for vercel/next.js#50460.
import { spawnSync } from 'node:child_process'

const cases = [
  { args: ['lint', '--max-warnings', '0'], expected: 1 },
  { args: ['lint', '--max-warnings', '1'], expected: 1 },
  { args: ['lint', '--max-warnings', '2'], expected: 0 },
  { args: ['lint', '--max-warnings', '0', '--file', 'pages/_app.js'], expected: 1 },
]

let failures = 0
for (const c of cases) {
  const r = spawnSync('node', ['node_modules/next/dist/bin/next', ...c.args], {
    encoding: 'utf8',
  })
  const warnings = ((r.stdout + r.stderr).match(/Warning:/g) || []).length
  const ok = r.status === c.expected
  if (!ok) failures++
  console.log(
    `${ok ? 'PASS' : 'FAIL'}  next ${c.args.join(' ')}  -> exit ${r.status} (expected ${c.expected}), warnings reported: ${warnings}`
  )
}
console.log(failures === 0 ? '\nAll cases behave as documented (flag works).' : `\n${failures} case(s) deviate from documented behavior.`)
process.exit(0)
