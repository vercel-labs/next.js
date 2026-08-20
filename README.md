# Reproduction: `next/image` srcSet ignores absolute px values in `sizes` (vercel/next.js#27547)

The image can never render wider than 280px CSS (840px at DPR 3), yet the generated
`srcset` contains every configured `deviceSizes`/`imageSizes` entry up to 3840w.

## Run

```bash
npm install
npm run dev   # http://localhost:3000
# or: npm run build && npm start
node check-srcset.mjs   # prints the srcset candidates and the ones above 840w
```
