import fs from 'node:fs'

// Reads the adapter (Vercel-style) build output captured by adapter.js and
// checks which request paths the emitted dynamic-route matchers accept.
const ctx = JSON.parse(
  fs.readFileSync(process.argv[2] || './adapter-ctx.json', 'utf8')
)
const routes = ctx.routing.dynamicRoutes
const paths = [
  '/api/trpc/auth.getSession',
  '/en/api/trpc/auth.getSession',
  '/es/api/trpc/auth.getSession',
]

console.log('next version:', ctx.nextVersion)
for (const r of routes) {
  console.log('dynamicRoute', r.source, '=>', r.sourceRegex, '->', r.destination)
}
for (const p of paths) {
  const hit = routes.find((r) => new RegExp(r.sourceRegex).test(p))
  console.log(
    `request ${p} => ${hit ? 'MATCH ' + hit.destination : 'NO MATCH (falls through to the localized 404)'}`
  )
}
