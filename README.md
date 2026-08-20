# Repro: next.js#47211 — uncaught errors after `await app.prepare()` are swallowed (custom server)

Next.js version tested: `16.3.1-canary.25`, Node `24.17.0`.

## Run

```bash
npm install
node server.js                      # dev: error logged, but process NEVER exits (hangs)
npm run build
NODE_ENV=production node server.js  # prod: error logged, but process exits with code 0
node server-prepare-fail.js         # control: a rejecting app.prepare() DOES crash with exit 1
```

## Expected

An uncaught `throw` in the custom server script should terminate the process with exit code 1
(plain Node baseline: `node -e "throw new Error('x')"` → exit 1).

## Actual

`initialize()` in `next/dist/server/lib/router-server.js` registers a global
`process.on('uncaughtException', logError)` handler during `app.prepare()`, so any later uncaught
error in user code is only logged and the crash is swallowed:

- production: `EXIT_CODE=0`
- development: process stays alive forever, error logged up to 3x

The original 2023 report (a failing `app.prepare()` printing nothing) no longer reproduces —
`server-prepare-fail.js` exits 1 with a full stack — but the swallowing reported in
https://github.com/vercel/next.js/issues/47211#issuecomment-2277763508 still reproduces.
