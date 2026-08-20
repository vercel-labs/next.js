# Repro: barrel file re-exporting server-only + shared code breaks client import (#72851)

`features/Form/ui/Form.tsx` is a `"use client"` component. It imports `formUserSchema`
from `features/Form/model`, which imports `UserSchema` from the barrel `entities/User`
(`index.ts` re-exports `./model` and `./api`). Because the barrel also re-exports the
server-only `./api` module (`next/headers`), the whole barrel is pulled into the client
graph and compilation fails.

```
npm install
npm run dev   # visit http://localhost:3000 -> 500
```

Error (both Turbopack and `next dev --webpack`, Next 16.3.1-canary.25):

```
./entities/User/api/index.ts:1:1
Error: You're importing a module that depends on "next/headers". This API is only
available in Server Components in the App Router, but you are using it in the Pages Router.
```

Workaround from the report: import `@/entities/User/model` directly -> page returns 200.
