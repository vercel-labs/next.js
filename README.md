# Repro for vercel/next.js#32985

`getServerSideProps` exported but evaluating to `undefined` (e.g. a buggy HOC) makes the
dev server answer the `/_next/data/...json` request with **HTML** (`200 text/html`) instead
of JSON, and no warning/error is emitted.

## Run (Next.js 16.3.1)

```bash
npm install
npm run dev
# HOC that returns undefined
curl -i -H 'x-nextjs-data: 1' http://localhost:3000/_next/data/development/page3.json
# literal `export const getServerSideProps = undefined`
curl -i -H 'x-nextjs-data: 1' http://localhost:3000/_next/data/development/page-literal-undefined.json
# control: valid getServerSideProps -> {"pageProps":{},"__N_SSP":true}
curl -i -H 'x-nextjs-data: 1' http://localhost:3000/_next/data/development/page2.json
```

Observed: both undefined cases return `HTTP/1.1 200 OK`, `Content-Type: text/html`,
with a full HTML document body. Expected: JSON payload, or a clear error/warning that
`getServerSideProps` is not a function.

Production (`npm run build && npm start`): the pages are silently emitted as static (`○`)
and their data route 404s; no build-time warning either.
