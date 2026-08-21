# Repro for vercel/next.js#78991 — "Custom error pages hang in pages router"

Minimal, repaired version of the reporter's repro (https://github.com/scinscinscin/reprocool,
whose `next build` fails on an unrelated ESLint error for `@ts-nocheck`).

`pages/index.jsx` throws a plain object (`throw { statusCode: 301 }`) from `getServerSideProps`.
`pages/_error.jsx` is the reporter's custom error page.

## Run

```bash
npm install
npm run build && npm start   # or: npm run dev
node verify.mjs http://localhost:3000
```

## Observed (Next 15.3.2 and 16.3.1-canary.26, Linux, Node 24)

No hang. `GET /` answers immediately with HTTP 500 and the custom `_error` page
("An error 500 occurred on server"), in `next dev` (webpack and turbopack),
`next start`, and on client-side navigation from `/start`.
