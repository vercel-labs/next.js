# Repro: `pnpm unpack-next` does not work on Windows (vercel/next.js#82233)

Run:

```bash
node repro.mjs      # exits 0 when the Windows failure is reproduced
```

No dependencies. Works on any OS (on Linux/macOS it emulates cmd.exe argument
handling so the Windows-only failure is observable everywhere; on Windows the
same command fails natively).

## Root cause

`scripts/unpack-next.ts` builds a *shell string* with single-quoted paths:

```ts
exec(`Unpack ${key}`, `tar -xf '${TARBALLS}/${key}.tar' -C '${path}'`)
```

`scripts/pack-util.ts` `exec()` runs it via `child_process.execSync()`, whose
shell on Windows is `cmd.exe`. `cmd.exe` only treats `"` as a quoting character,
so the single quotes are passed through literally and Windows' bundled
`tar` (bsdtar/libarchive) fails:

```
tar: Error opening archive: Failed to open ''C:\...\tarballs\next.tar''
```

Fix direction: pass an argv array (`exec()` already supports
`execFileSync` for arrays) instead of a quoted shell string.

Two further problems the script has (also checked by `repro.mjs`):

* it only unpacks `node_modules/@next/swc`, but installed projects have a
  platform package such as `@next/swc-win32-x64-msvc`, so `next-swc.tar` is
  silently skipped;
* `node_modules/@next/bundle-anlyzer` is a typo, so that entry is always `null`.
