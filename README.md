# Repro: Turbopack dynamic `import()` stays permanently failed after a transient network error

Issue: https://github.com/vercel/next.js/issues/93489
Based on the reporter's repro (kumarajay0412/turbopack-chunk-load-repro), plus an
automated Playwright driver and a webpack control build.

Next.js `16.3.0-canary.10`, Chromium (Playwright 1.61.1).

## Run

```bash
pnpm install
npx playwright install chromium

# Turbopack (bug)
pnpm build && pnpm start &          # localhost:3000
node repro-test.js

# webpack control
pnpm build:webpack && PORT=3001 pnpm start &
# then run repro-test.js with 3000 -> 3001
```

`repro-test.js`: loads the page, goes offline, clicks the button (async chunk fails
as expected), goes back online, then clicks 12 more times over ~10s, then reloads.

## Result

Turbopack production build:

```
== phase 1: offline ==
[reqfailed] /_next/static/chunks/1trk-cr7ky1gg.js net::ERR_INTERNET_DISCONNECTED
status after offline click: error: Failed to load chunk /_next/static/chunks/1trk-cr7ky1gg.js from module 49023
== phase 2: back online, repeated clicks ==
navigator.onLine=true
t=+0.8s click#1 -> error: Failed to load chunk ...
...
t=+9.8s click#12 -> error: Failed to load chunk ...
== phase 3: reload control ==
status after reload+click: ok
```

No further HTTP request is ever made for the chunk after the first failure — the
Turbopack runtime returns the cached rejected promise, so the failure is permanent
for the lifetime of the document (not a timed negative cache). Only a reload recovers.

webpack build of the same app recovers on the very first retry click (`click#1 -> ok`).
