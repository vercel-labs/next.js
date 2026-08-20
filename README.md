# Repro: "Error: The render was aborted by the server without a reason." (vercel/next.js#56699)

Minimal reproduction: an App Router page that streams a Suspense boundary (3s slow child).
When the client disconnects while the RSC/HTML stream is still open (rapid refresh, navigating
away, cancelled prefetch), the Next.js dev server logs:

```
 ⨯ Internal error: Error: The render was aborted by the server without a reason.
    at Object.cancel (.../next-server/app-page.runtime.dev.js)
    at readableByteStreamControllerCancelSteps (node:internal/webstreams/readablestream)
```

## Run

```bash
npm install
npm run dev            # Next 13.5.5 dev server on :3055
npm run abort          # 6 requests aborted 400ms into the 3s stream
# or, in a browser:
npx playwright install chromium
npm run rapid-reload   # 6 cancelled navigations
```

Each aborted request adds one `Internal error: Error: The render was aborted by the server
without a reason.` block to the dev server output.

## Result matrix (verified)

| next | occurrences after 6 aborted requests |
| --- | --- |
| 13.5.5 (version in the issue report) | 6 |
| 16.3.1-canary.25 | 0 (client disconnect handled silently) |

Switch versions with `npm i next@canary react@canary react-dom@canary --legacy-peer-deps`.
