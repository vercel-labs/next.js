# Turbopack: unquoted reserved words as property keys (next.js#89808)

The reporter's linked repo (`veniceai/turbopack-safari-reserved-words-repro`) returns
404 (private/deleted), so this is a minimal re-creation.

`lib/reserved.js` mimics ajv's `codegen/scope.js`:

```js
export const varKinds = { const: "const", let: "let", var: "var" };
export const memberExpr = varKinds.var + varKinds.const + varKinds.let;
```

## Run

```bash
npm install
npx next build --turbopack   # Turbopack production build
npm run verify               # scans .next/static/**/*.js for unquoted reserved-word keys
```

`verify.mjs` exits 1 and prints the offending chunk snippets.

## Observed (next@16.2.0-canary.35, browserslist = safari 15 / ios_saf 15)

Turbopack chunk:

```js
let r={const:"const",let:"let",var:"var"},s=r.var+r.const+r.let
```

The same build with `npx next build --webpack` produces the identical unquoted
output, so the ES3 `PropertyLiterals` / `MemberExpressionLiterals` exclusion in
`turbopack-ecmascript/src/transform/mod.rs` is not the only factor.
