# Repro: `next lint` fails when an import in `next.config.mjs` cannot resolve (#73012)

`next lint` calls `loadConfig(PHASE_PRODUCTION_BUILD, dir)` (see `next/dist/cli/next-lint.js`)
just to read `eslint.dirs`, so any unresolvable import inside `next.config.mjs` crashes linting.
In a monorepo this makes it impossible to lint before dependent packages are built.

`packages/some-package` mimics an unbuilt workspace package: it declares only a `./plugin`
subpath export, so `import somePlugin from 'some-package'` in `next.config.mjs` throws
`ERR_PACKAGE_PATH_NOT_EXPORTED`.

## Run

```bash
npm install
npx next lint     # fails: ERR_PACKAGE_PATH_NOT_EXPORTED ... imported from next.config.mjs
npx eslint pages  # passes: plain ESLint never loads next.config
```

Reproduced with next 15.1.0 and 15.5.23 (Node 24). `next lint` was removed in Next.js 16,
so only the 15.x line is affected.
