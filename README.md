# Repro: vercel/next.js#91692

`next/font/google` `Montserrat_Underline` logs "Failed to find font override values for font `Montserrat Underline`"
because `next/dist/server/capsize-font-metrics.json` still keys the family under the old name `montserratSubrayada`.

## Run

```bash
npm install
npm run dev   # or: npm run build
```

Expected: no warning, size-adjust fallback generated.
Actual (next@16.3.1):

```
warn ./
Warning: Failed to find font override values for font `Montserrat Underline`
Skipping generating a fallback font.
```

Data check:

```bash
node -e "const m=require('next/dist/server/capsize-font-metrics.json');console.log('montserratUnderline' in m, 'montserratSubrayada' in m)"
# false true
node -e "const f=require('next/dist/compiled/@next/font/dist/google/font-data.json');console.log(!!f['Montserrat Underline'])"
# true
```

Same class of failure for `Google Sans`, `Google Sans Flex`, `Google Sans Code`, `Atkinson_Hyperlegible_Next`/`Mono`
(present in font-data.json, missing from the capsize metrics table).
