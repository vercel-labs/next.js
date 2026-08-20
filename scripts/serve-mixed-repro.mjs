import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..", ".repro", "out-mixed");
const port = Number(process.env.REPRO_PORT || 8765);
// `next.config.ts` sets `basePath`, so the static export must be served from
// that prefix. Strip it before resolving files inside the exported output.
const basePath = "/assets/trip/next-test";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

function resolveRequestFile(pathname) {
  const decodedPathname = decodeURIComponent(pathname);
  if (decodedPathname !== basePath && !decodedPathname.startsWith(`${basePath}/`)) {
    return null;
  }
  const withoutBasePath = decodedPathname.slice(basePath.length);
  const relativePath = withoutBasePath.replace(/^\/+/, "");
  const directPath = resolve(root, relativePath || "index.html");

  if (directPath !== root && !directPath.startsWith(`${root}${sep}`)) {
    return null;
  }

  if (existsSync(directPath) && statSync(directPath).isFile()) {
    return directPath;
  }

  const directoryIndex = resolve(directPath, "index.html");
  if (
    directoryIndex.startsWith(`${root}${sep}`) &&
    existsSync(directoryIndex) &&
    statSync(directoryIndex).isFile()
  ) {
    // Intentionally serve the directory index without redirecting. This makes
    // the pathname chosen by Next.js directly visible in the address bar.
    return directoryIndex;
  }

  return null;
}

if (!existsSync(root)) {
  console.error("Missing .repro/out-mixed. Run `pnpm repro:build` first.");
  process.exit(1);
}

const server = createServer((request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);
  console.log(`${request.method} ${url.pathname}${url.search}`);

  const file = resolveRequestFile(url.pathname);
  if (!file) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "cache-control": "no-store",
    "content-type": contentTypes[extname(file)] || "application/octet-stream",
  });
  createReadStream(file).pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving mixed output at http://localhost:${port}${basePath}/`);
  console.log("Requests are logged exactly as received; directory URLs are not redirected.");
});
