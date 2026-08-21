# Repro: next#81068 — multiple trailing slashes cause a redirect chain

```
npm install
npm run dev   # or: npm run build && npm start
curl -sL -D - -o /dev/null "http://localhost:3000/blog/hello////" | grep -Ei '^(HTTP|location)'
```

Observed (Next.js 16.3.1-canary.26, dev and prod):

```
308 -> location: /blog/hello/
308 -> location: /blog/hello
200
```

Expected: a single 308 straight to `/blog/hello`.
