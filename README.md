# Repro for vercel/next.js#58171 — `output: export` + `generateStaticParams()`

Issue: https://github.com/vercel/next.js/issues/58171

Reporter's repo (https://github.com/meds/nextjs-broken-export, `next@14.0.1`) fails
`next build` with:

```
Error: Page "/test/[id]" is missing "generateStaticParams()" so it cannot be used with "output: export" config.
```

even though the page *does* export `generateStaticParams()`. Root cause: it returns
`['test']` (strings) instead of `[{ id: 'test' }]`, so no params are produced and Next.js
reported the generic "missing" message. Same generic message was reported when
`generateStaticParams()` returns `[]`.

## Cases

| script | `generateStaticParams()` |
| --- | --- |
| `npm run case-a` | returns `['test']` (reporter's original code) |
| `npm run case-b` | returns `[]` |
| `npm run case-c` | not exported at all |

## Run

```bash
npm install
npm run all
```

## Result on `next@canary` (16.3.1-canary.25)

Each case now fails with an accurate, distinct message — the misleading "missing" wording
is no longer used for A or B:

```
case-a: Error: Invalid value at index 0 returned from generateStaticParams for "/test/[id]".
        Expected an object, but received type string.
case-b: Error: Page "/test/[id]" returned an empty array from "generateStaticParams()".
        With "output: export", at least one route must be generated.
case-c: Error: Page "/test/[id]" is missing "generateStaticParams()" so it cannot be used
        with "output: export" config.
```

All three link to https://nextjs.org/docs/messages/generate-static-params.

Reproduced original wording only on `next@14.0.1` (case A).
