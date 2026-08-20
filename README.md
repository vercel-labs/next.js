# Repro attempt: SWC plugins + `transpilePackages` (vercel/next.js#43886)

Minimal check of whether `experimental.swcPlugins` is applied to packages listed in
`transpilePackages` (issue #43886).

## How it works

- `packages/lib` is a package with **no valid `main` entry**, but it ships `lib/hello.js`.
- `packages/dep` (compiled via `transpilePackages: ['dep']`) contains
  `import { hello } from 'lib'`.
- `@swc/plugin-transform-imports` is configured to rewrite `lib` member imports to
  `lib/{{member}}`.
- Both packages are copied into `node_modules` as **real directories** by
  `scripts/setup-node-modules.mjs` (postinstall), so they are not compiled just because
  they live inside the project root.

So:
- Plugin applied to the transpiled package -> import becomes `lib/hello`, page renders
  `dep: hello-from-lib`.
- Plugin not applied -> `Module not found: Can't resolve 'lib'`.

`app/page.js` performs the same import so first-party code is checked at the same time.

## Run

```bash
npm install
npm run dev            # Turbopack
npm run dev -- --webpack
npm run build
```

Open http://localhost:3000.

## Result on next@16.3.1-canary.25

- `next dev` (Turbopack): renders `app: hello-from-lib` and `dep: hello-from-lib`
- `next dev --webpack`: same
- `next build` (Turbopack): compiles successfully
- Control (remove `transpilePackages`): `Module not found: Can't resolve 'lib'` from
  `node_modules/dep/index.js` in both bundlers, which shows the check is sensitive.

=> SWC plugins **are** applied to `transpilePackages` on current canary.

Note: `@swc/plugin-transform-imports@12.19.0` is used because plugin wasm must match the
`swc_core` version of the Next.js binary (canary here uses `swc_core` 76; `13.0.0` is built
against 77 and fails with "Failed to execute SWC plugin").
