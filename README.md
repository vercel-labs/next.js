# Reproduction: next#41281 — inconsistent error handling for non-string getStaticPaths params

Reporter's original repo (jodylecompte/min-repro-nextjs-static-paths) is deleted (404), so this is a fresh minimal repro on Next.js canary.

## Run
```
npm install
npm run dev   # port 3041
```

## Observe
- `GET /articles/1` (`pages/articles/[page].jsx`, `params: { page: 1 }`)
  -> clear error: `A required parameter (page) was not provided as a string received number in getStaticPaths for /articles/[page]` (validated in `next/dist/build/static-paths/pages.js`).
- `GET /tags/1/2` (`pages/tags/[...slug].jsx`, `params: { slug: [1, 2] }`)
  -> still the obscure `TypeError: segment.replace is not a function` from `escapePathDelimiters`,
  i.e. the original complaint of the issue: array *elements* are never type-checked.

`npm run build` shows the same difference.
