# `<Link href="#hash">` does not activate the CSS `:target` selector

Reproduction for https://github.com/vercel/next.js/issues/51346

Repaired from the reporter's repro (https://github.com/tilman/nextlink-css-target-selector-bug):
React bumped to 19 and the stale `experimental.appDir` key removed so it installs/runs on `next@canary`.

## Run

```bash
npm install
npm run dev            # http://localhost:3000 (Pages Router) and /appExample (App Router)
npx playwright install chromium   # only needed for the automated check
npm run check          # drives Chromium and prints the computed background colour
```

## Expected vs actual

`#sometesttarget:target { background: blue }`

| action | url | expected bg | actual bg |
| --- | --- | --- | --- |
| `<a href="#sometesttarget">` | `/#sometesttarget` | blue | `rgb(0, 0, 255)` ✅ |
| `<Link href="#sometesttarget">` | `/#sometesttarget` | blue | `rgba(0, 0, 0, 0)` ❌ |

Same result in the App Router (`/appExample`), in `next dev` and `next build && next start`.
Cause: client-side hash navigation uses `history.pushState`, which does not update the
document's target element (see https://bugs.chromium.org/p/chromium/issues/detail?id=89165).
