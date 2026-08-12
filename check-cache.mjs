import { readdir, readFile } from 'node:fs/promises'
const dir = '.next/cache/fetch-cache'
let total = 0, outerBroken = 0, innerGarbage = 0
for (const f of await readdir(dir)) {
  if (f === 'tags-manifest.json') continue
  total++
  const raw = await readFile(`${dir}/${f}`, 'utf8')
  let parsed
  try { parsed = JSON.parse(raw) } catch (e) {
    outerBroken++
    console.log(`TORN(outer) ${f} bytes=${raw.length} ${e.message}`)
    console.log('  tail:', JSON.stringify(raw.slice(-90)))
    continue
  }
  if (parsed?.data?.body) {
    try { JSON.parse(Buffer.from(parsed.data.body, 'base64').toString('utf8')) }
    catch (e) { innerGarbage++; console.log(`TORN(body) ${f} ${e.message}`) }
  }
}
console.log({ total, outerBroken, innerGarbage })
