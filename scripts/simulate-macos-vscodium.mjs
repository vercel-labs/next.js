/**
 * Deterministic, platform-independent reproduction of
 * https://github.com/vercel/next.js/issues/94077
 *
 * The bug lives in Next.js' devtools "open in editor" code
 * (next/dist/next-devtools/server/launch-editor.js). It is macOS-only, so this
 * harness simulates macOS instead of requiring a Mac:
 *
 *  - process.platform is forced to 'darwin'
 *  - child_process.execSync('ps x') returns a canned process list
 *  - a fake /Applications/VSCodium.app bundle is created that mirrors the file
 *    layout of the real VSCodium macOS release
 *    (Contents/MacOS/VSCodium + Contents/Resources/app/bin/codium),
 *    verified against VSCodium-darwin-arm64-1.126.04524.zip
 *  - the fake `codium` CLI records the argv it was launched with
 *
 * Everything else is the real, unmodified Next.js code.
 */
import child_process from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

Object.defineProperty(process, 'platform', { value: 'darwin' })

// The fake bundle lives in a temp dir so this script never touches a real
// /Applications/VSCodium.app installation. The simulated `ps x` output below
// still reports the canonical macOS path.
const BUNDLE = path.join(os.tmpdir(), 'fake-Applications/VSCodium.app')
const REAL_MAC_PATH = '/Applications/VSCodium.app'
const ARGV_LOG = path.join(os.tmpdir(), 'codium-argv.log')

// Real VSCodium 1.126 macOS layout: MacOS/VSCodium and Resources/app/bin/codium.
// Note there is deliberately no MacOS/Electron and no Resources/app/bin/code.
fs.rmSync(BUNDLE, { recursive: true, force: true })
fs.mkdirSync(path.join(BUNDLE, 'Contents/MacOS'), { recursive: true })
fs.mkdirSync(path.join(BUNDLE, 'Contents/Resources/app/bin'), {
  recursive: true,
})
fs.writeFileSync(path.join(BUNDLE, 'Contents/MacOS/VSCodium'), '')
const cli = path.join(BUNDLE, 'Contents/Resources/app/bin/codium')
fs.writeFileSync(
  cli,
  `#!/bin/sh\nprintf '%s\\n' "$*" >> ${JSON.stringify(ARGV_LOG)}\n`
)
fs.chmodSync(cli, 0o755)

const PS_RUNNING_VSCODIUM = `  PID   TT  STAT      TIME COMMAND
  501   ??  S      0:01.23 /sbin/launchd
 4711   ??  S      3:21.11 ${REAL_MAC_PATH}/Contents/MacOS/VSCodium
 4712   ??  S      0:11.02 ${REAL_MAC_PATH}/Contents/Frameworks/VSCodium Helper (GPU).app/Contents/MacOS/VSCodium Helper (GPU)
`

const realExecSync = child_process.execSync
child_process.execSync = (cmd, ...rest) => {
  if (typeof cmd === 'string' && cmd.startsWith('ps x')) {
    return Buffer.from(PS_RUNNING_VSCODIUM)
  }
  return realExecSync(cmd, ...rest)
}

const { launchEditor } = require('next/dist/next-devtools/server/launch-editor')

const target = path.resolve('app/page.tsx')
const LINE = 3
const COLUMN = 3

function section(title) {
  console.log(`\n=== ${title} ===`)
}

// ---------------------------------------------------------------------------
section('1. guessEditor() with VSCodium running (what a real Mac reports)')
console.log(`ps x contains: ${REAL_MAC_PATH}/Contents/MacOS/VSCodium`)
delete process.env.REACT_EDITOR
delete process.env.VISUAL
delete process.env.EDITOR
launchEditor(target, LINE, COLUMN)

// ---------------------------------------------------------------------------
section('2. Next.js COMMON_EDITORS_MACOS VSCodium mapping vs. real bundle')
const src = fs.readFileSync(
  require.resolve('next/dist/next-devtools/server/launch-editor'),
  'utf8'
)
const mapping = src
  .split('\n')
  .filter((l) => /VSCodium\.app/.test(l))
  .map((l) => l.trim())
console.log('mapping in installed next:', mapping)
console.log(
  'bundle has Contents/MacOS/Electron  ->',
  fs.existsSync(path.join(BUNDLE, 'Contents/MacOS/Electron'))
)
console.log(
  'bundle has Contents/MacOS/VSCodium  ->',
  fs.existsSync(path.join(BUNDLE, 'Contents/MacOS/VSCodium'))
)
console.log(
  'bundle has Resources/app/bin/code   ->',
  fs.existsSync(path.join(BUNDLE, 'Contents/Resources/app/bin/code'))
)
console.log(
  'bundle has Resources/app/bin/codium ->',
  fs.existsSync(path.join(BUNDLE, 'Contents/Resources/app/bin/codium'))
)

// ---------------------------------------------------------------------------
section('3. getArgumentsForLineNumber() for the real VSCodium CLI (codium)')
fs.rmSync(ARGV_LOG, { force: true })
process.env.REACT_EDITOR = cli
launchEditor(target, LINE, COLUMN)
await new Promise((r) => setTimeout(r, 800))
const argv = fs.existsSync(ARGV_LOG)
  ? fs.readFileSync(ARGV_LOG, 'utf8').trim()
  : '<codium never launched>'
console.log(`codium received argv: ${argv}`)
console.log(
  argv.includes('-g')
    ? 'OK: line/column forwarded'
    : `BUG: no "-g <file>:${LINE}:${COLUMN}", editor opens at line 1`
)
