# Reproduction: `@next/codemod upgrade` broken on npm 12

Issue: https://github.com/vercel/next.js/issues/97445

## Run

```bash
npm run repro
```

Requires Node 18+ and network access. Nothing is installed into this directory;
everything goes into a temp dir.

## What it does

1. Installs `npm@12.0.1` and `@next/codemod@canary` into a temp dir.
2. Puts npm 12 first on `PATH` so the codemod's `execSync('npm ...')` calls use it.
3. Runs both `npm view` forms directly to isolate the removed flag.
4. Runs `@next/codemod upgrade latest --verbose` in a minimal Next.js 16.3.1 app.

Exits 0 when the bug reproduces.

## Expected output (bug present)

```
$ npm --silent view next@latest --json --field version
exit=1
{ "error": { "code": "EUNKNOWNCONFIG", "summary": "Unknown cli flag:\n  - --field ..." } }

$ npm --silent view next@latest version --json
exit=0
[ "16.3.1" ]

...
BadInput [Error]: Invalid revision provided: "latest" (resolved to "latest"). ...
codemod exit=1
```

With npm 11.x the same command succeeds, which shows the failure is the npm flag,
not the revision.

## Root cause

`packages/next-codemod/bin/upgrade.ts` has two call sites using the flag npm 12 removed:

```js
execSync(`npm --silent view "${query}" --json --field version`, { encoding: 'utf-8' })
```

The positional form (`npm --silent view "<query>" version --json`) works on npm 10, 11 and 12
and returns the same scalar-or-array shape the surrounding code already handles.

Secondary bug: the `try/catch` around that `execSync` reports any subprocess failure as
`Invalid revision provided`, hiding the real error (same masking as #85587).
