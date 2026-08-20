# Repro: symlinked `app` directory route 404s in `next dev` but works in `next build && next start`

Issue: https://github.com/vercel/next.js/issues/53175

`src/app/(features)/(test1)` is a symlink to `src/features/test1/app`, which contains `test1/page.tsx`.

## Steps

```bash
npm install
npm run dev      # visit http://localhost:3000/test1 -> 404 (Turbopack and --webpack)
npm run build    # build output lists route /test1
npm start        # visit http://localhost:3000/test1 -> 200 "hi from symlinked route"
```

Verified on next@16.3.1-canary.25 (Node 24).
