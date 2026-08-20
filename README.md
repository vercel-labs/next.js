# Repro: global not-found with multiple root layouts (vercel/next.js#55191)

`app/` has no root `layout.tsx`; two route groups each provide their own root layout
(`app/(main)/layout.tsx`, `app/(sub)/layout.tsx`). `app/(main)/not-found.tsx` exists.

```bash
npm install
npm run dev
# then:
curl -s localhost:3000/this-does-not-exist   # default "This page could not be found", no group layout
curl -s localhost:3000/not-found-trigger     # (main) group not-found inside MAIN ROOT LAYOUT
```

Observed on Next.js 16.3.1-canary.25: unmatched URLs never reach `app/(main)/not-found.tsx`;
they render Next's built-in 404 without any of the group root layouts. `notFound()` thrown
from a page inside the group does render the group not-found, so the file itself is wired up
only for in-group segments, not for unmatched routes.
