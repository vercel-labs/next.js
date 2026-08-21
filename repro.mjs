// Reproduction for https://github.com/vercel/next.js/issues/82233
// `pnpm unpack-next <project>` fails on Windows.
//
// scripts/unpack-next.ts builds a SHELL STRING and single-quotes the paths:
//   exec(`Unpack ${key}`, `tar -xf '${TARBALLS}/${key}.tar' -C '${path}'`)
// scripts/pack-util.ts runs it with child_process.execSync(), whose shell on
// Windows is cmd.exe, where single quotes are NOT quoting characters. tar then
// receives the quotes as part of the file name and fails.
//
// This script runs the exact same command string through:
//   A) a POSIX shell (what CI/macOS/Linux maintainers use)  -> works
//   B) a cmd.exe emulation (Windows behaviour)              -> fails
// and additionally shows the two other Windows-only problems reported.
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'unpack-next-'))
const TARBALLS = path.join(root, 'next.js', 'tarballs')
const PROJECT_DIR = path.join(root, 'project')

// Fake output of `pnpm pack-next --tar`
fs.mkdirSync(TARBALLS, { recursive: true })
fs.mkdirSync(path.join(root, 'src', 'next'), { recursive: true })
fs.writeFileSync(path.join(root, 'src', 'next', 'package.json'), '{"name":"next"}')
execSync(`tar -cf ${TARBALLS}/next.tar -C ${path.join(root, 'src', 'next')} .`)

// Fake user project with next installed
fs.mkdirSync(path.join(PROJECT_DIR, 'node_modules', 'next'), { recursive: true })
// What a Windows (and any) project actually has for swc:
fs.mkdirSync(path.join(PROJECT_DIR, 'node_modules', '@next', 'swc-win32-x64-msvc'), { recursive: true })

// Exact command string produced by scripts/unpack-next.ts
const target = path.join(PROJECT_DIR, 'node_modules', 'next')
const command = `tar -xf '${TARBALLS}/next.tar' -C '${target}'`

function run(label, shell) {
  console.log(`\n=== ${label} ===`)
  console.log(`> ${command}`)
  try {
    execSync(command, { stdio: 'inherit', shell })
    console.log(`RESULT: success`)
    return true
  } catch (e) {
    console.log(`RESULT: FAILED (exit ${e.status})`)
    return false
  }
}

// Windows ships bsdtar (libarchive) as `tar`; use it here so the error message
// matches what Windows users see.
if (fs.existsSync('/usr/bin/bsdtar')) {
  const bin = path.join(root, 'bin')
  fs.mkdirSync(bin)
  fs.symlinkSync('/usr/bin/bsdtar', path.join(bin, 'tar'))
  process.env.PATH = `${bin}${path.delimiter}${process.env.PATH}`
}

const posix = run('A) execSync via POSIX shell (/bin/sh)', '/bin/sh')
const cmd = run(
  'B) execSync via cmd.exe semantics (Windows) — single quotes are literal',
  path.resolve('cmd-shim.mjs')
)

console.log('\n=== C) swc package lookup in scripts/unpack-next.ts ===')
const swcLookup = path.join(PROJECT_DIR, 'node_modules', '@next', 'swc')
console.log(`unpack-next looks for: node_modules/@next/swc -> exists: ${fs.existsSync(swcLookup)}`)
console.log(
  `project actually contains: ${fs
    .readdirSync(path.join(PROJECT_DIR, 'node_modules', '@next'))
    .map((d) => '@next/' + d)
    .join(', ')} (so next-swc.tar is silently skipped)`
)

console.log('\n=== D) typo in scripts/unpack-next.ts ===')
console.log("packages key 'next-bundle-analyzer' resolves node_modules/@next/bundle-anlyzer (missing 'a') -> always null")

console.log('\n=== SUMMARY ===')
console.log(`POSIX shell: ${posix ? 'PASS' : 'FAIL'}   cmd.exe (Windows): ${cmd ? 'PASS' : 'FAIL'}`)
process.exit(cmd ? 1 : 0)
