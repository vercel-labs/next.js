#!/usr/bin/env node
// Per-endpoint .nft.json verifier: for every content-hashed external alias
// symlink an endpoint's trace lists, are the alias target's package files listed
// in the SAME trace? If not, Vercel packs a dangling symlink -> ERR_MODULE_NOT_FOUND.
import fs from 'node:fs'
import path from 'node:path'

const distDir = path.resolve(process.argv[2] ?? '.next')
const aliasDir = path.join(distDir, 'node_modules')
const nfts = []
;(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) walk(p)
    else if (e.name.endsWith('.nft.json')) nfts.push(p)
  }
})(path.join(distDir, 'server'))

const aliases = []
;(function walkAliases(d, prefix = '') {
  if (!fs.existsSync(d)) return
  for (const name of fs.readdirSync(d)) {
    const full = path.join(d, name)
    if (fs.lstatSync(full).isSymbolicLink())
      aliases.push({ alias: prefix + name, target: fs.realpathSync(full) })
    else if (fs.lstatSync(full).isDirectory()) walkAliases(full, `${prefix}${name}/`)
  }
})(aliasDir)

let bad = 0
for (const nf of nfts) {
  const files = JSON.parse(fs.readFileSync(nf, 'utf8')).files
  const abs = files.map((f) => path.resolve(path.dirname(nf), f))
  for (const { alias, target } of aliases) {
    if (!files.some((f) => f.includes(`node_modules/${alias}`))) continue
    const storeFiles = abs.filter((f) => f.startsWith(target + path.sep))
    const status = storeFiles.length === 0 ? 'DANGLING (0 target files)' : `ok (${storeFiles.length} target files)`
    if (storeFiles.length === 0) bad++
    console.log(`${path.relative(distDir, nf)}  alias=${alias}  ${status}`)
  }
}
console.log(bad === 0 ? '\nRESULT: PASS' : `\nRESULT: FAIL - ${bad} endpoint/alias pair(s) trace the alias without its target files`)
process.exit(bad === 0 ? 0 : 1)
