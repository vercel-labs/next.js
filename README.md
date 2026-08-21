# Repro: next#82042 — `pages/send-money-to-[country]/[bank].js` swallows `/transactions/[id]`

A dynamic segment that has a static prefix (`send-money-to-[country]`) is compiled to a
fully-dynamic regex `^\/([^/]+?)\/([^/]+?)(?:\/)?$` (the `send-money-to-` prefix is dropped),
so it matches *any* two-segment URL, e.g. `/transactions/7089?type=IBP`.

## Run

```
npm install
npm run dev   # then visit http://localhost:3000
```

## Expected vs actual

| URL | expected page | actual |
|---|---|---|
| `/transactions/7089?type=IBP` | `transactions/[id]` | `send-money-to-[country]/[bank]` with `country=transactions`, `bank=7089` (Next 15.x, dev + `next start`) |
| `/send-money-to-india/hdfc-bank` | `country=india` | `country=send-money-to-india` (prefix not stripped, Next 15.x) |

On `next@canary` (16.3.1-canary.26) the **server** match is fixed, but a **client-side
navigation** still breaks: click the link on `/` (href `/transactions/7089?type=IBP`) and the
page renders `send-money-to-[country]/[bank]` with `country=send-money-to-transactions`.
The shared client helper still produces the wrong regex:

```
node -e "console.log(require('next/dist/shared/lib/router/utils/route-regex').getRouteRegex('/send-money-to-[country]/[bank]').re.source)"
# ^\/([^/]+?)\/([^/]+?)(?:\/)?$
```

To see the 15.x server-side behaviour, pin `"next": "15.4.4"`.
