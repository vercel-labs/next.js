# Repro: next.js#66277 — draft mode + `dynamic = 'force-static'` gives empty `searchParams`

Minimal reproduction of https://github.com/vercel/next.js/issues/66277

```bash
npm install
npm run dev
curl -sL -c jar -b jar "http://localhost:3000/api/draft-mode?slug=home"      # force-static page
curl -sL -c jar -b jar "http://localhost:3000/api/draft-mode?slug=home-auto" # control (dynamic auto)
```

Observed (Next 16.3.1-canary.25, also 14.3.0-canary.85):

```
[home]      draftMode.isEnabled = true | searchParams = {}
[home-auto] draftMode.isEnabled = true | searchParams = {"slug":"home-auto","test":"working"}
```

`/home` is rendered on demand while draft mode is enabled (the log runs per request), but
`searchParams` is permanently `{}` because of `export const dynamic = 'force-static'`.
Same result with `next build && next start`.
