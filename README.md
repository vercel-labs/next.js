# Repro: cacheComponents `instant = false` + `connection()` route still enters ISR

Next.js 16.3.0, `cacheComponents: true`.

- `app/[locale]/layout.tsx` has a `use cache` read with `cacheLife({ revalidate: 60, expire: 600, stale: 300 })`.
- `app/[locale]/products/[slug]/page.tsx` is a fallback dynamic route with `export const instant = false` and `await connection()`.

## Run

```bash
npm install
npm run build
cat .next/prerender-manifest.json   # -> fallbackRevalidate: 60, fallbackExpire: 600
npm start
curl -sD- -o/dev/null http://localhost:3000/en/products/abc   # -> x-nextjs-prerender: 1, x-nextjs-stale-time: 300
```

The 0-byte empty shell is classified `PARTIALLY_STATIC` (`routeType: shell`, `response: empty`,
`compute: blocking`, `htmlSize: 0`) and inherits the parent layout's `use cache` lifetimes as
`fallbackRevalidate`/`fallbackExpire`, so on hosting that honors the prerender manifest the first
runtime render is stored and re-served, despite `Cache-Control: private, no-store`.
