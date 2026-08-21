// Reproduction for https://github.com/vercel/next.js/issues/87833
//
// scripts/unpack-next.ts (canary) builds its tar command as a *shell string*
// with POSIX single quotes:
//
//   exec(`Unpack ${key}`, `tar -xf '${TARBALLS}/${key}.tar' -C '${path}'`)
//
// scripts/pack-util.ts `exec()` passes that string to child_process.execSync,
// which uses /bin/sh on POSIX (quotes are stripped) but `cmd.exe /d /s /c` on
// Windows (single quotes are NOT stripped). Windows tar.exe therefore receives
// a filename that literally starts and ends with an apostrophe and fails with
// "tar: Error opening archive: Failed to open '<path>'".
//
// This script reproduces all three code paths on any OS:
//   1. Windows semantics (cmd.exe shim)  -> FAILS
//   2. POSIX semantics (/bin/sh)         -> passes (why CI/macOS never sees it)
//   3. argv array form (the fix)         -> passes
import { execSync, execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const TARBALLS = path.join(HERE, 'tarballs')
const DEST = path.join(HERE, 'node_modules', 'next')

// --- fixture: stand-in for `pnpm pack-next --tar` output -------------------
fs.rmSync(TARBALLS, { recursive: true, force: true })
fs.rmSync(path.join(HERE, 'node_modules'), { recursive: true, force: true })
fs.mkdirSync(TARBALLS, { recursive: true })
fs.mkdirSync(DEST, { recursive: true })
fs.mkdirSync(path.join(HERE, 'src'), { recursive: true })
fs.writeFileSync(path.join(HERE, 'src', 'package.json'), '{"name":"next"}\n')
execFileSync('tar', ['-cf', path.join(TARBALLS, 'next.tar'), '-C', path.join(HERE, 'src'), '.'])

// --- the exact command string unpack-next.ts produces ---------------------
const COMMAND = `tar -xf '${TARBALLS}/next.tar' -C '${DEST}'`
console.log(`unpack-next.ts command:\n> ${COMMAND}\n`)

function attempt(label, run) {
  try {
    run()
    console.log(`[PASS] ${label}`)
    return true
  } catch (e) {
    console.log(`[FAIL] ${label}: ${e.message.split('\n')[0]}`)
    return false
  }
}

const win = attempt('1. Windows semantics (cmd.exe/tar.exe: single quotes are literal)', () =>
  execSync(COMMAND, { stdio: 'inherit', shell: path.join(HERE, 'fake-cmd.mjs') })
)
const posix = attempt('2. POSIX semantics (/bin/sh strips the single quotes)', () =>
  execSync(COMMAND, { stdio: 'inherit' })
)
const fixed = attempt('3. Proposed fix: argv array, no manual quoting', () =>
  execFileSync('tar', ['-xf', path.join(TARBALLS, 'next.tar'), '-C', DEST], { stdio: 'inherit' })
)

console.log(
  `\nBug reproduced: ${!win && posix && fixed ? 'YES' : 'NO'} ` +
    `(windows=${win ? 'pass' : 'fail'}, posix=${posix ? 'pass' : 'fail'}, fixed=${fixed ? 'pass' : 'fail'})`
)
process.exit(!win && posix && fixed ? 0 : 1)
