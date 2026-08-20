# Repro: next.js#73325 — wrong `loading.tsx` shown when navigating to a nested dynamic segment

The reporter's linked repository (`jelius-sama/loading-bug-nextjs-14`) returns 404, so this is a
minimal re-creation of the described structure.

Routes:

- `src/app/page.js` — link to `/picasso/guernica`
- `src/app/[artist]/loading.js` — "Loading artist page..."
- `src/app/[artist]/[art]/loading.js` — "Loading art page..." (both pages sleep 3s)

## Steps

```bash
npm install
npx playwright install chromium
npm run dev            # terminal 1 (port 3000)
npm run repro          # terminal 2 — prints body text every 50ms after the click
SLOW=1 npm run repro   # same, but /_next/static/chunks/** delayed 600ms (simulates a slow machine)
```

## Result with next@14.2.5, `next dev`

```
0ms:   "Home\nart page"
50ms:  "Loading artist page..."   <-- parent segment fallback (wrong)
100ms: "Loading art page..."
2800ms:"Art: guernica by picasso"
```

The parent `[artist]/loading.js` fallback is rendered first while the leaf segment's client chunk is
still being lazily fetched; on a slow machine this is what the user sees as "the wrong loading UI".

`next build && next start` with 14.2.5 shows only "Loading art page...".
next@canary (16.3.1-canary.25) in dev also shows only "Loading art page..." — appears fixed.
