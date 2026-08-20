# Repro attempt: issue #66796 — `dynamicParams = false` not-found on Vercel

Minimal version of https://github.com/Cuboctaedro/nextjs-notfound (locale layout +
`pages/[slug]` both with `generateStaticParams` + `dynamicParams = false`, a
`[locale]/[...rest]` catch-all calling `notFound()`, and a locale-prefix middleware).

## Run

```bash
npm install
npm run build && npm start   # http://localhost:3000
```

Check `/en` (200), `/en/pages/page-a` (200), `/en/pages/page-x` (expect 404),
`/fr` (expect 404).

## Result (next@16.3.1-canary.25)

| URL | next dev | next start | Vercel deployment |
|---|---|---|---|
| /en/pages/page-x | 404 not-found | 404 not-found | 404 not-found |
| /fr | 404 not-found | 404 not-found | 404 not-found |
| /nothing/page-d | 404 not-found | 404 not-found | 404 not-found |

The reported Vercel-only difference does not reproduce; a deployment of the
reporter's original app pinned to next@14.2.3 also returns 404 with the
not-found page on Vercel today.
