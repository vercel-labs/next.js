import fs from 'node:fs'
import path from 'node:path'

const dir = 'web/.next'
const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'build-manifest.json'), 'utf8'))
const files = manifest.pages['/_app']
let leaked = false
for (const f of files) {
  const code = fs.readFileSync(path.join(dir, f), 'utf8')
  const hits = ['BLA_ONLY_USED_BY_TEST_PAGE', 'FOO_USED_BY_APP', 'BAR_UNUSED_EVERYWHERE'].filter((s) =>
    code.includes(s)
  )
  if (hits.length) console.log(`${f}: ${hits.join(', ')}`)
  if (hits.includes('BLA_ONLY_USED_BY_TEST_PAGE')) leaked = true
}
console.log(
  leaked
    ? 'FAIL: `bla` (only imported by /test) is present in the /_app bundle'
    : 'PASS: `bla` was tree shaken out of the /_app bundle'
)
process.exit(leaked ? 1 : 0)
