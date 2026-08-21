# Repro: Next.js App Router page responds 200 to unsupported HTTP methods (#78070)

App with a single `app/page.tsx` and **no** `route.ts`.

## Run

```bash
npm install
# dev
npm run dev            # :3000
# prod
npm run build && npm start -- -p 3001
bash test.sh 3000      # dev results
bash test.sh 3001      # prod results
```

## Observed (next@16.3.1-canary.26, Node 24)

| request                                   | dev  | prod |
| ----------------------------------------- | ---- | ---- |
| `POST` no body                            | 200  | 405  |
| `POST` `content-type: application/json`   | 200  | 405  |
| `POST` `application/x-www-form-urlencoded`| 200  | 200 (`x-nextjs-cache: HIT`) |
| `POST` `multipart/form-data`              | 404 (`x-nextjs-action-not-found: 1`) | 404 |
| `PATCH` / `DELETE`                        | 200  | 405  |

Every 200 returns the full prerendered GET HTML document (`<h1>hello</h1>`).
Expected: `405 Method Not Allowed` with `Allow: GET, HEAD`.
