# next#93942 — `onClick` dead on iOS 15 (ES2022 `static {}` blocks in client bundles)

Minimal reproduction of https://github.com/vercel/next.js/issues/93942 with
next 16.2.6 / react 19.2.4.

The tapped-button symptom is a consequence of a parse failure: Next.js emits
ES2022 class static initialization blocks (`static { ... }`) into first-party
client chunks. iOS 15 Safari (needs Safari 16.4+) throws
`SyntaxError: Unexpected token '{'` while parsing the chunk, React never
hydrates, and no event handler is registered.

## Run

```bash
pnpm install
pnpm build && pnpm check    # production chunks
```

`pnpm check` parses each emitted client chunk with acorn at `ecmaVersion: 2021`
(the highest syntax level iOS 15 Safari supports) and fails on the offending
chunk. Observed with next 16.2.6:

```
FAIL (ES2021) .next/static/chunks/0wx.c~5-ry5jx.js: Unexpected token (1:47938)
  static block: ...class h extends o.default.Component{static{this.contextType=d.AppRouterContext}...
```

`pnpm dev` reproduces the same in dev: the served chunks
`.../_next/static/chunks/0z~i_next_dist_080cxwf._.js`,
`0z~i_next_dist_client_0o8274i._.js`,
`0z~i_next_dist_compiled_next-devtools_index_*.js` and the Turbopack runtime
chunk `turbopack-_*.js` all fail ES2021 parsing.

## Note

Adding `"browserslist": ["safari >= 15", "ios_saf >= 15"]` to package.json
removes the `static {}` blocks from the production chunks.
