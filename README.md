# Repro: vercel/next.js#61213 — empty array from `generateStaticParams` fails `output: 'export'`

`app/foo/[slug]/page.tsx` exports `generateStaticParams()` returning `[]`.

```bash
npm install
npm run build:ssr      # passes (output: undefined)
npm run build:export   # fails (output: 'export')
```

Observed on Next.js 16.3.1:

```
Error: Page "/foo/[slug]" returned an empty array from "generateStaticParams()".
With "output: export", at least one route must be generated.
> Build error occurred
Error: Failed to collect page data for /foo/[slug]
```
