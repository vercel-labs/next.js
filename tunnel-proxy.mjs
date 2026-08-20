// Mimics a GitHub Codespaces / VS Code dev tunnel port forward:
// the tunnel sets `x-forwarded-host` to the public tunnel hostname while the
// browser's `Origin` reaching the Next.js server stays `localhost:3000`.
import http from "node:http";

const TUNNEL_HOST = process.env.TUNNEL_HOST ?? "abc123-3000.use.devtunnels.ms";
const TARGET_PORT = Number(process.env.TARGET_PORT ?? 3000);
const LISTEN_PORT = Number(process.env.PORT ?? 4000);

http
  .createServer((req, res) => {
    const headers = { ...req.headers, host: `localhost:${TARGET_PORT}` };
    headers["x-forwarded-host"] = TUNNEL_HOST;
    headers["x-forwarded-proto"] = "https";
    if (headers.origin) headers.origin = `http://localhost:${TARGET_PORT}`;
    const upstream = http.request(
      { host: "127.0.0.1", port: TARGET_PORT, method: req.method, path: req.url, headers },
      (up) => {
        res.writeHead(up.statusCode ?? 500, up.headers);
        up.pipe(res);
      }
    );
    upstream.on("error", (e) => {
      res.writeHead(502);
      res.end(String(e));
    });
    req.pipe(upstream);
  })
  .on("upgrade", (req, socket, head) => {
    const headers = { ...req.headers, host: `localhost:${TARGET_PORT}` };
    const up = http.request({ host: "127.0.0.1", port: TARGET_PORT, method: req.method, path: req.url, headers });
    up.on("upgrade", (upRes, upSocket, upHead) => {
      socket.write(
        `HTTP/1.1 101 Switching Protocols\r\n` +
          Object.entries(upRes.headers).map(([k, v]) => `${k}: ${v}`).join("\r\n") +
          "\r\n\r\n"
      );
      if (upHead?.length) socket.write(upHead);
      upSocket.pipe(socket).pipe(upSocket);
    });
    up.on("error", () => socket.destroy());
    up.end(head);
  })
  .listen(LISTEN_PORT, () =>
    console.log(`tunnel proxy on http://localhost:${LISTEN_PORT} -> localhost:${TARGET_PORT} (x-forwarded-host: ${TUNNEL_HOST})`)
  );
