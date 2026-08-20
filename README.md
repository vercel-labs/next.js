# Repro: Next.js does not correctly respect `NODE_ENV` (vercel/next.js#19046)

Next.js 16.3.1 (Turbopack default), Node 24, pages router.

```bash
npm install

# 1) `NODE_ENV=development next build` fails
npm run build:dev-node-env
# Error: <Html> should not be imported outside of pages/_document.
# Export encountered an error on /, exiting the build. (exit code 1)
# plain `npm run build` succeeds

# 2) `NODE_ENV=production next dev` returns HTTP 500 for every page
npm run dev:prod-node-env
curl -s localhost:3000 > /dev/null
# server log: TypeError: {imported module [externals]/react/jsx-dev-runtime}.jsxDEV is not a function
```

Both commands also print
`You are using a non-standard "NODE_ENV" value in your environment...`
even though the values used are the two standard ones (they are only
non-standard for that particular command), which is the misleading
message called out in the issue.

`next build` loads `.env.production` and `next dev` loads `.env.development`
regardless of `NODE_ENV`, so `.env.*` selection already ignores `NODE_ENV`.
