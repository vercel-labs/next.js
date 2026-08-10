# Repro: issue #97022 — `next start` warns `output: 'standalone'` "does not work", but it does

## Run

```sh
npm install
npm run build
npx next start
```

`next start` prints:

```
⚠ "next start" does not work with "output: standalone" configuration. Use "node .next/standalone/server.js" instead.
```

Yet the server works: `/` returns 200 with correct HTML, `/_next/static` CSS + JS return 200 with
correct content types, and the Server Action increments the counter 0 -> 1.

Verify the Server Action with the included script (server must be running on :3000):

```sh
npm i -D playwright && npx playwright install chromium
node check.mjs
```

Warning source: `packages/next/src/server/next.ts` (still present on canary).
`next start` serves the regular `.next` build; it simply does not run `.next/standalone/server.js`.
