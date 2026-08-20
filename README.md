# Repro attempt for vercel/next.js#48711 — "Next export broken in 13.3.1 (app dir)"

The issue has no reproduction link ("N/A"). This is a minimal reconstruction from the
issue text and comments: `output: 'export'` + app dir with i18n-style dynamic segments
(`app/[lang]/...`) and `generateStaticParams` (in a layout and in a nested page).

## Run

```bash
cd app-13.3.1 && npm install && npx next build && find out -name '*.html' | sort
cd ../app-canary && npm install && npx next build && find out -name '*.html' | sort
```

## Result (Node 24, Linux)

Both versions export HTML; the reported symptom (only js/css in `out/`, no html) does not occur.

next@13.3.1 -> out/404.html out/en.html out/en/a.html out/en/b.html
next@16.3.1-canary.25 -> out/404.html out/_not-found.html out/en.html out/en/a.html out/en/b.html out/fi.html out/fi/a.html out/fi/b.html

Other 13.3.1 variants also exported HTML: `[...slug]`, `[[...slug]]`, `generateStaticParams`
in layout only, `trailingSlash: true` + `basePath`, `dynamicParams = false`, `app/not-found.js`.

Note: in 13.3.x `next/dist/export/index.js` copies `.next/static` into `out/_next` before an
early `if (filteredPaths.length === 0) return`, which is the only code path that would leave
`out/` with js/css and no html — but a `/404` entry is always injected, so it was not reachable here.
