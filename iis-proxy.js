// Minimal model of "IIS URL Rewrite / ARR -> http://127.0.0.1:3000" with an
// output cache that keys on the URL path only and ignores the `Vary` header
// (and the RSC / _rsc query marker) that Next.js sends on App Router responses.
const http = require("http");

const UPSTREAM = { host: "127.0.0.1", port: 3000 };
const IGNORE_VARY = process.env.IGNORE_VARY !== "0"; // 1 = broken IIS-like cache
const cache = new Map();

http
  .createServer((req, res) => {
    const path = req.url.split("?")[0];
    const key = path;

    if (IGNORE_VARY && cache.has(key)) {
      const hit = cache.get(key);
      console.log(`CACHE HIT  ${req.method} ${req.url} -> ${hit.headers["content-type"]}`);
      res.writeHead(hit.status, { ...hit.headers, "x-proxy-cache": "HIT" });
      res.end(hit.body);
      return;
    }

    const proxyReq = http.request(
      { ...UPSTREAM, method: req.method, path: req.url, headers: { ...req.headers, host: `127.0.0.1:3000` } },
      (upRes) => {
        const chunks = [];
        upRes.on("data", (c) => chunks.push(c));
        upRes.on("end", () => {
          const body = Buffer.concat(chunks);
          const headers = { ...upRes.headers };
          delete headers["transfer-encoding"];
          delete headers["content-encoding"];
          delete headers["content-length"];
          console.log(
            `MISS       ${req.method} ${req.url} rsc=${req.headers.rsc || "-"} -> ${headers["content-type"]} vary=${headers["vary"] || "-"}`
          );
          if (req.method === "GET" && upRes.statusCode === 200) {
            cache.set(key, { status: upRes.statusCode, headers, body });
          }
          res.writeHead(upRes.statusCode, { ...headers, "x-proxy-cache": "MISS" });
          res.end(body);
        });
      }
    );
    proxyReq.on("error", (e) => {
      res.writeHead(502).end(String(e));
    });
    req.pipe(proxyReq);
  })
  .listen(8080, () => console.log("proxy on http://127.0.0.1:8080 IGNORE_VARY=" + IGNORE_VARY));
