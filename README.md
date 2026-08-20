# Repro harness for vercel/next.js#50460 — `next lint --max-warnings`

The issue has no reproduction link (`-`), so this is a minimal harness built from the
steps in the report: a pages-router app whose `pages/_app.js` and `pages/index.js`
trigger `react/jsx-props-no-spreading`.

## Run

```bash
npm install --legacy-peer-deps
npm run verify   # runs next lint with several --max-warnings values and prints exit codes
npm run lint     # next lint --max-warnings 0 ; echo $?  -> 1
```

## Result observed (Next.js 15.5.4, the last release that still ships `next lint`)

| command | warnings | exit code |
| --- | --- | --- |
| `next lint --max-warnings 0` | 2 | 1 |
| `next lint --max-warnings 1` | 2 | 1 |
| `next lint --max-warnings 2` | 2 | 0 |
| `next lint --max-warnings 0 --file pages/_app.js` | 1 | 1 |

The flag behaves as documented. The same steps also exit 1 on the reported version
13.4.4 (both with the rule set to `error` and to `warn`), so the report could not be
reproduced.

On Next.js 16 canary the command no longer exists:
`next lint --max-warnings 0` -> `error: unknown option '--max-warnings'`.
