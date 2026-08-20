# Repro for vercel/next.js#54980

`not-found.tsx` inside a route group is not rendered for unmatched URLs.

## Run

```
npm install
npm run dev   # http://localhost:3000
# or: npm run build && npm run start  (http://localhost:3001)
```

Then visit:

| URL | Expected | Actual |
| --- | --- | --- |
| `/group-dir/trigger` (calls `notFound()`) | ROOT LAYOUT + GROUP LAYOUT + GROUP NOT FOUND | same (works) |
| `/group-dir/unmatched` (no matching route) | ROOT LAYOUT + GROUP LAYOUT + GROUP NOT FOUND | ROOT LAYOUT + ROOT NOT FOUND |

`node check.mjs http://localhost:3000 dev` prints the rendered text for each URL (requires `npx playwright install chromium`).
