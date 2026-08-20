# Repro: next#67296 — non-`NEXT_PUBLIC_` `.env` vars missing in Edge Middleware on Vercel

`.env` contains:

```
MY_SECRET=from-dotenv
NEXT_PUBLIC_MY_PUBLIC=public-from-dotenv
```

`middleware.js` (matcher `/mw`), `app/edge/route.js` (edge runtime) and
`app/node/route.js` (node runtime) all return the same env values as JSON.

## Local

```
npm install
npm run dev
curl localhost:3000/mw     # MY_SECRET = "from-dotenv"
curl localhost:3000/edge   # MY_SECRET = "from-dotenv"
curl localhost:3000/node   # MY_SECRET = "from-dotenv"
```

## Deployed to Vercel

```
curl https://<deployment>/mw     # {"MY_SECRET":null,...,"NEXT_PUBLIC_MY_PUBLIC":"public-from-dotenv"}
curl https://<deployment>/edge   # {"MY_SECRET":null,...}
curl https://<deployment>/node   # {"MY_SECRET":"from-dotenv",...}
```

Reproduced with Next.js 16.3.1 (issue originally filed on 14.2.4).

Note: `generate-env.js` (run from the `build` script) writes the `.env` file at
build time only because the upload pipeline used here strips `.env` files; it is
equivalent to committing a `.env` file to the repo.
