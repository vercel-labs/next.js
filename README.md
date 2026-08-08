# Reproduction: Turbopack build fails on Linux with glibc < 2.29 (RHEL 8 / Debian 10)

Issue: https://github.com/vercel/next.js/issues/96957

RHEL 8 ships glibc 2.28. `@next/swc-linux-x64-gnu@16.3.0` references `GLIBC_2.29`
and `GLIBC_2.30` symbols, so the native binding cannot be loaded. Next.js falls
back to the WASM bindings, and `next build` (Turbopack, the default) then aborts.

Debian 10 (buster) ships the identical glibc build (2.28-10+deb10u3), so it is used
here as a stand-in for RHEL 8.

## Run

```bash
docker build -t next-96957 .
docker run --rm next-96957            # Turbopack build -> fails
docker run --rm next-96957 npx next build --webpack   # succeeds (workaround)
```

## Expected

Turbopack build fails with a hard error. Verified on `next@16.3.0` and
`next@16.3.1-canary.8`.

```
⚠ Attempted to load @next/swc-linux-x64-gnu, but an error occurred: /lib/x86_64-linux-gnu/libm.so.6: version `GLIBC_2.29' not found (required by /app/node_modules/@next/swc-linux-x64-gnu/next-swc.linux-x64-gnu.node)
⚠ Attempted to load @next/swc-linux-x64-musl, but it was not installed
> Build error occurred
Error: Turbopack is not supported on this platform (linux/x64) because native bindings are not available. Only WebAssembly (WASM) bindings were loaded, and Turbopack requires native bindings.
```

`next build --webpack` completes successfully in the same container.
