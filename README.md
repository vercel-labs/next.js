# Reproduction for vercel/next.js#66398 — `next-forms` example fails after `create-next-app`

Files here are a verbatim copy of `examples/next-forms` as bootstrapped by
`npx create-next-app --example next-forms next-forms-app` (upstream `canary`),
plus a `variant-next14-react18/package.json` that pins the dependency versions the
example shipped when the issue was filed.

## A. Current example: type check / `next build` fails

```bash
npm install            # next@canary (16.x), react/react-dom "rc" -> 19.2.x, @types/react 18.2.46
npx tsc --noEmit       # or: npm run build
```

Observed:

```
app/add-form.tsx(3,10): error TS2305: Module '"react"' has no exported member 'useActionState'.
app/delete-form.tsx(3,10): error TS2305: Module '"react"' has no exported member 'useActionState'.
Failed to type check.
```

Cause: `package.json` still pins `@types/react@18.2.46` / `@types/react-dom@18.2.18`
while `react`/`react-dom` resolve to 19.x, so `useActionState` is untyped and
`next build` (type check) fails out of the box.

`next dev` itself works: with a Postgres database the page renders, submitting the
form adds a todo and no client console errors are logged.

## B. Original report (deps the example had in May 2024)

```bash
cp variant-next14-react18/package.json package.json
rm -rf node_modules .next && npm install
POSTGRES_URL=postgres://user@host:5432/db npm run dev
# open http://localhost:3000
```

Observed (HTTP 500):

```
⨯ TypeError: (0 , react__WEBPACK_IMPORTED_MODULE_1__.useActionState) is not a function or its return value is not iterable
    at AddForm (./app/add-form.tsx:33:86)
```

## Database

```sql
CREATE TABLE todos (id SERIAL PRIMARY KEY, text TEXT NOT NULL);
```

Set `POSTGRES_URL` (the example connects with `ssl: "allow"`, so the server must accept SSL).
