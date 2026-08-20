# Reproduction for vercel/next.js#51870

`RangeError: WebAssembly.instantiate(): Out of memory: wasm memory` when the process
runs with a limited virtual-memory address space (`ulimit -v`), as on cPanel/CloudLinux
shared hosting.

## Run

```bash
npm install
bash repro.sh          # or: bash -c 'ulimit -v 2048000; npx next build'
```

## Result (next@16.3.1-canary.25, Node 24.17.0, Linux x64)

* Without the limit: `next build` succeeds.
* With `ulimit -v 2048000`:
  * `next build` -> `unhandledRejection RangeError: WebAssembly.instantiate(): Out of memory: Cannot allocate Wasm memory for new instance`, exit code 1.
  * `next dev` -> same error, process exits before the server listens (curl returns 000).
  * Failing frame: `lazyllhttp (node_modules/next/dist/compiled/@edge-runtime/primitives/load.js)` — the
    llhttp WebAssembly module of the bundled `undici` fetch implementation.

Docker alternative (matches the original report):

```bash
docker run --rm -it -v "$PWD":/app -w /app node:20-alpine \
  sh -c 'npm install && (ulimit -v 2048000; npx next build)'
```
