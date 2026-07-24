import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { spawn } from "node:child_process";

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? walk(path) : [path];
    }),
  );
  return nested.flat();
}

const serverFiles = await walk(".next/server/chunks");
const classChunks = [];
for (const file of serverFiles.filter((file) => file.endsWith(".js"))) {
  const source = await readFile(file, "utf8");
  if (
    source.includes("AccessDeniedException") &&
    source.includes("ServiceException") &&
    source.includes('$fault="client"')
  ) {
    classChunks.push(relative(process.cwd(), file));
  }
}

console.log(`Class-bearing server chunks: ${classChunks.length}`);
for (const file of classChunks) console.log(`- ${file}`);

const port = 3092;
const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)],
  { stdio: ["ignore", "pipe", "pipe"] },
);
let serverOutput = "";
server.stdout.on("data", (chunk) => (serverOutput += chunk));
server.stderr.on("data", (chunk) => (serverOutput += chunk));

async function request(path) {
  const response = await fetch(`http://127.0.0.1:${port}${path}`);
  if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
  return response.json();
}

async function waitUntilReady() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`next start exited with ${server.exitCode}\n${serverOutput}`);
    }
    try {
      return await request("/api/test");
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
  throw new Error(`Timed out waiting for next start\n${serverOutput}`);
}

try {
  const stored = await waitUntilReady();
  const checked = await request("/api/test2");
  console.log("/api/test:", JSON.stringify(stored));
  console.log("/api/test2:", JSON.stringify(checked));
  console.log(`Cross-route instanceof result: ${checked.isAccessDenied}`);
} finally {
  server.kill("SIGTERM");
  await new Promise((resolve) => {
    if (server.exitCode !== null) return resolve();
    server.once("exit", resolve);
  });
}
