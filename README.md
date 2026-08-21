# Repro for vercel/next.js#87877

`createMoveSuffixStream()` (used by `continueFizzStream` and the prerender/resume
pipelines) only detects `</body></html>` when the whole 14-byte sequence is inside a
single chunk. If it spans two chunks, the sequence passes through unchanged and the
`flush()` handler appends another copy, producing `</body></html></body></html>`.

This repro drives the *published* pipeline (`next@16.1.1-canary.7`,
`next/dist/server/stream-utils/node-web-streams-helper.js` -> `continueFizzStream`),
so no monorepo build is needed.

## Run

```
npm install
npm run repro
```

## Output

```
single chunk        "<html><body>Hello</body></html>"
split same tick     "<html><body>Hello</body></html>"
split across ticks  "<html><body>Hello</body></html></body></html>"
split at tag bound  "<html><body>Hello</body></html></body></html>"
```

Notes:
- `createBufferedTransformStream()` coalesces chunks enqueued in the same tick, which
  is why the "split same tick" case is fine and why a normal React Fizz render does not
  hit this today (a real dev/prod app response on this version contains exactly one
  `</body>` and one `</html>`).
- The bug is reachable whenever the closing tags arrive in separate flushes, e.g. the
  third case above where `</body>` and `</html>` arrive as separate chunks in
  separate ticks.
