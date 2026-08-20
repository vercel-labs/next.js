# Reproduction for vercel/next.js#74109

`export const fetchCache = 'force-no-store'` does not override a fetch that passes
`{ cache: 'force-cache' }`.

## Run

```bash
npm install
npm run dev        # or: npm run build && npm start
curl -s localhost:3000 | grep -o '[a-z-]*=20[0-9-]*T[0-9:.]*Z'   # repeat 3x
```

## Expected

All three timestamps (`force-cache`, `no-store`, `default`) change on every request,
because the page declares `fetchCache = 'force-no-store'`.

## Actual

`force-cache=` stays frozen at the first value on every subsequent request, while
`no-store=` and `default=` update. Reproduced with next dev and next start on
16.3.1 and 15.0.3.
