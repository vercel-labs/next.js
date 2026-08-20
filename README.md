# Repro: next#71005 — PPR/Cache Components double-encodes dynamic route params (Vercel only)

Next.js `16.3.1-canary.25` (`cacheComponents: true`, i.e. PPR).

## Run

```bash
npm install
npm run build && npm start
# then deploy the same directory to Vercel
```

## Observed

| URL | `next start` (local) | Deployed on Vercel |
| --- | --- | --- |
| `/static-params/hello%20world%20encoded` (route from `generateStaticParams` returning `{ slug: "hello%20world%20encoded" }`) | `hello%20world%20encoded` | `hello%2520world%2520encoded` (double-encoded, `x-nextjs-prerender: 1`) |
| `/hello%20world` (plain dynamic segment) | `hello%20world` | `hello%20world` (originally reported case, now fixed) |
| `/sp2/50%25%20off` (`generateStaticParams` → `{ slug: "50% off" }`) | HTTP 500 `Error: failed to decode param` | `50%25%20off` |

So the remaining double-encoding is the `generateStaticParams` variant, and it only
shows on Vercel; additionally `next start` 500s on a static param containing a literal `%`.
