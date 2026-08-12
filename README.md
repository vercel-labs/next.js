# Repro: Turbopack build panic hides NUL-byte env var spawn error behind CSS module

Upstream issue: https://github.com/vercel/next.js/issues/97265
Based on the reporter's repro (https://github.com/abdoufma/turbopack-nul-env-repro), with a
cross-platform launcher so it also reproduces on Linux/macOS.

`scripts/run-with-nul-env.cjs` replaces `process.env` with a plain object holding
`steam_master_ipc_name_override = "Remote\u0000"` (Linux/macOS cannot store a NUL byte in a real
env var; Windows can, which is how the reporter hit it), then runs the Next.js CLI.

## Run

```bash
npm install
node scripts/run-with-nul-env.cjs build --turbo    # TurbopackInternalError, blames app/globals.css
node scripts/run-with-nul-env.cjs build --webpack  # actionable Node ERR_INVALID_ARG_VALUE
```

Turbopack (next@16.3.1-canary.12):

```
Error [TurbopackInternalError]: Failed to write app endpoint /page
Caused by:
- [project]/app/globals.css [app-client] (css)
- creating new process
- spawning node pooled process
- nul byte found in provided data
```

Webpack:

```
TypeError: The property 'options.env['steam_master_ipc_name_override']' must be a string without null bytes. Received 'Remote\x00'
```

Env values reach Turbopack via `process.env` in
`packages/next/src/build/turbopack-build/impl.ts` (`env: process.env`) -> `rustifyEnv` ->
node pooled process spawn, where `std::process::Command` rejects the NUL byte without naming the
variable. The generated bug-report URL also reports `Next.js version: 0.0.0`.
