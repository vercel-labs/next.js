# Repro: Turbopack + experimental.inlineCss emits relative font URLs (next/font/google)

Issue: https://github.com/vercel/next.js/issues/83612

## Run
```
npm install
npm run build   # next build --turbopack
npm start       # next start
curl -s localhost:3000 | grep -o 'src:url([^)]*)'
```

## Observed (next 15.5.1-canary.35 and 15.5.23)
Inlined `<style>` in the HTML document contains `src:url(../media/<hash>.woff2)`.
Relative to the document URL `/`, that resolves to `/media/...` -> 404, so the fallback
system font is used. The file actually exists at `/_next/static/media/...`.
`next dev` is fine (font CSS is served from `/_next/static/chunks/...` so the relative URL resolves).

## Not reproducible on next@canary (16.3.1-canary.26)
Inlined CSS uses absolute `src:url(/_next/static/media/...woff2)`.
