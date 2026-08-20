# Reproduction for vercel/next.js#67444 — App Router RSC payload breaks behind a rewriting proxy

Self-contained repro: a minimal App Router app (Next 16.3.1) plus `proxy.mjs`, a ~60 line
stand-in for URL-rewriting proxies such as EZproxy or `translate.goog`. Each proxy mode applies
one behavior those proxies are known to have, and `check.mjs` (Playwright) reports what a real
browser sees.

## Run

```bash
npm install
npx playwright install chromium
npm run build
bash runall.sh          # starts `next start` on :3000 and runs every proxy mode on :3999
```

Single mode (two terminals):

```bash
npm run build && npm start          # :3000
npm run proxy:truncate              # :3999  (or proxy:decode / proxy:strip / proxy:passthru)
npm run check                       # drives http://localhost:3999 with Playwright
```

## Results (Next 16.3.1, production build)

| mode | proxy behavior | observed |
| --- | --- | --- |
| `passthru` | plain proxy | works, client-side nav OK (control) |
| `decode` | percent-decodes `Next-Router-State-Tree` | every RSC request answered `307` to a different `?_rsc=` hash → endless prefetch/redirect storm |
| `strip` | drops `RSC` / `Next-Router-State-Tree` / `Next-Url` request headers | RSC fetch returns a full HTML document, router falls back to a hard document reload on every navigation |
| `truncate` | rewrites the HTML body and drops the tail of the stream | `Uncaught Error: Connection closed.` (minified React #412) and the page never hydrates |

Server-side, mutating the router-state header also produces
`Error: The router state header was sent but could not be parsed.` in the `next start` log
(HTTP 500 today, HTTP 400 in the versions in the original report):

```bash
curl -i -L -H 'RSC: 1' \
  -H 'Next-Router-State-Tree: ["",{"children":["contact",{"children":["__PAGE__",{}]}]},null,null,true]' \
  http://localhost:3000/contact
```

`pages/`-style requests are unaffected because they carry none of these headers, which matches the
original report and the EZproxy workaround discussed in the issue (no `HJ`/`DJ` JavaScript rewriting,
plus `HttpHeader` allow-list entries for the RSC headers).
