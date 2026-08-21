# Repro: next/image `unoptimized={false}` cannot override `images.unoptimized: true`

Upstream issue: https://github.com/vercel/next.js/issues/85208

next: 16.3.1-canary.26

## Run

```bash
npm install
npm run dev   # http://localhost:3000
# or: npm run build && npm start
curl -s localhost:3000 | grep -o '<img[^>]*>'
```

## Expected
The first `<Image unoptimized={false} />` should render `src="/_next/image?url=%2Ftest.png&w=...&q=75"`.

## Actual
Both images render `src="/test.png"` (no srcset, optimizer bypassed) in `next dev` and `next build`/`next start`.

Cause: `packages/next/src/shared/lib/get-img-props.ts` does
`if (config.unoptimized) { unoptimized = true }`, which unconditionally wins over the per-image prop.
