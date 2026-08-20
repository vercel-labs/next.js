const path = require('path')
const fs = require('fs')
const target = path.resolve(process.argv[2])
const entry = require.resolve(target + '/dist/lib/get-project-dir.js')

const nativeWin = (p) => String(p).replace(/^([a-z]):/, (m, d) => d.toUpperCase() + ':')
const jsWin = (p) => String(p)
fs.realpathSync = Object.assign(jsWin, { native: nativeWin })

// 1. Pretend we are on Windows (read at module load time by next/dist/lib/realpath.js)
Object.defineProperty(process, 'platform', { value: 'win32' })
const mod = require(entry)
const getProjectDir = mod.getProjectDir || mod.default

// 2. Windows path + fs semantics:
//    - path.resolve keeps the drive-letter casing it was given ('c:')
//    - fs.realpathSync.native (GetFinalPathNameByHandle) returns the canonical 'C:'
//    - the JS fs.realpathSync keeps the given casing
const winResolve = path.win32.resolve
path.resolve = winResolve

const out = []
const orig = { ...console }
for (const s of ['log', 'warn', 'error', 'info']) console[s] = (...a) => out.push(a.join(' '))
const res = getProjectDir('c:\\projects\\website')
Object.assign(console, orig)
process.stdout.write(`input:    c:\\projects\\website\nreturned: ${res}\nwarning:  ${out.join(' | ').trim() || '(none)'}\n`)
