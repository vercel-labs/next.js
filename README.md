# Reproduction: vercel/next.js#63076 — intercepting routes in production

Minimal nextgram-style intercepting route (`app/@modal/(.)photo/[id]`).

```bash
npm install
npm run build && npm run start   # http://localhost:3000
```

Click "Image 1": the black intercepted modal is expected (and observed) instead of a
navigation to the full `/photo/1` page.

Verified with next 16.3.1, 14.2.4 and 14.1.1 (also with `generateStaticParams` on
`/photo/[id]`): interception works in `next start` and on Vercel. The original report
was on Netlify, see opennextjs/opennextjs-netlify#2089.
