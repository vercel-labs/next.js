# Repro harness for vercel/next.js#94989

Server Actions + `proxy.ts` + `next build --experimental-build-mode compile` + `output: "standalone"`.

The reporter's repo (mrpackethead/nextjs-compile-mode-server-actions-repro) contains no
`src/proxy.ts`, which is the key ingredient of the report, so this harness adds it plus an
automated check.

```bash
npm install
bash verify.sh compile   # compile build mode
bash verify.sh full      # normal build, for comparison
```

Observed on next@16.2.6 and next@16.3.1-canary.26 (Node 24, linux x64):
`POST /` with the `Next-Action` id from `.next/server/server-reference-manifest.json`
returns **HTTP 200** with `{"message":"Server action works!"}` in both modes, and the
browser click flow also succeeds. Issue does not reproduce.

Note: the only 404s seen in compile mode came from `_next/static/chunks/*` when
`.next/static` was not copied into `.next/standalone` (required for `output: "standalone"`),
which breaks hydration so the button never fires the action.
