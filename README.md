# App Router scroll restoration is lost on back navigation (vercel/next.js#70148)

Minimal reproduction: when a browser back navigation re-suspends the target
route (because the client router cache entry was invalidated), the App Router
renders `loading.tsx`, the document height collapses, and the previous scroll
position is never restored.

## Run

```bash
npm install
npx playwright install chromium
npm run build
npm start &            # http://localhost:3000
npm run check          # Playwright assertion, exits 1 on the bug
```

## Manual steps

1. Open `/shop` and scroll down to ~3000px.
2. Click any product link.
3. Wait ~1s. The product page calls `router.refresh()` once, which invalidates
   the client router cache (any server action / `revalidatePath` does the same).
4. Press the browser back button.

Expected: `/shop` is restored at scrollY 3000.
Observed: `/shop` re-suspends into `loading.tsx` (height 8096 -> 800) and the
final scroll position is 0.

Observed on Next.js 15.1.6 and 16.3.1 (Chromium, production `next start`).
Without the cache invalidation (i.e. when the back navigation is served from the
router cache) restoration works, which is why the bug looks intermittent.
