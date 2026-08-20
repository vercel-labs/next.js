# Repro: partial Suspense key change blocks navigation (vercel/next.js#67484)

Two server components each wrapped in `<Suspense key={searchParam}>`; each awaits a 3s API route.

```
npm install
npm run dev
# open http://localhost:3000/?key1=1&key2=2
```

Click "Refresh via router (both)" -> URL updates immediately, both fallbacks show.
Click "Refresh via router key 1" (only one search param changes) -> the URL does not
change and the UI is blocked for the full 3s fetch; no fallback is shown while waiting.

`node measure.mjs` (needs `npm i playwright`) prints, for each button, how long after the
click the URL changed and the `loading...` fallback appeared.
