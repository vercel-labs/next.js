# Repro: vercel/next.js#68956

`output: 'export'` build fails when `generateStaticParams()` returns an empty array.

```
npm install
npm run build
```

Observed on Next.js 16.3.1:

```
Error: Page "/posts/[slug]" returned an empty array from "generateStaticParams()".
With "output: export", at least one route must be generated.
> Build error occurred
Error: Failed to collect page data for /posts/[slug]
```

Expected: build succeeds and generates no pages for that dynamic route.
