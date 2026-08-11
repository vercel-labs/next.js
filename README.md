# Reproduction: next.js#80051 — wrong status code in Pages Router authentication docs

The Pages Router docs ("Creating a Data Access Layer (DAL)" → "Protecting API Routes")
return **401 Unauthorized** when an *authenticated* user lacks the `admin` role.
The equivalent App Router "Route Handlers" example in the same source doc returns **403**.

`pages/api/route.js` contains the docs snippet verbatim (only a `getSession` stub added).

```bash
npm install
npm run dev            # or: npm run build && npm start
node verify.mjs
```

Observed:

```
session=none  -> 401 {"error":"User is not authenticated"}
session=user  -> 401 {"error":"Unauthorized access: User does not have admin privileges."}  # should be 403
session=admin -> 200 {"ok":true}
```

Source of the inconsistency (docs/01-app/02-guides/authentication.mdx, from which
docs/02-pages/02-guides/authentication.mdx is generated):

- app Route Handlers example: `status: 401` for no session, `status: 403` for non-admin
- Pages API Routes example: `status(401)` for both cases
