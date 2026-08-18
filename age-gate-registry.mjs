// Minimal stand-in for a proxy registry (verdaccio / artifactory / curation firewall)
// enforcing a "minimum release age" gate: versions published less than MIN_AGE_DAYS
// ago are removed from the packument, dist-tags are proxied unchanged.
import http from 'node:http'

const UPSTREAM = 'https://registry.npmjs.org'
const MIN_AGE_DAYS = Number(process.env.MIN_AGE_DAYS ?? 7)
const PORT = Number(process.env.PORT ?? 4873)
const cutoff = Date.now() - MIN_AGE_DAYS * 24 * 60 * 60 * 1000

const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0]
  try {
    const upstream = await fetch(UPSTREAM + url, {
      headers: { accept: req.headers.accept ?? 'application/json' },
    })
    if (!upstream.ok) {
      res.writeHead(upstream.status, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ error: 'upstream ' + upstream.status }))
      return
    }
    // tarball request -> stream through
    if (url.includes('/-/') && url.endsWith('.tgz')) {
      res.writeHead(200, { 'content-type': 'application/octet-stream' })
      res.end(Buffer.from(await upstream.arrayBuffer()))
      return
    }
    const packument = await upstream.json()
    let blocked = 0
    for (const version of Object.keys(packument.versions ?? {})) {
      if (Date.parse(packument.time?.[version] ?? 0) > cutoff) {
        delete packument.versions[version]
        blocked++
      }
    }
    if (blocked) {
      console.log(`[age-gate] ${url}: hid ${blocked} version(s) newer than ${MIN_AGE_DAYS}d`)
    }
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify(packument))
  } catch (err) {
    console.error(`[age-gate] error for ${url}:`, err?.message)
    res.writeHead(502, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ error: String(err?.message) }))
  }
})
server.listen(PORT, () => console.log(`age-gate registry on http://localhost:${PORT} (min age ${MIN_AGE_DAYS}d)`))
