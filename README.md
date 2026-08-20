# Reproduction: next.js#74139 — `@next/codemod upgrade canary` refuses to upgrade when `canary` semver < `latest`

Issue: https://github.com/vercel/next.js/issues/74139

The `canary` dist-tag is published as `<latest patch>-canary.N`, which semver-wise is
*lower* than the released `latest` patch. `runUpgrade` compares the installed version
with the resolved target and bails out with
`Current Next.js version is higher than the target version`, so users on `latest`
can never move to `canary`.

Originally seen with next 15.1.2 vs canary 15.1.1-canary.13. Still reproducible today
with next 16.3.1 (latest) vs canary 16.3.1-canary.25.

## Steps

```bash
npm install
git init && git add -A && git commit -m init   # codemod requires a clean git tree
npx @next/codemod@canary upgrade canary
```

## Actual

```
✓ Current Next.js version is higher than the target version "v16.3.1-canary.25".
```

next stays at 16.3.1; no upgrade is performed (exit code 0).

## Expected

The installed `next` is switched to the `canary` dist-tag version.

Relevant code: `packages/next-codemod/bin/upgrade.ts` (`compareVersions(installedNextVersion, targetNextVersion) > 0` early return).
