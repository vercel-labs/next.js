# Check for vercel/next.js#46126 — camelCase pages/api route on Vercel

Minimal Pages Router app with `pages/api/getAll.js` (camelCase) and `pages/api/lower.js`.

Run:
    npm install && npm run build && npm start
    curl -i localhost:3000/api/getAll

Result (next@canary, local prod build and a Vercel deployment):
- `/api/getAll` -> 200 `{"route":"/api/getAll","ok":true}`
- `/api/getall` -> 404 (routing is case-sensitive, as expected)

The reported failure does not reproduce. In the reporter's repo the committed file is
`pages/api/tweets/getall.js` (all lowercase) while the client fetched `/api/getAll`,
i.e. git on a case-insensitive filesystem never recorded the rename.
