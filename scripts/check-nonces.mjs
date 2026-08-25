// Fetches the given URL and asserts that every parser-inserted <script> tag in
// the HTML carries the nonce from the response's Content-Security-Policy.
const url = process.argv[2] ?? 'http://localhost:3000/'

const res = await fetch(url, { headers: { Accept: 'text/html' } })
const csp = res.headers.get('content-security-policy') ?? ''
const nonce = /'nonce-([^']+)'/.exec(csp)?.[1]
const html = await res.text()

if (!nonce) {
  console.error('No nonce in the Content-Security-Policy response header:', csp)
  process.exit(2)
}

const tags = html.match(/<script[^>]*>/g) ?? []
const bad = tags.filter((tag) => !tag.includes(`nonce="${nonce}"`))

console.log(`URL: ${url}`)
console.log(`CSP nonce: ${nonce}`)
console.log(`<script> tags: ${tags.length}, without the nonce: ${bad.length}`)
for (const tag of bad) console.log('  MISSING NONCE ->', tag)

process.exit(bad.length === 0 ? 0 : 1)
