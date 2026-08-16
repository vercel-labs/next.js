#!/usr/bin/env node
// Reproduction for https://github.com/vercel/next.js/issues/97445
//
// `@next/codemod upgrade <revision>` shells out to:
//     npm --silent view "next@<revision>" --json --field version
// npm 12 removed the `--field` flag, so npm exits 1 with EUNKNOWNCONFIG and the
// codemod reports a misleading `Invalid revision provided` error.
//
// This script is self-contained: it installs npm@12 and @next/codemod@canary into
// a temp dir, puts npm 12 first on PATH, and runs the upgrade in a minimal app.
// Requires network access. Run with: npm run repro

import { execFileSync, execSync, spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, chmodSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const NPM_VERSION = process.env.NPM_VERSION || '12.0.1'
const CODEMOD = process.env.CODEMOD_VERSION || 'canary'
const REVISION = process.env.REVISION || 'latest'

const root = mkdtempSync(join(tmpdir(), 'next-97445-'))
const run = (cmd, cwd, env) =>
  execSync(cmd, { cwd, stdio: 'inherit', env: { ...process.env, ...env } })

console.log(`\n[1/4] workspace: ${root}`)

const tools = join(root, 'tools')
mkdirSync(tools)
writeFileSync(join(tools, 'package.json'), '{"private":true}')
run(`npm i npm@${NPM_VERSION} @next/codemod@${CODEMOD} --no-audit --no-fund --silent`, tools)

const npm12Cli = join(tools, 'node_modules/npm/bin/npm-cli.js')
const codemodCli = join(tools, 'node_modules/@next/codemod/bin/next-codemod.js')

// PATH shim so the codemod's `execSync('npm ...')` calls hit npm 12.
const shim = join(root, 'shim')
mkdirSync(shim)
if (process.platform === 'win32') {
  writeFileSync(join(shim, 'npm.cmd'), `@echo off\r\nnode "${npm12Cli}" %*\r\n`)
} else {
  const p = join(shim, 'npm')
  writeFileSync(p, `#!/bin/sh\nexec node "${npm12Cli}" "$@"\n`)
  chmodSync(p, 0o755)
}
const env = { PATH: `${shim}${process.platform === 'win32' ? ';' : ':'}${process.env.PATH}` }

console.log('\n[2/4] npm on PATH for the codemod:')
run('npm -v', root, env)

console.log('\n[3/4] direct npm calls (isolating the removed flag)')
for (const args of [
  ['--silent', 'view', 'next@latest', '--json', '--field', 'version'], // fails on npm 12
  ['--silent', 'view', 'next@latest', 'version', '--json'], // positional form works
]) {
  const r = spawnSync(process.execPath, [npm12Cli, ...args], { encoding: 'utf8' })
  console.log(`\n$ npm ${args.join(' ')}\nexit=${r.status}\n${(r.stdout || r.stderr).trim()}`)
}

console.log('\n[4/4] @next/codemod upgrade (expected to fail on npm 12)')
const app = join(root, 'app')
mkdirSync(app)
writeFileSync(
  join(app, 'package.json'),
  JSON.stringify(
    {
      name: 'repro-app',
      private: true,
      version: '0.1.0',
      dependencies: { next: '16.3.1', react: '19.2.0', 'react-dom': '19.2.0' },
    },
    null,
    2
  )
)
run('npm install --no-audit --no-fund --silent', app)

const r = spawnSync(process.execPath, [codemodCli, 'upgrade', REVISION, '--verbose'], {
  cwd: app,
  encoding: 'utf8',
  env: { ...process.env, ...env },
})
const out = `${r.stdout}${r.stderr}`
console.log(out)
console.log(`codemod exit=${r.status}`)

const reproduced =
  r.status !== 0 && /EUNKNOWNCONFIG/.test(out) && /Invalid revision provided/.test(out)
console.log(
  reproduced
    ? '\nREPRODUCED: npm 12 rejects `--field` (EUNKNOWNCONFIG) and the codemod masks it as "Invalid revision provided".'
    : '\nNOT REPRODUCED (likely fixed upstream, or npm/codemod version pinning changed).'
)
process.exit(reproduced ? 0 : 1)
