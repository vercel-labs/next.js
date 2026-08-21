# Repro: Turbopack fails to resolve next/package.json with pnpm v11 `enableGlobalVirtualStore`

Issue: https://github.com/vercel/next.js/issues/93556

Mirrored and repaired from https://github.com/yamaaaaaa31/turbopack-pnpm-v11-repro
(added `strictDepBuilds: false` / `onlyBuiltDependencies` so `pnpm install` exits 0 in CI-like
environments; otherwise unchanged).

## Steps

```bash
pnpm install     # pnpm 11 (pinned via packageManager), enableGlobalVirtualStore: true
pnpm dev         # next dev with Turbopack -> fails
pnpm dev --webpack   # works (HTTP 200)
```

`node_modules/next` is a symlink into the pnpm global virtual store
(`~/.local/share/pnpm/store/v11/links/...` on Linux, `~/Library/pnpm/store/v11/links/...` on macOS),
i.e. its realpath is outside the project root, and Turbopack's dev build fails with
"Could not find the Next.js package (next/package.json)".
