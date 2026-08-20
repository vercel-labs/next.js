// Usage: next build && next start -p 3000, then: node check.mjs http://localhost:3000
const base = process.argv[2] ?? 'http://localhost:3000'

const html = await (await fetch(base + '/')).text()
console.log('<link rel="manifest"> in HTML:', /<link rel="manifest"[^>]*>/.exec(html)?.[0])

const res = await fetch(base + '/manifest.webmanifest')
console.log('status:', res.status)
console.log('cache-control:', res.headers.get('cache-control'))
console.log('etag:', res.headers.get('etag'))
console.log('last-modified:', res.headers.get('last-modified'))

// A revalidation request cannot ever produce a 304 because no validator is sent
const again = await fetch(base + '/manifest.webmanifest', {
  headers: { 'if-none-match': res.headers.get('etag') ?? '"x"' },
})
console.log('conditional request status (expected 304 if revalidation worked):', again.status)
