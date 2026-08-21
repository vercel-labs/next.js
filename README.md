# Repro: `pnpm unpack-next` fails on Windows due to POSIX-quoted tar paths

Upstream issue: https://github.com/vercel/next.js/issues/87833

## Root cause

`scripts/unpack-next.ts` (canary) builds a **shell string** with POSIX single quotes:

```ts
exec(`Unpack ${key}`, `tar -xf '${TARBALLS}/${key}.tar' -C '${path}'`)
```

`exec()` in `scripts/pack-util.ts` forwards the string to `child_process.execSync`,
which uses `/bin/sh` on POSIX (single quotes are stripped) but
`cmd.exe /d /s /c` on Windows. `cmd.exe` only understands double quotes, so
Windows `tar.exe` receives a path that literally begins and ends with an
apostrophe and fails:

```
tar: Error opening archive: Failed to open 'D:\...\tarballs\next.tar'
```

`scripts/pack-next.ts` is unaffected because it passes argv arrays
(`execFileSync`) instead of shell strings.

## Run

```bash
node repro.mjs   # or: npm run repro
```

No dependencies; only Node and a `tar` binary are required.

## What it does

`fake-cmd.mjs` is a tiny shim that emulates Windows argument handling
(`cmd.exe` + MSVCRT: double quotes stripped, single quotes literal) and is
passed to `execSync` via the `shell` option. The script then runs the exact
command string `unpack-next.ts` produces through three paths:

1. Windows semantics -> **FAILS** (tar cannot open `'...next.tar'`)
2. POSIX semantics (`/bin/sh`) -> passes (why macOS/Linux/CI never hit this)
3. argv array form, no manual quoting -> passes (proposed fix)

Exit code is 0 when the bug is reproduced (1 fails, 2 and 3 pass).

### Expected output

```
[FAIL] 1. Windows semantics (cmd.exe/tar.exe: single quotes are literal): ...
[PASS] 2. POSIX semantics (/bin/sh strips the single quotes)
[PASS] 3. Proposed fix: argv array, no manual quoting

Bug reproduced: YES (windows=fail, posix=pass, fixed=pass)
```
