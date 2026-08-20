# Reproduction: app dir dynamic route params split on `%2F` (vercel/next.js#49646)

Catch-all routes exist in both routers:

- `app/app/[...path]/page.tsx`
- `pages/pages/[...path].tsx`

Request `/app/foo/bar/foo%2Fbar` and `/pages/foo/bar/foo%2Fbar`.

`encodeURIComponent("foo/bar") === "foo%2Fbar"`, so the expected params array has
three segments: `["foo","bar","foo/bar"]` (or at least `["foo","bar","foo%2Fbar"]`).

## Run

```bash
npm install
npm run build && npm start
# curl --path-as-is 'http://localhost:3000/app/foo/bar/foo%2Fbar'
# curl --path-as-is 'http://localhost:3000/pages/foo/bar/foo%2Fbar'
```

Self-hosted `next start`/`next dev` returns `["foo","bar","foo%2Fbar"]` for both routers.
When deployed to Vercel, the app-router page returns `["foo","bar","foo","bar"]`
(the `%2F` is decoded before matching, producing an extra segment), while the
pages-router page still returns 3 segments.

## Observed on Vercel (Next.js 16.3.1-canary.25)

| route | params |
| --- | --- |
| `/app/foo/bar/foo%2Fbar` | `["foo","bar","foo","bar"]` |
| `/pages/foo/bar/foo%2Fbar` | `["foo","bar","foo","bar"]` (`req.url` is still `/pages/foo/bar/foo%2Fbar`) |
