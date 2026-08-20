# Repro: params encoding differs between page.tsx and route.ts (vercel/next.js#64952)

```
npm install
npm run dev
curl -s "http://localhost:3000/dynamic-page/%3F%2C%3D%2C%2F%2C%26%2C%D1%88%D0%B5%D0%BB%D0%BB%D1%8B" | grep -o 'pathParam[^<]*' | head -1
curl -s "http://localhost:3000/dynamic-route/%3F%2C%3D%2C%2F%2C%26%2C%D1%88%D0%B5%D0%BB%D0%BB%D1%8B"
```

Observed on next 16.3.1 (dev):
- page.tsx: `pathParam` = `%3F%2C%3D%2C%2F%2C%26%2C%D1%88%D0%B5%D0%BB%D0%BB%D1%8B` (raw, encoded)
- route.ts: `pathParam` = `?,=,/,&,шеллы` (decoded)
