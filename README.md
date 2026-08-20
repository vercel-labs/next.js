# Repro: `__debugSource` / `__debugOwner` missing on Server Component fibers (next.js#59457)

App Router page renders one element from a Server Component (`#server-el`) and one from a
Client Component (`#client-el`). The client-side `Inspector` reads each DOM node's
`__reactFiber$` and logs `_debugSource`, `_debugOwner`, `_debugInfo`, `_debugStack`.

## Run

```bash
npm install
npm run dev
# open http://localhost:3000 and read the console / the <pre id="result"> block
```

## Observed

next@14.0.4 + react 18 (versions from the report):

```
server: { hasDebugSource: false, debugSource: null,  debugOwner: null }
client: { hasDebugSource: true,  debugSource: { fileName: ".../ClientBox.jsx", lineNumber: 4 }, debugOwner: "ClientBox" }
```

next@canary (16.3.x) + react 19:

```
server: { debugSource: undefined, debugOwner: null, debugInfo: [],  debugStack: present }
client: { debugSource: undefined, debugOwner: "ClientBox", debugInfo: null, debugStack: present }
```

React 19 removed `_debugSource` for every fiber, so on canary neither side has it;
`_debugOwner` is still `null` only for Server Component elements.

To check the canary combination instead:

```bash
npm install next@canary react@latest react-dom@latest
npm run dev
```
