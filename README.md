# Repro harness for vercel/next.js#91633 — `experimental.sri` integrity mismatch behind a CDN

Minimal App Router app with `experimental: { sri: { algorithm: 'sha256' } }` on **next@16.2.3** (Turbopack),
plus scripts to verify every `integrity=` attribute against the bytes actually served.

## Result of running this

1. `npm install && npx next build && npx next start`
2. `python3 scripts/verify-integrity.py http://localhost:3000 / /about`
   → `checked N bad 0` — every integrity attribute matches the served file.
3. `node scripts/browser-check.mjs http://localhost:3000 /` → `NO ERRORS`.
4. Deployed to Vercel (fresh deployment), the same checks pass, and the reporter's own app
   (`styled-components/styled-components-website`, with `experimental.sri` re-enabled) also passes.

So the SRI digests written by Turbopack match the emitted chunks; nothing in Next miscomputes them.

## What does produce the reported error

next@16.2.x uses base40 hash encoding, so chunk/CSS filenames can contain `~` and `..`
(this app emits e.g. `03~yq9q893hmn.js`, `16kro75~4yhq2.js`, `0.-x5dta0t6op.css`).
Any intermediary (nginx `block_common_exploits.conf`, enterprise WAF, edge rule) that blocks or
rewrites such paths returns a different 200 body, and the browser then reports exactly the
error from the issue.

```bash
npx next start                          # port 3000
node scripts/waf-proxy.mjs              # port 3001, blocks paths containing ~ or ..
node scripts/browser-check.mjs http://localhost:3001 /
```

Output:

```
/ [console] Failed to find a valid digest in the 'integrity' attribute for resource
'http://localhost:3001/_next/static/chunks/16kro75~4yhq2.js' with computed SHA-256 integrity
'9Fb2GFm+FP4B0UMmZA5Maw6oSrAJ87OV7Bm86Qhz8WE='. The resource has been blocked.
```

Building the same app with `next@16.3.1` emits no filename containing `~` or `.`
(base38 charset, vercel/next.js#91832), and the proxy run then produces `NO ERRORS`.
