# Repro attempt for vercel/next.js#83284

next/image with a local JPEG in `public/` — reported dev/build server crash (exit code 0) on Next.js 15.5.2.

## Run
```
npm install
npm run dev   # then request http://localhost:3000/ and /_next/image?url=%2FVC365.jpeg&w=96&q=75
npm run build && npm start
```

Result in a clean Linux x64 container (Node 24, 4 GB RAM, sharp 0.34 installed):
page 200, `/_next/image` 200 (342 bytes), dev server stays alive, `next build` succeeds.
Server only dies silently (`std::bad_alloc`, no Next.js error) when memory is constrained
(`ulimit -v 1200000`), which matches the reporter's "exit code 0" symptom.
