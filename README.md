# Repro: vercel/next.js#86511 — `Failed to parse postponed state` / `Z_BUF_ERROR`

Minimal app: one PPR route (`app/page.tsx`, static shell + Suspense hole) with
`cacheComponents: true` (which sets `experimental.ppr`).

```bash
npm install
npm run build
bash repro.sh
```

`repro.sh` starts `next start` the way a deployment runs it
(`NEXT_PRIVATE_MINIMAL_MODE=1`, plus `NEXT_PRIVATE_TEST_HEADERS=1` so the local
router does not strip the internal `next-resume` / `x-matched-path` headers that
a platform proxy would set) and sends two POSTs whose body is *not* a valid
postponed state.

Both are answered `200`, but the server logs:

```
Failed to parse postponed state {
  stateLength: 3, errorName: 'Error', errorCode: undefined, hasLengthPrefix: false
}
Failed to parse postponed state {
  stateLength: 47, errorName: 'Error', errorCode: 'Z_BUF_ERROR',
  hasLengthPrefix: true, declaredPostponedLength: 4,
  postponedStringComplete: true, resumeDataCacheTailLength: 41,
  resumeDataCacheTailIsNull: false
}
```

i.e. `stateLength` is exactly the length of the client-supplied body: Next treats
an arbitrary request body as the PPR postponed state, and a truncated/invalid
deflate tail yields the `Z_BUF_ERROR: unexpected end of file` line from the
issue. The render then silently falls back to a full dynamic render.
