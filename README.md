# Repro: next/script `beforeInteractive` order (vercel/next.js#41282)

`pages/_document.jsx` renders 4 `beforeInteractive` scripts in order id-1 (src), id-2 (inline), id-3 (src), id-4 (inline).

Run:
```
npm install
npm run build && npm start   # http://localhost:3001
# or: npm run dev            # http://localhost:3000
curl -s localhost:3001 | grep -o 'id="id-[0-9]"'
```

Expected: id-1, id-2, id-3, id-4
Actual (Next 16.3.1-canary.25): id-2, id-4, id-1, id-3 — inline scripts hoisted above src scripts in `<head>`; browser console logs `inline-2, inline-4, src-one, src-three`.
