# Repro for vercel/next.js#60398

Conditional dynamic `import()` of a server-only module (one that imports
`next/headers`) still triggers the "next/headers in a Client Component"
build error, even though the import is guarded by
`typeof window === 'undefined'` and is never evaluated in the browser.

## Run

```bash
npm install
npm run build   # or: npm run dev  and open http://localhost:3000
```

## Expected

Build succeeds; the `next/headers` module is only pulled into the server
bundle since the dynamic import is unreachable in the browser.

## Actual

Build fails on `src/lib/serverUtils.js`, because the client graph statically
includes both branches of the conditional dynamic import.
