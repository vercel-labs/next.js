# Repro: next.config redirects (and middleware/proxy redirects) are not logged (#83364)

```
npm install
npm run dev
curl -sI http://localhost:3000/old                                        # 307 -> /new
curl -sI --connect-to nextjsrocks.com:3000:localhost:3000 http://nextjsrocks.com:3000/asdf  # 308 -> external
curl -sI http://localhost:3000/redirectMe                                  # 307 via middleware
curl -s  http://localhost:3000/ http://localhost:3000/nope                 # 200 / 404
```

Observed on next@16.3.1-canary.26 (Turbopack dev): only `GET / 200` and `GET /nope 404`
appear in the dev server output. None of the three redirect responses are logged, even
though docs state all incoming requests are logged in development.
