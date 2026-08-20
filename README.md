# Repro: vercel/next.js#50163 — setting a cookie in a Server Action re-renders the whole app

Next.js 16.3.1-canary.25, React 19.2.0.

```bash
npm install
npm run dev     # http://localhost:3000
# or: npm run build && npm run start   (http://localhost:3001)
node test.mjs http://localhost:3000    # requires playwright installed
```

The root layout and page print a per-render counter and a random id.

* Clicking **action WITHOUT cookies** -> layout/page ids unchanged (no server re-render).
* Clicking **action WITH cookies** (`cookies().set(...)`) -> layout AND page ids change,
  i.e. the entire tree, including the root layout that never reads cookies, is
  re-rendered on the server and streamed back with the action response.

Observed on both `next dev` and `next start` (page is statically prerendered but is
re-rendered at request time after the cookie-setting action). Client component state is
preserved, so the DOM is not remounted.
