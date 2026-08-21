# Repro for vercel/next.js#76806 — testing App Router route handlers with `next/jest`

```bash
npm install
npm test              # 3 suites: 1 fails (reporter's mock is ignored), 1 fails (jsdom), 1 passes
npm run test:projects # every suite fails: next/jest transform is not applied to `projects`
```

Observed on `next@15.2.1` and `next@16.3.1-canary.26` (Node 24, jest 29.7.0).

1. `app/api/hello.test.js` (reporter's file) fails with
   `` `headers` was called outside a request scope `` — the `jest.mock("next/headers", ...)`
   factory is registered but **not hoisted above the ESM imports**, because `jest` is
   imported from `@jest/globals`. next/jest's SWC `hoist_jest` pass only recognises the
   global `jest`. `app/api/works-with-global-jest.test.js` is the identical test using the
   global `jest` and it passes, which isolates the root cause.
2. `app/api/no-env-docblock.test.js` shows the jsdom environment cannot load `next/server`
   (`ReferenceError: Request is not defined`), so a `@jest-environment node` docblock is
   mandatory per file...
3. ...and the documented alternative (Jest `projects` with `testEnvironment: "node"`) is
   unusable: `npm run test:projects` fails with
   `SyntaxError: Cannot use import statement outside a module`, because `createJestConfig`
   only sets `transform`/`moduleNameMapper` on the root config, never on each project.
