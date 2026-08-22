# Repro for vercel/next.js#69926 — git dependency breaks `next dev` (webpack)

Minimal reproduction of the `ERR_INVALID_ARG_VALUE` / "Module not found" problems reported when a
dependency is installed straight from git.

## Run

```bash
corepack enable
pnpm install     # must be pnpm 9.x (pinned via packageManager)
pnpm dev         # next dev --webpack -> crashes
```

Then open http://localhost:3000/.

## Observed

pnpm 9 stores git dependencies in a virtual-store directory whose name keeps the `#<commit>`
fragment:

```
node_modules/.pnpm/is-odd@git+https+++git@github.com+jonschlinkert+is-odd.git#a80ee0d8...
```

webpack turns `#` into a `\0#` fragment marker, so the dev server tries to write a server
vendor chunk whose path contains a NUL byte and crashes on every request:

```
⨯ uncaughtException: TypeError: The argument 'path' must be a string, Uint8Array, or URL
without null bytes. Received '.../.next/dev/server/vendor-chunks/
is-odd@git+https+++git@github.com+jonschlinkert+is-odd.git\x00#a80ee0d8...'
  code: 'ERR_INVALID_ARG_VALUE'
```

## Notes

- `pnpm build` (`next build --webpack`) succeeds; only the webpack dev server crashes.
- `next dev` with Turbopack (drop `--webpack`) works fine.
- pnpm 10/11 escape the `#` as `+`, so the crash disappears — this is why some reporters say
  upgrading pnpm "fixes" it.
- The original "Module not found: Can't resolve 'simple-package'" in the issue is a separate,
  package-side problem: that git package ships no `dist/` and its build script never ran.
