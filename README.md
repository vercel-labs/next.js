# Reproduction: `agents-md` does not detect the version when a semver range is used

Issue: https://github.com/vercel/next.js/issues/89773

`package.json` declares `"next": "^16"` and `next` is **not installed**
(no `node_modules`, which is the state when the codemod is the first thing run in a
fresh checkout/sandbox).

## Run

```bash
./repro.sh
```

## Observed

`@next/codemod@16.2.0-canary.33` (version current when the issue was filed) treats the
range string as a concrete version:

```
Downloading Next.js 16 documentation to .next-docs...
Failed to pull docs: Could not find documentation for Next.js v16. This version may not exist on GitHub yet.
```

`@next/codemod@canary` (16.3.1-canary.26) no longer mis-parses the range, but since
`getNextjsVersion()` only uses `require.resolve('next/package.json')` it now bails out:

```
Could not detect Next.js version. Use --version to specify.
Example: npx @next/codemod agents-md --version 15.1.3 --output AGENTS.md
```

## Expected

`^16` should resolve to a real published 16.x version (or the range should be resolved
from the registry / lockfile) so the docs can be downloaded.

## Works after installing

```bash
npm install && npx @next/codemod@canary agents-md --output AGENTS.md
# Using the docs bundled with Next.js 16.3.1 at ./node_modules/next/dist/docs (no download needed).
# ✓ Created AGENTS.md (8.6 KB)
```
