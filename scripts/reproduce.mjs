import { createServer } from "node:http";
import { cp, mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const html = await readFile("out/index.html", "utf8");
const image = html.match(/<img[^>]*alt="Public logo"[^>]*src="([^"]+)"/);
if (!image) throw new Error("Could not find the next/image output in out/index.html");

const hostRoot = await mkdtemp(path.join(tmpdir(), "next-96094-"));
await cp("out", path.join(hostRoot, "bug"), { recursive: true });

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    let file = path.join(hostRoot, pathname);
    const details = await stat(file);
    if (details.isDirectory()) file = path.join(file, "index.html");
    response.writeHead(200, { "content-type": file.endsWith(".html") ? "text/html" : "application/octet-stream" });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const origin = `http://127.0.0.1:${port}`;

try {
  const pageStatus = (await fetch(`${origin}/bug/`)).status;
  const emittedSrc = image[1];
  const browserRequestStatus = (await fetch(`${origin}${emittedSrc}`)).status;
  const deployedAssetStatus = (await fetch(`${origin}/bug/logo.svg`)).status;

  console.log(`Next.js: ${packageJson.dependencies.next}`);
  console.log(`GET /bug/ -> ${pageStatus}`);
  console.log(`Generated next/image src -> ${emittedSrc}`);
  console.log(`GET ${emittedSrc} -> ${browserRequestStatus}`);
  console.log(`GET /bug/logo.svg -> ${deployedAssetStatus}`);

  if (pageStatus !== 200 || emittedSrc !== "/logo.svg" || browserRequestStatus !== 404 || deployedAssetStatus !== 200) {
    throw new Error("The expected basePath mismatch was not reproduced");
  }
  console.log("REPRODUCED: next/image emits a root-relative public asset URL without /bug.");
} finally {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  await rm(hostRoot, { recursive: true, force: true });
}
