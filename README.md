# Repro: vercel/next.js#48681 — custom Error properties stripped before reaching `app/error.js`

Next.js `16.3.1-canary.25` (App Router).

## Run

```bash
npm install
npm run build && npm start   # production: http://localhost:3000
# or
npm run dev                  # dev: http://localhost:3000
```

Open the page; `app/error.js` prints the error object it received into `#received`.

## Observed

`app/page.js` throws `CustomError { message, name: 'CustomError', statusCode: 403, code: 'FORBIDDEN' }`.

- production: `error.js` gets `{ name: 'Error', message: 'Minified React error #441...', digest: '<hash>' }`, ownKeys `['digest']`
- dev: `error.js` gets `{ name: 'CustomError', message: 'boom from server component', digest }`, ownKeys `['name','environmentName','digest']`

In both modes `statusCode` and `code` are `undefined` on the client, so an error boundary cannot branch on server-provided error metadata.
