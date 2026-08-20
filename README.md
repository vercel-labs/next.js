# Repro: issue #68054 — client component `child.type.name` is empty in a Server Component

`React.Children.map` in a Server Component sees `'use client'` children as client
references, whose function has `name === ''` and `$$typeof === Symbol(react.client.reference)`.

## Run

```bash
npm install
npm run dev
# open http://localhost:3000  (see <pre id="out">)
```

## Observed (next 16.3.1 / react 19.2.8)

```
{"typeof":"function","name":"","$$typeof":"Symbol(react.client.reference)","isItem":true,"isServerItem":false}
{"typeof":"function","name":"ServerItem","isItem":false,"isServerItem":true}
```

Reference equality (`child.type === Item`) still works; only the name/displayName is lost.
