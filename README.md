# Reproduction attempt for vercel/next.js#74518

Minimal harness for the pattern reported in
https://github.com/vercel/next.js/issues/74518 ("Page crashes and
`Error: Connection closed.` in log" when navigating with `next/link` to a
dynamic App Router route; hard refresh works).

Stack: Next.js 15.1.3 / React 19, App Router, `app/products/[id]/page.js`
server component that `fetch`es a product and renders a `"use client"`
detail component inside `<Suspense>` — the same shape as the reporter's
app (https://github.com/Abhii5496/store-thing).

## Run

```bash
npm install
npm run build && npm start   # or: npm run dev
```

Open http://localhost:3000/products and click a product link.

## Result

Client-side navigation renders `/products/1` correctly in both `next dev`
and `next build && next start`. No `Error: Connection closed.` is logged
and no client-side crash occurs. The reporter's own repository was also
built and driven with Playwright at both its current `HEAD` and its
Jan 3 2025 commit `d3f8d4a`, with the (now Cloudflare-blocked)
`fakestoreapi.com` replaced by a local mock: navigation worked in both.

The reporter's hosted demo (store-thing.netlify.app) can no longer
demonstrate anything: `fakestoreapi.com` now answers HTTP 403 without CORS
headers, so the listing renders 0 products and `/products/1` renders
"Product not found".
