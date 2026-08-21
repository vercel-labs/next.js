# Repro: vercel/next.js#84864 — patched dev `console.*` serializes args, throws / loses data

`next dev` patches `console.log` (`next-devtools/userspace/app/forward-logs.ts`)
and runs every argument through `preLogSerializationClone` + `safe-stable-stringify`
before calling the real console method. `patchConsoleMethod` does **not** wrap the
wrapper in `try/catch`, so anything that throws while inspecting an argument
throws out of the user's `console.log` call and the log is never printed.

## Run

```bash
npm install
npm run dev   # then open http://localhost:3000
```

The page logs 8 cases from a client component `useEffect`; anything that throws
out of `console.log` is rendered on the page as `CASE-n THREW: ...`.

## Observed

next@16.3.1-canary.26 (current canary):

| case | browser console | forwarded terminal log |
| --- | --- | --- |
| 1 plain object | `{a: 1, b: 'two'}` | `{ a: 1, b: 'two' }` |
| 2 `{ big: 123n }` | ok | `{ big: 123 }` (bigint flattened) |
| 3 class instance `Foo {x, y}` | ok | `[object Object]` (all fields lost) |
| 4 `document.body` | ok | `[object HTMLBodyElement]` |
| 5 `Map`/`Set` | ok | `[object Map] [object Set]` |
| 6 tRPC v11 proxy client | ok | `[Unable to view]` |
| 7 revoked `Proxy` | **nothing — `console.log` throws** | nothing |
| 8 sanity log | ok | ok |

Case 7 throws out of `console.log`:

```
TypeError: Cannot perform 'getPrototypeOf' on a proxy that has been revoked
    at [Symbol.hasInstance] (<anonymous>)
    at Array.map (<anonymous>)
    at createLogEntry (.../next/dist/next-devtools/userspace/app/forward-logs.js)
    at console.log (.../next-devtools/shared/forward-logs-shared.js)
    at Client.useEffect (app/client.tsx)
```

It also throws with a **default** `next.config.js` (no `logging.browserToTerminal`),
because the console methods are patched whenever the dev MCP server is on.

next@16.0.0-canary.4 (version in the report) throws for three of the cases:

```
CASE-2 bigint     THREW: TypeError: Do not know how to serialize a BigInt
CASE-6 trpc-proxy THREW: TypeError: client[procedureType] is not a function
CASE-7 revoked    THREW: TypeError: Cannot perform 'get' on a proxy that has been revoked
```

## Expected

The original `console.*` call must always run (browser output must never be
affected by log forwarding), i.e. the forwarding wrapper should be wrapped in
`try/catch`, and non-plain objects should be summarized instead of degraded to
`[object Object]`.
