# Repro: `@next/next/no-html-link-for-pages` ignores `pageExtensions` (vercel/next.js#53473)

Steps:

```bash
npm install
npx next build   # routes are `/` and `/about`
npx eslint .
```

Observed with `@next/eslint-plugin-next` canary (16.3.x):

- `<a href="/about">` -> real page (`pages/about.page.jsx`) but **not** reported (false negative)
- `<a href="/about.page">` -> not a route, but **is** reported (false positive)

Cause: `parseUrlForPages`/`parseUrlForAppDir` in `packages/eslint-plugin-next/src/utils/url.ts`
only strip `.js/.jsx/.ts/.tsx` and never read `pageExtensions` (see the `TODO` comment there).
