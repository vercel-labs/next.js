// Simulates an edge WAF / bot-management layer sitting IN FRONT of Next.js
// (like Cloudflare/Akamai bot protection). Listens on :3001, forwards to :3000.
// It "challenges" requests it considers suspicious with 403 + text/html.
import http from 'node:http'

const UPSTREAM = 'http://127.0.0.1:3000'
const CHALLENGE = `<!doctype html><html><body><h1>403 Forbidden</h1><p>Bot challenge page (simulated WAF). Solve the challenge to continue.</p></body></html>`

http
  .createServer(async (req, res) => {
    const isRsc = 'rsc' in req.headers
    const isAction = 'next-action' in req.headers
    const path = req.url.split('?')[0]
    console.log(
      `[WAF] ${req.method} ${req.url} rsc=${isRsc} next-action=${isAction} accept=${req.headers.accept}`
    )
    if ((path === '/protected' && isRsc) || isAction) {
      console.log(`[WAF] -> CHALLENGED 403 text/html`)
      res.writeHead(403, { 'content-type': 'text/html; charset=utf-8' })
      res.end(CHALLENGE)
      return
    }
    const upstream = await fetch(UPSTREAM + req.url, {
      method: req.method,
      headers: { ...req.headers, host: '127.0.0.1:3000', 'accept-encoding': 'identity' },
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
      duplex: 'half',
      redirect: 'manual',
    })
    const outHeaders = Object.fromEntries(upstream.headers)
    delete outHeaders['content-encoding']
    delete outHeaders['content-length']
    res.writeHead(upstream.status, outHeaders)
    if (upstream.body) {
      const reader = upstream.body.getReader()
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(value)
      }
    }
    res.end()
  })
  .listen(3001, () => console.log('WAF proxy on http://localhost:3001 -> :3000'))
