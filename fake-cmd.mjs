#!/usr/bin/env node
// Minimal emulation of how cmd.exe + tar.exe handle a command line on Windows.
//
// On Windows, child_process.execSync(cmdString) runs:
//     cmd.exe /d /s /c "<cmdString>"
// cmd.exe has NO concept of single quotes: it only strips double quotes.
// The remaining command line is handed to tar.exe, which parses argv with
// MSVCRT rules (again, only double quotes). So `'C:\path\next.tar'` arrives in
// argv with the literal apostrophes still attached.
//
// This shim is invoked as `fake-cmd.mjs -c "<cmdString>"` (the POSIX calling
// convention Node uses for the `shell` option) and reproduces that behavior:
// split on whitespace, strip double quotes only, keep single quotes literal.
import { spawnSync } from 'node:child_process'

const idx = process.argv.indexOf('-c')
const command = process.argv[idx + 1]
const argv = command
  .trim()
  .split(/\s+/)
  .map((tok) => tok.replace(/"/g, ''))

const res = spawnSync(argv[0], argv.slice(1), { stdio: 'inherit' })
process.exit(res.status ?? 1)
