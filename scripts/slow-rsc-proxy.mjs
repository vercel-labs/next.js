// A ~40-line HTTP/1.1 latency proxy that emulates a CPU-starved 2-core CI runner:
// it forwards everything to `next start` untouched, EXCEPT App Router `_rsc`
// prefetch responses, which it holds open for RSC_DELAY_MS (~4s). That keeps all
// of Chrome's 6 per-origin HTTP/1.1 sockets occupied — the condition a slow real
// server produces on its own. Plain HTTP/1.1 both ways, so the browser transport
// is the exact one under test. There is no HTTP/2 here on purpose: h2 multiplexes
// and the pool never exhausts, which is why the bug does not reproduce behind it.
import http from "node:http";

const LISTEN = Number(process.env.PROXY_PORT ?? 4320);
const UPSTREAM = Number(process.env.UPSTREAM_PORT ?? 4321);
const RSC_DELAY = Number(process.env.RSC_DELAY_MS ?? 4000);
const LOG = process.env.PROXY_LOG === "1";

const server = http.createServer((creq, cres) => {
  // An RSC prefetch is either a URL carrying the cache-busting `_rsc=` query or a
  // GET marked with the router's prefetch/RSC headers.
  const isRscPrefetch =
    creq.method === "GET" &&
    (creq.url.includes("_rsc=") ||
      creq.headers["rsc"] === "1" ||
      creq.headers["next-router-prefetch"] === "1");
  const delay = isRscPrefetch ? RSC_DELAY : 0;
  if (LOG) console.log(`${creq.method} ${creq.url.slice(0, 72)} -> hold ${delay}ms`);

  const proxyReq = http.request(
    { host: "127.0.0.1", port: UPSTREAM, method: creq.method, path: creq.url, headers: creq.headers },
    (pres) => {
      const forward = () => {
        cres.writeHead(pres.statusCode ?? 502, pres.headers);
        pres.pipe(cres);
      };
      if (delay > 0) setTimeout(forward, delay);
      else forward();
    },
  );
  proxyReq.on("error", () => {
    if (!cres.headersSent) cres.writeHead(502);
    cres.end("proxy upstream error");
  });
  creq.pipe(proxyReq);
});

// Keep-alive so the browser reuses (and thus contends over) its capped pool.
server.keepAliveTimeout = 60_000;
server.listen(LISTEN, () =>
  console.log(`slow-rsc-proxy  http://localhost:${LISTEN}  ->  :${UPSTREAM}  (hold _rsc ${RSC_DELAY}ms)`),
);
