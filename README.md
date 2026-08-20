# Repro: next#57392 — server action defined via hoisted function declaration is `undefined`

Next.js 16.3.1-canary.25 (Turbopack, App Router).

## Run

```
npm install
npm run dev   # open http://localhost:3000 and click "submit"
# or: node check.mjs   (playwright: prints the rendered <form> html)
```

## Actual

`app/page.jsx` references the `'use server'` function `foo` before its (hoisted)
declaration, which sits after `return`. The transform turns the declaration into
an assignment left after `return`, so only `var foo;` survives:

```js
function Page() {
    const el = jsx("form", { action: foo, ... });
    const x = 2;
    return el;
    //TURBOPACK unreachable
    ;
    var foo;
}
```

So `action` is `undefined`: React renders `<form><button type="submit">submit</button></form>`
with no action, submitting does a plain `GET /?` and the action never runs.
`next build` reports no error either.

## Expected

Works like plain JS (function declarations hoist): the action runs and receives `x === 2`.
