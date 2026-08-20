# Reproduction for vercel/next.js#58459

`npm install && npm run dev`, then:

- `curl -i http://localhost:3000/api/enoent` — module-scope error with `error.code === "ENOENT"`.
  On next@14.0.3-canary.8 this returned a **silent 404** (no server log).
  On next@16.3.1-canary.25 it returns **500** and the error is logged. Original bug fixed.
- `curl -i http://localhost:3000/api/hello` — the reporter's pdfmake case.
  On 14.0.3-canary.8: 404. On 16.3.1-canary.25: **500** with
  `ENOENT: no such file or directory, open '.../@foliojs-fork/fontkit/data.trie'`
  (same with `npm run dev:webpack`). So the route still does not return 200 unless
  `serverExternalPackages: ["pdfmake"]` is set in `next.config.js` (see commented line).
