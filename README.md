# Repro harness for vercel/next.js#77504 — `router.refresh()` in Next.js 15

Reporter's linked repo (github.com/mwspace-it/nextjs-15-router-refresh-issue-25-03-2025) returns 404,
so this is a minimal re-implementation of the code posted in the issue.

Routes:
- `/client-effect` — exact code from the issue: client component fetches via a server action in
  `useEffect(..., [])`, button calls `router.refresh()`.
- `/server-rendered` — same data rendered by a server component, button calls `router.refresh()`.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
node test.mjs      # Playwright: clicks the button and diffs the rendered value
```

Switch `next`/`react` versions in package.json to compare 14 vs 15.

## Results (measured)

| version / mode | /client-effect updates? | /server-rendered updates? |
| --- | --- | --- |
| next 15.5.4 dev | no | yes |
| next 15.5.4 `build` + `start` | no | yes |
| next 14.2.33 (react 18.3.1) dev | no | yes |

`router.refresh()` re-renders server components in both 14 and 15; it never re-runs a
client `useEffect` with an empty dependency array, so the reported pattern cannot update in
either major version. No 14 -> 15 regression observed.
