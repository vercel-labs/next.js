# Repro: relative `alternates.canonical` with query params gains a trailing slash (#68272)

Next.js 16.3.1 (also affects 14/15). `trailingSlash` is NOT enabled.

## Run
```
npm install
npm run dev
curl -s localhost:3000/mypage | grep -o '<link rel="canonical"[^>]*>'
```

## Expected vs actual (`/mypage`, canonical `./?someparams=true`)
- expected: `https://someurl.fr/mypage?someparams=true`
- actual:   `https://someurl.fr/mypage/?someparams=true`

Other routes for contrast:
- `/abs` uses `canonical: '/abs?someparams=true'` -> correct `https://someurl.fr/abs?someparams=true`
- `/rel` uses `canonical: '.'` -> `https://someurl.fr` (path dropped)

## Cause
`packages/next/src/lib/metadata/resolvers/resolve-url.ts` -> `resolveRelativeUrl()` calls
`path.posix.resolve(pathname, url)`, so the query string is treated as a path segment:
`path.posix.resolve('/mypage', './?someparams=true') === '/mypage/?someparams=true'`.
