# Reproduction: next.js issue #66305

Minimal app using the exact `x-forwarded-for` snippet from the (now-removed) docs
section `headers()` -> "IP Address".

## Run

```
npm install
npm run dev
# honest request
curl -s localhost:3000 | grep -o '"documentedIp": "[^"]*"'
# spoofed request
curl -s -H 'X-Forwarded-For: 6.6.6.6' localhost:3000 | grep -o '"documentedIp": "[^"]*"'
```

The spoofed leftmost segment is returned as the "client IP".

## Behind a proxy that APPENDS to X-Forwarded-For (AWS ALB behaviour)

```
npm run build && npm start &
node alb-like-proxy.js &
curl -s -H 'X-Forwarded-For: 6.6.6.6' localhost:4000/api/ip
# {"documentedIp":"6.6.6.6","x-forwarded-for":"6.6.6.6, ::1", ...}
```

The documented snippet reports `6.6.6.6` (attacker supplied) while the real
client IP is the *rightmost* entry (`::1`). Any rate-limiting / geo / audit /
allow-list logic built on this snippet is bypassable.

Note: on Vercel the platform overwrites `x-forwarded-for` with the real client
IP, so the spoof does not work there; the snippet is only safe when the number
of trusted proxies is known.
