#!/usr/bin/env node
// Minimal emulation of `cmd.exe /d /s /c <command>` argument handling.
// cmd.exe treats ONLY the double quote as a quoting character; single quotes are
// ordinary literal characters that are passed through to the child process.
// The child (bsdtar) therefore receives an argv entry that still contains the
// single quotes, exactly like on Windows.
import { spawnSync } from 'node:child_process'

const flagIndex = process.argv.findIndex((a) => a === '/c' || a === '-c')
const command = process.argv.slice(flagIndex + 1).join(' ')

// cmd.exe-style tokenization: split on whitespace, honour only double quotes.
const argv = []
let current = ''
let inDq = false
let started = false
for (const ch of command) {
  if (ch === '"') {
    inDq = !inDq
    started = true
    continue
  }
  if (!inDq && /\s/.test(ch)) {
    if (started) argv.push(current)
    current = ''
    started = false
    continue
  }
  current += ch
  started = true
}
if (started) argv.push(current)

console.error(`[cmd-shim] argv passed to child: ${JSON.stringify(argv)}`)
const res = spawnSync(argv[0], argv.slice(1), { stdio: 'inherit' })
process.exit(res.status ?? 1)
