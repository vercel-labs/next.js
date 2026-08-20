# Reproduction: Fast Refresh re-evaluates module-level singletons (DB connection exhaustion)

Issue: https://github.com/vercel/next.js/issues/45483
(The reporter's CodeSandbox needs a live Postgres; this repro replaces the DB with a
counter persisted to `/tmp/connection-count.txt` so every "connection" open is countable.)

## Run

```bash
npm install
rm -f /tmp/connection-count*.txt
npm run dev            # terminal 1
bash repro.sh          # terminal 2 (edits db/connect.ts 5x and reads the page)
```

## What happens (next@16.3.1, Turbopack dev)

`db/connect.ts` exports `export const db = new DatabaseConnection()` (the docs' pattern).
Each save of that file makes the dev server evaluate the module again, so a *new*
connection is opened and the previous one is never closed:

```
edit 1 -> plain connection id: 4 ... total opened=5
edit 2 -> plain connection id: 7 ... total opened=8
...
edit 6 -> plain connection id: 19 ... total opened=20
```

Without edits, the id stays constant, so the growth comes from Fast Refresh only.
`db/connect-global.ts` (the `globalThis` workaround) stays at connection #1 the whole time,
including through the dynamic route `/api/foo/[bar]`.
