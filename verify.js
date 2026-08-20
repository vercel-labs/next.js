// Prints the response headers for both rewrite targets.
const base = process.env.BASE_URL || 'http://localhost:3000'

async function show(path) {
  const res = await fetch(base + path, { redirect: 'manual' })
  console.log(`\n--- GET ${path} ---`)
  for (const [k, v] of res.headers) console.log(`${k}: ${v}`)
  const fails = []
  if (res.headers.get('x-modify-me') !== 'modified-by-middleware')
    fails.push(`x-modify-me was NOT overridden (got "${res.headers.get('x-modify-me')}")`)
  if (res.headers.has('x-remove-me')) fails.push('x-remove-me was NOT removed')
  if (res.headers.get('cache-control') !== 'no-store')
    fails.push(`cache-control was NOT overridden (got "${res.headers.get('cache-control')}")`)
  console.log(fails.length ? 'BUG: ' + fails.join(' | ') : 'OK: all middleware header mutations applied')
}

await show('/proxy')
await show('/external')
