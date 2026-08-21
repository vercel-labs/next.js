# Repro for vercel/next.js#82412 — browser Back shows previous page content while URL is already updated

Reporter's linked repo (SitharthanLearning/nextjs-browser-back-issue) does not run: it has no
`app/layout.tsx`, no lockfile, `react@18.2.0` with `next@15.4.3`, and a stale
`experimental.appDir` config. This is a minimal runnable repro of the reported symptom, modelled on
a Sitecore JSS-style **Pages Router** app (`getServerSideProps` backed by a slow layout service).

## Run

```bash
npm install
npm run build && npm start          # http://localhost:3001
npm run measure                     # playwright: navigate search -> detail -> Back, sample url + <h1>
```

Manual: open `/search`, click a `detail a` link, press the browser Back button.

## Observed (next@15.4.3, production `next start`)

```
{"urlAt":9,"contentAt":3108,"staleMs":3099}
9    | /search | Detail Page a
1059 | /search | Detail Page a
2596 | /search | Detail Page a
3108 | /search | Search Page
```

The address bar shows `/search` within ~10 ms while the *detail* page content stays on screen for
~3.1 s — exactly the `getServerSideProps` delay. Pages Router re-runs `getServerSideProps` on
popstate and does not cache the previous SSR payload, so the old view is retained until the new
props arrive.

## Not a 15.4.3 regression

Same script, same app, other versions:

| next | stale window after Back |
| --- | --- |
| 14.2.33 | 3110 ms |
| 15.3.5 | 3087 ms |
| 15.4.3 | 3099 ms |

An equivalent **App Router** app (dynamic `/search` page with a 3 s server delay, client-side
`fetch` search results, `/detail/[id]`) restores the previous page instantly (`staleMs: 0`) on Back,
because the App Router client cache serves the back/forward entry.
