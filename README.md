# Repro: framer-motion shared layout / exit animations in the App Router (vercel/next.js#49279)

Next.js `16.3.1-canary.25` (Turbopack) + `framer-motion@13.1.1` + React 19.

## Run

```bash
npm install
npm run dev        # or: npm run build && npm start
npx playwright install chromium
npx playwright test # prints sampled geometry/opacity per scenario
```

Each Playwright test clicks once and then samples the animated element every 50ms.
Transitions are 1.5s linear, so a working animation shows many intermediate values.

## Scenarios

| Route | What it tests | Result on canary |
| --- | --- | --- |
| `/a` → `/b` (`app/navigation.tsx`) | `layoutId` highlight in the root layout nav | animates (works) |
| `/control` | same highlight driven by `useState` (baseline) | animates |
| `/cross` → `/cross/detail` | `layoutId` shared between two client page files | animates (works) |
| `/cross-control` | same components swapped with `useState` (baseline) | animates |
| `/async` → `/async/detail` | same as `/cross`, but target route is a dynamic async Server Component with `loading.tsx` | **broken**: element unmounts during the loading state and reappears at its final size |
| `/exit/one` → `/exit/two` (`app/exit/template.tsx`) | `AnimatePresence mode="wait"` exit animation on navigation | **broken**: exiting page is removed from the DOM in the same frame, no exit animation |

Observed samples (identical in `next dev` and `next start`):

```
CROSS ROUTE: 100x100 106x104 119x113 ... 396x297 400x300      (animates)
ASYNC ROUTE: 100x100 missing missing missing 400x300 ...      (jumps)
EXIT:        wrappers[Page one=1] -> wrappers[Page two=1]     (no fade out/in)
```
