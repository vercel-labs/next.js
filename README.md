# Repro: vercel/next.js#72525 — `does not satisfy the constraint 'ParamCheck<RouteContext>'`

App Router route handler whose exported `POST` is an **overloaded** function type
(the exact shape returned by `startServerAndCreateNextHandler` from
`@as-integrations/next` / Apollo Server) fails `next build` type checking.
Third-party packages are inlined as plain types, so this repro has no extra deps.

## Run

```bash
npm install
npm run build
```

## Result

Fails on Next 15.x and on `next@canary` (16.3.1-canary.25):

```
.next/types/validator.ts(63,31): error TS2344: Type 'typeof import(".../app/api/gql/route")'
does not satisfy the constraint 'RouteHandlerConfig<"/api/gql">'.
  Types of property 'POST' are incompatible.
    Type 'ApolloNextHandler' is not assignable to type
    '(request: NextRequest, context: { params: Promise<{}> }) => ...'
```

On Next 15.0.3 the same code reports the message from the issue:

```
Type error: Route "app/api/gql/route.ts" has an invalid "POST" export:
  Type "undefined" is not a valid type for the function's second argument.
    Expected "RouteContext", got "undefined".
```

The same code type checks and builds fine on `next@14.2.23` (exit code 0).

TypeScript resolves only the **last** overload signature for the second
parameter (`res?: undefined` / `NextApiResponse`), so the route validator
rejects the export even though the handler is callable with a single argument
at runtime.
