# Repro: WAF/bot-challenge (403 text/html) on RSC requests — per-path behavior

Backs docs issue vercel/next.js#96879. Next.js 16.3.0.

`waf-proxy.mjs` is a tiny reverse proxy on :3001 in front of `next start` on :3000 that
simulates an edge WAF / bot-management layer: it answers `403` + `content-type: text/html`
for (a) any request to `/protected` carrying the `rsc` header and (b) any request carrying
the `next-action` header.

## Run

```bash
npm install
npm run build
npm start                 # Next.js on :3000
node waf-proxy.mjs        # simulated WAF on :3001
npm i -D playwright && npx playwright install chromium
node verify.mjs           # drives :3001 and prints per-path behavior
```

## Observed (verify.mjs output, Next 16.3.0)

- Prefetch of `/protected` (`RSC: 1`) -> 403 text/html: silent, no navigation, stays on `/`.
- Server Action POST (no `rsc` header; `next-action` + `Accept: text/x-component`) -> 403 text/html:
  throws `An unexpected response was received from the server.`
- `<Link>` navigation to `/protected` (`RSC: 1`) -> 403 text/html: falls back to a full
  document (MPA) navigation, `/protected` loads as HTML (same-document state lost).

Note: a Next.js `proxy.ts` (middleware) does not observe the `rsc` request header, so the
`RSC: 1` exemption discussed in the issue cannot even be implemented there.
