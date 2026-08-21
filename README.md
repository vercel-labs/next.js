# Repro: basePath + cacheComponents — clicking a `<Link>` to the current route re-navigates and flashes the PPR shell (Next.js 16.1.6)

Issue: https://github.com/vercel/next.js/issues/90540

## Run

```bash
npm install
npm run build
npm start            # http://localhost:3000/menu
```

1. Open http://localhost:3000/menu
2. Click Pasta, then Salad, then Pizza.
3. Click **Pizza** again while already on `/menu/category/pizza`.

## Automated check

```bash
npm install playwright && npx playwright install chromium
node check-flash.mjs http://localhost:3000 run /menu
```

Prints `FLASH` plus the observed DOM/title timeline when the bug occurs.

## Observed (next@16.1.6)

Clicking the already-active link triggers a navigation: `#content` swaps to the
`Suspense` fallback (`Loading…`) and `document.title` is emptied for ~10-30ms
before the correct Pizza content/metadata return. 5/5 runs.

## Matrix

| config | next 16.1.6 | next@canary (16.3.1-canary.26) |
| --- | --- | --- |
| `basePath` + `cacheComponents` | flash (5/5) | no flash (3/3) |
| `cacheComponents` only (no basePath) | no flash (3/3) | - |
| `basePath` only (no cacheComponents) | no flash (3/3) | - |
