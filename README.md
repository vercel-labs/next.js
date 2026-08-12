# Repro: `next build` type-checks `.next/dev/types` on Windows (vercel/next.js#97216)

`lib/typescript/runTypeCheck` filters generated dev types with
`fileName.startsWith(getDevTypesPath(baseDir, distDir))`.
`getDevTypesPath` returns a raw `path.join(...)` (backslashes on Windows) while the
fileNames coming from TypeScript's config parser always use forward slashes, so on
Windows the filter is a no-op and a stale/half-written `.next/dev/types/validator.ts`
fails the build.

## Run

```
npm install
npm run repro   # runs `next build` twice: host path.join, then simulated Windows path.join
npm run check   # prints the two mismatched strings
```

`fixtures/dev-types/validator.ts` is a real generated validator truncated mid-declaration,
mimicking the stale/concurrently-written file produced while `next dev` is running.

Expected: phase 1 passes (filter works with `/`), phase 2 fails with
`.next/dev/types/validator.ts:42:1  Type error: '}' expected.`

On a real Windows machine, phase 1 already fails — the `path.win32.join` patch in
`repro.mjs` only makes the platform-specific code path observable on Linux/macOS.
