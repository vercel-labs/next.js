# Repro: vercel/next.js#82527 — cloneElement in a client component receives a React.lazy

`app/page.js` renders, inside a `<Suspense>` boundary, a server component that renders a
client component (`app/cloner.js`) which calls `cloneElement(children)` on another client
component. One string prop is 4000 chars long, which pushes the Flight row past React's
`MAX_ROW_SIZE = 3200`, so the `children` element is deferred/outlined and serialized as a
lazy reference (`$L`).

## Run

```bash
npm install
npm run build
npm start
# then: curl http://localhost:3000
```

## Observed (next >= 15.4.1, incl. 16.3.1)

Server log:

```
[Cloner] children is NOT a valid element, $$typeof = Symbol(react.lazy)
 ⨯ [Error: Element type is invalid: expected a string (for built-in components) or a
   class/function (for composite components) but got: undefined.] { digest: '...' }
```

The response only contains the Suspense fallback; nothing is cloned.

## Expected

`children` is a `Symbol(react.transitional.element)` and `cloneElement` works — the
behavior on next 15.4.0 and earlier (`<b data-cloned="yes">hello</b>` is rendered).

Version matrix (verified locally with this exact app):
15.4.0 = OK, 15.4.1 = broken, 15.4.6 = broken, 16.3.1 = broken.
Reproduces with `next dev` too when the row-size threshold is exceeded via a long prop.
