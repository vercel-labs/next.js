/**
 * Reproduction for vercel/next.js#98065
 *
 * packages/create-next-app/index.ts (canary) contains:
 *
 *   const opts = program.opts()
 *   ...
 *   if (!projectPath) {
 *     console.log('\nPlease specify the project directory:\n' +
 *       `  ${cyan(opts.name())} ...`)
 *
 * `program.opts()` returns a plain options object which has no `name()`
 * method (only the Command instance has one), so instead of printing usage
 * the CLI throws `TypeError: opts.name is not a function`.
 *
 * Part 1 replicates the faulty expression with the exact commander version
 * used by create-next-app.
 * Part 2 runs the real published create-next-app@canary bundle, forcing the
 * interactive "What is your project named?" prompt to resolve without a
 * value (the non-interactive / unresolvable-stdin case from the report), and
 * shows the shipped CLI crashing with the same TypeError.
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Command } from 'commander'

console.log('--- Part 1: program.opts() has no name() ---')
const program = new Command('create-next-app')
  .argument('[directory]')
  .option('--ts, --typescript', 'TypeScript')
  .parse(['node', 'create-next-app'])

const opts = program.opts()
console.log('typeof program.name  =', typeof program.name)
console.log('typeof opts.name     =', typeof opts.name)
try {
  opts.name()
  console.log('UNEXPECTED: opts.name() did not throw')
  process.exitCode = 1
} catch (err) {
  console.log('Threw as reported:', String(err))
  if (!/opts\.name is not a function/.test(String(err))) process.exitCode = 1
}

console.log('\n--- Part 2: real create-next-app@canary bundle ---')
const dir = mkdtempSync(join(tmpdir(), 'cna-98065-'))
execFileSync('npm', ['pack', 'create-next-app@canary'], {
  cwd: dir,
  stdio: 'pipe',
})
const tgz = readdirSync(dir).find((f) => f.endsWith('.tgz'))
execFileSync('tar', ['xzf', tgz], { cwd: dir })

const bundlePath = join(dir, 'package', 'dist', 'index.js')
const bundle = readFileSync(bundlePath, 'utf8')

// Evidence: the shipped bundle calls `<opts>.name()` inside the usage branch.
const usageIdx = bundle.indexOf('Please specify the project directory')
const snippet = bundle.slice(usageIdx, usageIdx + 260)
console.log('shipped usage branch:', snippet.replace(/\\n/g, ' '))

// Force the project-name prompt to yield no answer, i.e. the reported
// "stdin can't resolve a project name" situation, without touching any other
// line of the shipped CLI.
const needle = 'type:"text",name:"path",message:"What is your project named?"'
if (!bundle.includes(needle)) {
  throw new Error('bundle layout changed; adjust the repro patch')
}
writeFileSync(
  bundlePath,
  bundle.replace(needle, needle.replace('type:"text"', 'type:null'))
)

let out
try {
  out = execFileSync(process.execPath, [bundlePath], {
    cwd: dir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
} catch (err) {
  out = `${err.stdout ?? ''}${err.stderr ?? ''}`
}
console.log(out.trim())
if (!/\.name is not a function/.test(out)) {
  console.log('UNEXPECTED: shipped CLI did not throw the TypeError')
  process.exitCode = 1
} else {
  console.log(
    '\nReproduced: shipped create-next-app prints "Unexpected error" + TypeError instead of the usage message.'
  )
}
