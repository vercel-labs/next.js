# Repro: non-ASCII slugs from `generateStaticParams()` are passed percent-encoded to `params`

Minimal reproduction for https://github.com/vercel/next.js/issues/92192 (Next.js 16.2.1-canary.16).

## Run

```bash
npm install
npm run dev
# cold cache, first request to the non-ASCII route:
curl -i --path-as-is 'http://localhost:3000/note/cli-%ED%99%98%EA%B2%BD%EC%97%90%EC%84%9C-%EC%97%AC%EB%9F%AC-%EB%AA%85%EB%A0%B9%EC%96%B4%EB%A5%BC-%EB%8F%99%EC%8B%9C%EC%97%90-%EC%8B%A4%ED%96%89%ED%95%98%EA%B8%B0'
```

## Observed

1. `next dev` with a cold `.next` cache returns HTTP 500 and logs:
   `Error: Page "/[type]/[slug]/page" is missing param "/[type]/[slug]" in "generateStaticParams()", which is required with "output: export" config.`
   (the ASCII route `/note/ascii-slug` returns 200)
2. Once compiled (or in `next build`), the page renders but `params.slug` is the
   percent-encoded string `cli-%ED%99%98...`, not the raw slug returned by
   `generateStaticParams()`. Check `out/note/cli-환경에서-여러-명령어를-동시에-실행하기.html`.
   That is what breaks the reporter's `await import(\`@/contents/${type}/${slug}/index.mdx\`)`
   with `MODULE_NOT_FOUND`.

The percent-encoded `params` value also happens without `output: "export"`, and on
next@16.1.5, so it is not export-specific nor a recent regression.
