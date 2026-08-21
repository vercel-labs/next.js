# Reproduction: vercel/next.js#82729 — `next dev` repeatedly GETs `/favicon.ico` on HMR

The reporter's linked repo (`johanan-23/reproduction-app`) returns 404, so this is a minimal
reproduction built from the report.

## What it shows

On **every** HMR update in `next dev` (App Router, `app/favicon.ico`), the client removes and
re-inserts the *identical* `<link rel="icon">` element in `<head>`. Because dev serves the icon
with `cache-control: ... max-age=0, must-revalidate` (15.3.1: no cache-busting query at all),
each re-insertion can trigger a fresh `GET /favicon.ico`. A burst of saves (or one save that
produces several RSC refreshes) therefore produces many `GET /favicon.ico` lines in a few seconds,
which matches the report; whether each re-insertion hits the network depends on browser icon cache
state, which explains "not happening every time".

## Steps

```bash
npm install
npx playwright install chromium
npm run dev > dev.log 2>&1 &     # terminal 1 (log is read by the measure script)
LOG=dev.log npm run measure      # terminal 2 (headed Chromium, Xvfb on Linux)
```

The script edits `app/page.js` (`ROUNDS` times, `BURST` saves per round), waits for HMR, and counts
`<link rel="icon">` add/remove mutations plus `GET /favicon.ico` lines in the dev log.

## Observed (next 15.3.1)

```
initial: iconOps=3 serverFaviconGETs=1
round 1 (burst 1): iconOps=+2   # remove + add of /favicon.ico per HMR update
round 2 (burst 1): iconOps=+2
...
ROUNDS=4 BURST=6 -> iconOps=+12 per round (6 re-insertions within ~2s)
```

Still present on `next@canary` (16.3.1-canary.26, Turbopack): **+4** icon link mutations per HMR
update (`/favicon.ico?favicon.<hash>.ico`, `cache-control: no-cache, must-revalidate`).

Manually: open the app in Chrome with DevTools Network open ("Disable cache" checked) and save
`app/page.js` a few times — repeated `GET /favicon.ico` appear.
