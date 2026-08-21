# Repro: Turbopack hashed external module aliases break when node_modules is reinstalled

Issue: https://github.com/vercel/next.js/issues/87737

The reporter's linked repo (`Aluisio/test-styled-components`) returns 404, so this is a minimal
standalone reproduction. Reproduced with `next@16.1.1` (as reported) and `next@16.3.1`.

## What happens

A Turbopack production build externalizes `require-in-the-middle` (imported from
`instrumentation.js`) behind a content-hashed alias and emits a symlink for it:

```
.next/node_modules/require-in-the-middle-a99415fa67232f7f
  -> ../../node_modules/.pnpm/require-in-the-middle@8.0.1/node_modules/require-in-the-middle
```

The hashed alias only resolves through that symlink, and the symlink points into the exact
`node_modules` layout present at build time. So:

1. `tar --exclude node_modules` (the usual "ship the build, reinstall deps later" CI flow) also
   strips `.next/node_modules`, and `pnpm install` never recreates it.
2. Even when `.next/node_modules` is preserved, a reinstall with a different layout
   (different store path / hoisting / package manager) leaves the symlink dangling.

Both cases fail at runtime with:

```
Error: An error occurred while loading instrumentation hook: Failed to load external module
require-in-the-middle-a99415fa67232f7f: Error: Cannot find module 'require-in-the-middle-a99415fa67232f7f'
```

`next build --webpack` does not produce hashed aliases and works in both cases.

## Run

```bash
./reproduce.sh
```

Then: `curl -s -o /dev/null -w '%{http_code}\n' localhost:3000/` -> `500`,
and the server log shows the `Cannot find module 'require-in-the-middle-<hash>'` error.

Control: running `pnpm start` in *this* directory right after `pnpm build` works and prints
`instrumentation registered`.
