# Repro: sitemap with `output: "export"` (vercel/next.js#59136)

Docs example `app/sitemap.js` + `output: "export"`.

```
npm install
npx next dev   # GET /sitemap.xml -> 500
npx next build # Build error
```

Error (next@16.3.1-canary.25, Turbopack and --webpack):

```
Error: export const dynamic = "force-static"/export const revalidate not configured on route "/sitemap.xml" with "output: export".
```

Adding `export const dynamic = 'force-static'` + `export const revalidate = false` to `app/sitemap.js` makes dev and build work.
