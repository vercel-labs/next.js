# Repro: next.js#81377 — error boundary flashes when navigating with `<a>` while a Server Action is in flight (Firefox only)

Upstream issue: https://github.com/vercel/next.js/issues/81377

## Run

```bash
npm install
npx playwright install firefox
npm run dev            # http://localhost:3000
npm test               # Playwright/Firefox scenario, prints JSON result
```

Compare against Chromium (no error):

```bash
npx playwright install chromium
BROWSER=chromium npm test
```

## What the test does

1. Loads `/`.
2. Clicks **Submit**, which calls the Server Action `slowAction()` (8s delay + `revalidatePath('/')`) inside `startTransition`.
3. While the action is still pending, clicks the plain `<a href="/dashboard">` link (hard navigation).
4. A `MutationObserver` installed before load records whether `app/error.tsx` ever renders.

## Observed (Firefox 1538 / Playwright 1.62.1)

```
ERROR_BOUNDARY_VISIBLE:Error boundary rendered: NetworkError when attempting to fetch resource.
TypeError: NetworkError when attempting to fetch resource.
The above error occurred in the <Form> component. It was handled by the <ErrorBoundaryHandler> error boundary.
```

Chromium: no error, no error boundary render.

Firefox aborts the in-flight Server Action `fetch` when the document starts unloading; the resulting
`TypeError: NetworkError...` rejects the action promise inside the transition, so the closest
`error.tsx` boundary renders for a frame before the new document commits.

Reproduces with `next@15.3.5` and `next@16.3.1-canary.26` (Turbopack dev).
