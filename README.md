# Repro: unhelpful build error for accidental `app/icon.js`

Issue: https://github.com/vercel/next.js/issues/56941

`app/icon.js` is a Next.js metadata file convention. If a user creates it as a
regular React icon component, `next dev` renders pages fine, but `next build`
fails with an error pointing only to the generic
https://nextjs.org/docs/messages/prerender-error page — nothing mentions the
`icon.js` metadata convention.

## Run

```
npm install
npm run dev    # http://localhost:3000 renders fine (200)
npm run build  # fails
```

## Observed (next 16.3.1)

```
Error occurred prerendering page "/icon". Read more: https://nextjs.org/docs/messages/prerender-error
Error: No response is returned from route handler '[project]/app/icon--route-entry.js'. Expected a Response object but received 'Object' (method: GET, url: /icon).
Export encountered an error on /icon/route: /icon, exiting the build.
```
