# Reproduction: WAF/bot-challenge (403 text/html) on RSC, prefetch, and Server Action requests

Companion reproduction for https://github.com/vercel/next.js/issues/96880 (docs issue).
Next.js 16.3.0, App Router, production `next start` behind a simulated edge WAF.

`waf-proxy.mjs` is a tiny proxy (port 3001 -> Next on 3000) that answers any request
carrying `RSC: 1` or `next-action` with `403` + `content-type: text/html`, i.e. a bot
challenge, and forwards everything else.

## Run

```bash
npm install
npm run build
npm start &                 # Next.js on :3000
node waf-proxy.mjs &        # simulated WAF on :3001
node test.mjs               # Playwright: prefetch, Server Action, navigation
```

Open http://localhost:3001 manually, or read `node test.mjs` output.

## Observed with Next.js 16.3.0

| Path | Sends `RSC: 1`? | Behaviour on 403 text/html challenge |
|---|---|---|
| Prefetch (hover `<Link>`) | yes | silent: request 403s, page stays on `/`, no navigation |
| Server Action | **no** (`next-action` + `accept: text/x-component`) | **throws** `An unexpected response was received from the server.` |
| Navigation (click `<Link>`) | yes | MPA fallback: full document `GET /other`, page renders |

So client-side navigation is not "broken" — it degrades to a browser navigation — and an
`RSC: 1` WAF exemption would not cover Server Actions, which never send that header.
