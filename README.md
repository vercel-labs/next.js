# Reproduction for vercel/next.js#74793

Passing the same object reference to a client component prop and to a server
component child turns the server subtree lazy in `next dev`.

## Run

```bash
npm install
npm run dev
# open http://localhost:3000
```

`InternalClientComponent` (a client component rendered by `ServerComponent`)
prints `children.$$typeof`.

- `/`            -> `Symbol(react.lazy)`  (bug)
- `/no-data`     -> `Symbol(react.transitional.element)` (object not passed to client comp)
- `/primitive`   -> `Symbol(react.transitional.element)` (primitive data)

`next build` / `next start` renders `Symbol(react.transitional.element)` on all routes.
