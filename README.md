# Repro: middleware silently ignored when `pageExtensions` is customized (#48083)

Next.js `16.3.1-canary.25`. App Router, `src/middleware.ts` next to `src/app/`.

```
npm install
npm run dev
curl -i http://localhost:3000/        # expect header x-middleware-ran: 1
curl -i http://localhost:3000/secret  # expect 307 redirect to /
```

With `pageExtensions: ['jsx', 'mdx', 'tsx']` in `next.config.js` (as shipped here),
the middleware never runs: `/` has no `x-middleware-ran` header and `/secret`
returns `200` instead of the redirect. No warning is printed, and `next build`
output contains no `Middleware` entry.

Remove the `pageExtensions` line from `next.config.js` (or rename the file to
`middleware.tsx`), restart, and both assertions pass.
