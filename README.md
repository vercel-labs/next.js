# Repro: metadata field explicitly set to `undefined` does not fall back to parent

Issue: https://github.com/vercel/next.js/issues/71668

## Run

```
npm install
npm run dev   # then curl / /about /dashboard
```

## Expected
`/dashboard` exports `metadata = { title: 'Dashboard', description: undefined }`,
so it should inherit `description: 'ROOT DESCRIPTION'` from the root layout,
same as `/about` (which omits the key entirely).

## Actual
`/` and `/about` render `<meta name="description" content="ROOT DESCRIPTION"/>`.
`/dashboard` renders no description meta tag at all.

Reproduced with next@16.3.1-canary.25 in both `next dev` and `next build` + `next start`.
