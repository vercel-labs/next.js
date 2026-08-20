# Repro: conditional parallel routes render both slots (vercel/next.js#53292)

`app/layout.jsx` renders either `children` or the `@auth` slot. Only the returned
slot should execute, but both `page.jsx` files are rendered on the server.

```
npm install
npm run dev   # then curl http://localhost:3000/
```

Server log shows BOTH `[repro] RENDERED ...` lines.
