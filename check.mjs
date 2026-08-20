// Requires `next build` then `next start -p 3000` running.
import fs from 'node:fs'

const buildId = fs.readFileSync('.next/BUILD_ID', 'utf8').trim()
const base = process.env.BASE || 'http://localhost:3000'
const urls = [
  [`/_next/data/${buildId}/fr/nice-public-path.json`, 'valid buildId, middleware-rewritten path'],
  [`/_next/data/INVALID/fr/nice-public-path.json`, 'INVALID buildId, middleware-rewritten path (expected 404)'],
  [`/_next/data/${buildId}/fr/internalPath.json`, 'valid buildId, non-rewritten path'],
  [`/_next/data/INVALID/fr/internalPath.json`, 'INVALID buildId, non-rewritten path (expected 404)'],
]
for (const [path, label] of urls) {
  const res = await fetch(base + path, { redirect: 'manual' })
  const body = await res.text()
  console.log(
    `${res.status} ${res.headers.get('content-type')} :: ${label}\n  ${path}\n  body: ${body.slice(0, 90).replace(/\n/g, ' ')}\n`
  )
}
