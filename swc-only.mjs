// Bundler-free proof: calls next-swc's transform directly. Hangs (never resolves).
import swc from 'next/dist/build/swc/index.js'
import fs from 'fs'

await swc.loadBindings()
const src = fs.readFileSync(process.argv[2] ?? 'pages/index.tsx', 'utf8')
const t0 = Date.now()
const out = await swc.transform(src, {
  filename: 'pages/index.tsx',
  jsc: { parser: { syntax: 'typescript', tsx: true } },
  styledJsx: true,
})
console.log('transform finished in', Date.now() - t0, 'ms, len', out.code.length)
