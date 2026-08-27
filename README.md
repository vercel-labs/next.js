# Reproduction for vercel/next.js#97980

`next upgrade` crashes immediately with `Error: spawn npx ENOENT` on Windows.

## Run

```bash
npm install
npm run repro
```

## Expected vs actual

Expected: `next upgrade` spawns `npx --yes @next/codemod@canary upgrade <revision>`.

Actual (next@16.4.0-canary.9):

```
node:events:487
      throw er; // Unhandled 'error' event
      ^

Error: spawn npx ENOENT
    at ChildProcess._handle.onexit (node:internal/child_process:287:19)
  errno: -2, // -4058 on Windows
  code: 'ENOENT',
  syscall: 'spawn npx',
  path: 'npx',
  spawnargs: [ '--yes', '@next/codemod@canary', 'upgrade', 'canary' ]
}
```

## Root cause

`packages/next/src/cli/next-upgrade.ts` uses native `child_process.spawn` (no `shell`,
no `cross-spawn`) with the bare command name from `getNpxCommand()`, and never attaches an
`'error'` handler to the returned `ChildProcess`. On Windows the package-manager binaries are
`.cmd`/`.ps1` shims, so the bare name is unresolvable. Other CLI paths (`next test`,
`installDependencies`, `runTypeScriptCli`) use `next/dist/compiled/cross-spawn`.

`fakewinbin/` contains only `npx.cmd`, which makes a POSIX box behave like Windows for this
lookup, producing the identical unhandled-error crash.
