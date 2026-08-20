# Reproduction: Jest manual mocks stopped working (vercel/next.js#48012)

`next/jest` with `dir` set forwards tsconfig `baseUrl`/`paths` to SWC (`jsc.baseUrl` +
`jsc.paths`, added in #45815). SWC rewrites the aliased import `@/hooks/useTest` into a
relative path before Jest's resolver runs, so Jest no longer treats it as a "module from
node_modules"-style id and stops picking up the root-level `__mocks__/@/hooks/useTest.ts`
manual mock. The real module is loaded instead.

## Run

```bash
npm install
npm test
```

## Expected

Test passes: `useTest()` returns `mocked` (from `__mocks__/@/hooks/useTest.ts`).

## Actual (next 13.2.4 .. latest canary)

```
expect(received).toBe(expected)
Expected: "mocked"
Received: "not_mocked"
```

Works on next@13.2.3 (before #45815), where `paths` were resolved by Jest's
`moduleNameMapper` instead of SWC.
