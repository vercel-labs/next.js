// Reconstructs the "lambda" Vercel would pack from ONE endpoint's nft trace
// (only the traced files, nothing else) and imports the SSR chunk that
// references the externalized package alias.
import fs from 'node:fs'
import path from 'node:path'
const nft = process.argv[2] ?? '.next/server/app/a/page.js.nft.json'
const out = process.argv[3] ?? '/tmp/packed'
fs.rmSync(out, { recursive: true, force: true })
const files = JSON.parse(fs.readFileSync(nft, 'utf8')).files
const root = process.cwd()
for (const f of files) {
  const src = path.resolve(path.dirname(nft), f)
  const dest = path.join(out, path.relative(root, src))
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  const st = fs.lstatSync(src, { throwIfNoEntry: false })
  if (!st) continue
  if (st.isSymbolicLink()) fs.symlinkSync(fs.readlinkSync(src), dest)
  else if (st.isDirectory()) fs.cpSync(src, dest, { recursive: true })
  else fs.copyFileSync(src, dest)
}
const entry = path.join(out, path.relative(root, path.resolve(nft.replace(/\.nft\.json$/, ''))))
fs.mkdirSync(path.dirname(entry), { recursive: true })
fs.copyFileSync(nft.replace(/\.nft\.json$/, ''), entry)
console.log('packed ->', out)
