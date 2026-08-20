# Reproduction: vercel/next.js#64882

A `'use client'` root layout re-renders on every `<Link>` client-side navigation in a
production build / static export (`output: 'export'`), but never re-renders in `next dev`.

## Run

```bash
npm install
npx playwright install chromium

# production static export (bug)
npx next build
npx http-server -p 4011 -c-1 out &
node verify.mjs http://localhost:4011

# next dev (control)
npx next dev -p 4010 &
node verify.mjs http://localhost:4010
```

`verify.mjs` loads `/a/`, clicks the nav `<Link>`s and counts the
`RootLayout render #N` console logs emitted per navigation.

## Observed

| Next version | mode | root layout re-renders per Link nav |
| --- | --- | --- |
| 14.2.2 | static export (`output: 'export'`, http-server) | 1 |
| 14.2.2 | `next dev` | 0 |
| 16.3.1-canary.25 | static export | 0 |
