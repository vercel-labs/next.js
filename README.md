# next/jest `debugger` statement repro — vercel/next.js#69541

Reproduces the report "[Next/Jest] debugger statement is ignored in chrome debugger" and
isolates the cause with a control case that does not use `next/jest`.

## Run

```bash
npm install
npm run verify   # drives the Node inspector over CDP, no manual DevTools clicking needed
```

`verify.mjs` starts Jest under `node --inspect-brk`, resumes past break-on-start and reports
whether a `Debugger.paused` event ever arrives for the `debugger;` statement in the test.

## Result (Node 24, next canary, jest 29.7.0)

| command | `debugger;` |
| --- | --- |
| `jest ./app --watch --no-cache --runInBand` (reporter's command, next/jest) | **IGNORED** |
| `jest ./app --no-cache --runInBand` (same, no `--watch`, next/jest) | pauses |
| `jest -c jest.plain.config.js --watchAll --no-cache --runInBand` (plain jest, no next/jest) | **IGNORED** |

The test prints `TEST_PID / PPID / INSPECTOR_URL`. In watch mode the test executes in a
`jest-worker` child process whose `require('inspector').url()` is `undefined` and whose
`process.execArgv` is `[]`, so `debugger;` is a no-op — `--runInBand` is not honoured in watch
mode. Without `--watch` the test runs in the inspected process and the statement pauses.

Not specific to `next/jest`: the plain Jest control behaves identically.
Workaround: drop `--watch`, or use `jest --watch --inspect-brk`-style setups that attach an
inspector to the workers (e.g. `NODE_OPTIONS=--inspect-brk` is *not* enough either).
