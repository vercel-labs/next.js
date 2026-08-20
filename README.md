# Reproduction attempt for vercel/next.js#51462

`router.push()` ignores `<Suspense />` on the target page, waits until data is fully loaded.

The reporter's CodeSandbox (`bold-dust-f8dkq8`) and its preview URL are gone (403 / 503),
so this is a minimal reconstruction of the described app:

- `app/page.js` – dynamic page with a `<Suspense>` boundary around an async server
  component that takes 5s (mimics the reporter's slow endpoint).
- `app/test/page.js` – client page with a button calling `router.push('/')`.
- `app/test2/page.js` – client page calling `router.push('/?q=1')` from `useEffect`.

## Run

```bash
npm install --legacy-peer-deps
npx playwright install chromium
npm run dev          # or: npm run build && npm run start
node timeline.mjs 3000            # button + router.push('/')
node timeline2.mjs 3000 /test2    # useEffect router.push('/?q=1')
```

`timeline*.mjs` prints the visible body text of the page over time after the navigation.

## Result

Not reproduced. On next@16.3.1-canary.25 (dev and production) and on the originally
reported next@13.4.7-canary.1 (production), the Suspense fallback appears within ~100ms
of `router.push()` and the data arrives ~5s later:

```
+   29ms | /test | Test page Go home via router.push
+   82ms | /     | Home shell rendered Loading data...
+ 5063ms | /     | Home shell rendered DATA: slow payload
```
