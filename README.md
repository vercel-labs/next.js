# Repro: issue #49735 — generateStaticParams + searchParams

Minimal app-router repro on `next@canary` (verified with 16.3.1-canary.25).

`app/news/[category]/page.tsx` exports both `generateStaticParams()` (5 categories)
and reads `searchParams` in the page and in `generateMetadata`.

## Run

```bash
npm install
npm run dev   # open http://localhost:3000, click "Go to FCS Category", then "?page=2"
npm run build # observe route marking
npm run start
```

## Observed on canary (16.3.1-canary.25)

- dev: no error. `/news/fcs?page=2` renders "fcs Page 2", `<title>Page 2</title>`.
- `next build`: route is listed as `ƒ /news/[category]` (Dynamic). None of the 5
  `generateStaticParams` entries are prerendered — `prerender-manifest.json`
  routes = `['/', '/_global-error', '/_not-found']`, no `.html` under
  `.next/server/app/news/`.
- `next start`: `/news/fcs?page=3` renders "Page 3" correctly.

i.e. the originally reported `Dynamic server usage: searchParams.page` error no
longer occurs; instead `generateStaticParams` is silently ignored and the whole
route opts into dynamic rendering.

The reporter's original repo (https://github.com/JamesSingleton/searchparams-issue-next-13)
also no longer errors once `next` resolves to 13.5.11 (build marks the route `●` SSG
while it is actually served dynamically at runtime).
