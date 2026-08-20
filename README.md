# Static export MPA fallback drops trailing slash after RSC build ID mismatch

Reproduction for https://github.com/vercel/next.js/issues/97608 (Next.js
`16.3.1-canary.25`).

Config: `output: "export"`, `trailingSlash: true`, `basePath: "/assets/trip/next-test"`.

## Run

```bash
pnpm install
pnpm exec playwright install chromium   # only needed for pnpm repro:check
pnpm repro:build                        # two builds (A, B) -> .repro/out-mixed with skewed build IDs
pnpm repro:serve                        # serves .repro/out-mixed under the basePath, no redirects
pnpm repro:check                        # in a second shell: automated Playwright assertion
```

Manual: open <http://localhost:8765/assets/trip/next-test/> and click
`Open /target/`.

## Result

The `/target/index.txt` RSC payload comes from build B, so its build ID does not
match the client, and Next.js falls back to a hard MPA navigation.

- Actual: browser ends at `/assets/trip/next-test/target` (no trailing slash).
- Expected: `/assets/trip/next-test/target/`.

`pnpm repro:check` exits 1 with
`FAIL: expected .../target/ but got .../target`.

Control: serving only `.repro/out-a` (no build-ID skew) performs a client-side
navigation and correctly ends at `/assets/trip/next-test/target/`.

## Cause

On a build-ID mismatch, `fetchServerResponse` calls
`doMpaNavigation(res.url)` -> `urlToUrlWithoutFlightMarker`, which strips
`/index.txt` (10 characters) from `/target/index.txt`, removing the trailing
slash as well; with `trailingSlash: true` only `index.txt` (9 characters) should
be stripped.
