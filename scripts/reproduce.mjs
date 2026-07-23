import { spawn } from "node:child_process";
import { readdir, readFile, rm } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";

const next = path.resolve("node_modules/next/dist/bin/next");

function run(args, options = {}) {
  const child = spawn(process.execPath, [next, ...args], {
    stdio: "inherit",
    ...options,
  });
  return new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`next ${args.join(" ")} exited with ${code ?? signal}`));
    });
  });
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(file)));
    else files.push(file);
  }
  return files;
}

async function openPort() {
  const socket = createServer();
  await new Promise((resolve, reject) => {
    socket.once("error", reject);
    socket.listen(0, "127.0.0.1", resolve);
  });
  const { port } = socket.address();
  await new Promise((resolve) => socket.close(resolve));
  return port;
}

await rm(".next", { recursive: true, force: true });
await run(["build", "--turbopack"]);

const serverFiles = await walk(".next/server/chunks");
const classDefinitionChunks = [];
for (const file of serverFiles.filter((file) => file.endsWith(".js"))) {
  if ((await readFile(file, "utf8")).includes('$fault:"client"')) {
    classDefinitionChunks.push(path.relative(".next", file));
  }
}

const port = await openPort();
const server = spawn(process.execPath, [next, "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  stdio: "inherit",
});
const serverExit = new Promise((resolve) => server.once("exit", resolve));

try {
  let create;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/test`);
      if (response.ok) {
        create = await response.json();
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!create) throw new Error("server did not become ready");

  const check = await fetch(`http://127.0.0.1:${port}/api/test2`).then((response) => response.json());
  console.log("\nRuntime identity result:");
  console.log(JSON.stringify({ classDefinitionChunks, create, check }, null, 2));
} finally {
  if (server.exitCode === null) server.kill("SIGTERM");
  await serverExit;
}
