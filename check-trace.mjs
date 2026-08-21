import fs from 'fs'
const t = JSON.parse(
  fs.readFileSync('.next/server/app/page.js.nft.json', 'utf-8')
)
const bad = t.files.filter(
  (f) => /(^|\/)(Makefile|README\.md|components\.json|big-unrelated-file\.txt)$/.test(f)
)
console.log(`total traced files: ${t.files.length}`)
console.log('project-root files traced:', bad)
console.log(bad.length ? 'REPRODUCED: repo root is in the trace' : 'ok: repo root not traced')
