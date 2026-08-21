// Usage: node verify.mjs [baseOrigin]  (default http://localhost:3000)
const origin = process.argv[2] || 'http://localhost:3000'
const html = await (await fetch(`${origin}/myapp`)).text()

const grab = (re) => [...html.matchAll(re)].map((m) => m[0])
console.log('--- emitted asset URLs ---')
for (const u of new Set(grab(/(href|src|srcSet|imageSrcSet)="[^"]*"/g))) console.log(u)

const checks = [
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/myapp/favicon.ico',
  '/myapp/_next/image?url=%2Flogo.png&w=64&q=75',
]
console.log('--- status codes ---')
for (const p of checks) {
  const r = await fetch(origin + p)
  console.log(r.status, p)
}
