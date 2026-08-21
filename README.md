# Repro: modules shared between `instrumentation.ts` and app code are duplicated on the server (`instanceof` fails)

Issue: https://github.com/vercel/next.js/issues/87614

The reporter saw `instanceof CustomApiError` return `false` inside Sentry's `beforeSend`
(defined in `sentry.server.config.ts`, loaded from `instrumentation.ts`) while returning
`true` in the Server Component that threw the error.

This repro removes Sentry entirely: `errors.js` is imported by both `instrumentation.js`
and `app/page.js`. Next.js compiles the instrumentation entry separately from the app
server entry, so `errors.js` is **evaluated twice** and the exported class has two
distinct identities, breaking `instanceof` across the boundary.

## Steps

```bash
npm install
npm run dev   # or: npm run build && npm start
curl localhost:3000
```

## Actual output (Next.js 16.3.1-canary.26, `next dev` and `next start`)

```
[errors.js] evaluated, load #1
[instrumentation] registered, errors.js load #1
[errors.js] evaluated, load #2
[page] page errors.js load index: 2
[page] instrumentation errors.js load index: 1
[page] err instanceof (page CustomApiError): true
[page] err instanceof (instrumentation CustomApiError): false
[page] same class reference: false
```

## Expected

`errors.js` should be a single module instance on the Node.js server, so
`same class reference: true` and both `instanceof` checks `true`.

Also confirmed with the reporter's original Sentry repro on Next.js 14.2.4 (`next dev`):
`Step 1: instanceof true`, `Step 2 (beforeSend): instanceof false`.
