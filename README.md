# repro: basePath/assetPrefix asset URLs (Next 14.2.35, output: standalone)

```
npm install
npx next build
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
cd .next/standalone && PORT=3100 node server.js
curl http://localhost:3100/myapp
```

Observed on 14.2.35:
- metadata icons render unprefixed: `<link rel="icon" href="/favicon.ico">`, `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` (both 404; only /myapp/favicon.ico is 200)
- next/image string src `/logo.png` -> `/myapp/_next/image?url=%2Flogo.png&w=...` which returns 400 "The requested resource isn't a valid image."
- next/image static import -> `url=%2Fmyapp%2F_next%2Fstatic%2Fmedia%2Flogo.*.png` -> 200
