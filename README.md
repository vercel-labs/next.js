# Repro attempt for vercel/next.js#52579 — nested `apple-icon.png`

Next.js: `next@canary` (verified with 16.3.1-canary.25)

```
npm install
npm run dev        # then: curl -s localhost:3000/icons | grep apple-touch-icon
npm run build && npm start
```

Result: nested `app/icons/apple-icon.png` IS emitted as
`<link rel="apple-touch-icon" href="/icons/apple-icon.png?...">` on `/icons`
and `/icons/deep` in both dev and production. It is intentionally NOT emitted on
`/` — file-convention icons apply to their own route segment and below, and a
segment's icon set replaces the inherited one.
