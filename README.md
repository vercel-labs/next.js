# Repro: Next.js expands `$` inside single-quoted .env values (#59957)

.env:
```
RAW_SYMBOL='111$11111'
WITH_SYMBOL=111$11111
DOUBLE_SYMBOL="111$11111"
MONGO_URL='mongodb://user:pa$ssword&more@example.com'
```

Run:
```
npm install
npm run dev
curl -s localhost:3000
```

Actual (next@16.3.1-canary.25): every value is variable-expanded, including the
single-quoted ones — `RAW_SYMBOL`/`WITH_SYMBOL`/`DOUBLE_SYMBOL` all become `111`
and `MONGO_URL` becomes `mongodb://user:pa&more@example.com`.

Expected (dotenv semantics): single-quoted values are literal, so `RAW_SYMBOL`
should stay `111$11111` and `MONGO_URL` should keep `pa$ssword`.
