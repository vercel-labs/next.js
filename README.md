# Repro harness for vercel/next.js#97556

Claim: under `next dev --turbopack`, a named import called `boolean` is emitted as a
bare identifier, causing `ReferenceError: boolean is not defined` in the client chunk.

## Run

```bash
npm install
npm run dev   # next dev --turbopack
```

Then open:

- `/tbrepro`  — the issue's inline repro verbatim (`lib/tbrepro/table.js`)
- `/tbrepro2` — same table authored in TypeScript (`lib/tbrepro/table2.ts`)
- `/pi`       — real-world case: `property-information@7.1.0` (`lib/html.js` imports `boolean`)

Inspect the emitted client chunk containing `alphaish` / `allowFullScreen` under
`/_next/static/chunks/` to check whether `boolean` is rewritten to the module
namespace form.

## Result observed (Linux, Node 24, Next 15.5.12 and 16.3.1-canary.24)

All three pages render without console/page errors, and every binding — including
`boolean` — is emitted as `<NS>["boolean"]`. Not reproduced.
