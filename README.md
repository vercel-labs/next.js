# Repro: vercel/next.js#86860 — `redirect()` unmounts the current `loading.tsx` before the destination renders

Minimal reproduction of https://github.com/vercel/next.js/issues/86860.

Routes:
- `/` client component, `router.push('/test')`
- `/test` dynamic server component, waits 1s, then calls `redirect('/gleb')`; has `loading.jsx` ("TEST LOADING …")
- `/gleb` dynamic server component, waits 2s; has `loading.jsx` ("GLEB LOADING …")

Expected: `TEST LOADING …` stays visible until `/gleb` (or its own `loading.jsx`) can render.
Actual: the route content collapses to an empty layout (blank) between the two fallbacks.

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # or: npm run build && npm start
# in another shell, after opening http://localhost:3000
npm run probe          # frame-accurate recording of the visible route content
```

`probe.mjs` clicks the button and records the visible route text on every animation frame.

## Measured output (this repo, Linux, headless Chromium)

next dev (16.3.1-canary.26):

```
[0,   'GO TO CHECK'], [687, 'TEST LOADING …'], [1648, 'EMPTY'], [1912, 'GLEB LOADING …'], [3875, 'GLEB CONTENT']
```

next build && next start (16.3.1-canary.26):

```
[592, 'GO TO CHECK'], [673, 'TEST LOADING …'], [1674, 'EMPTY'], [1687, 'GLEB LOADING …'], [3685, 'GLEB CONTENT']
```

Same numbers on next@15.4.4 (the version in the issue): dev blanks for ~90–350 ms, prod for ~1 frame.
In the reporter's original repo (https://github.com/GlebKodrik/redirect) the destination page has no
suspending await and streams a ~50 MB payload, so the blank state lasts ~3.5 s in dev and ~8 s in prod.
