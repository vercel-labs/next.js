import { spawn } from "node:child_process";

const port = process.env.PORT || "39192";
const expectedInstanceof = process.env.EXPECT_INSTANCEOF === "true";
const next = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", port],
  { stdio: ["ignore", "pipe", "pipe"] },
);

next.stdout.pipe(process.stdout);
next.stderr.pipe(process.stderr);

async function fetchWhenReady(path) {
  const url = `http://127.0.0.1:${port}${path}`;
  let lastError;
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${url} returned ${response.status}`);
      return response;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
  throw lastError;
}

try {
  const create = await fetchWhenReady("/create");
  const createBody = await create.text();
  const check = await fetchWhenReady("/api/check");
  const result = await check.json();

  console.log(`CREATE=${createBody.match(/\{[^<]+\}/)?.[0]}`);
  console.log(`CHECK=${JSON.stringify(result)}`);

  if (!result.exists || result.name !== "AccessDeniedException") {
    throw new Error("The API route did not receive the SSR-created error");
  }
  if (result.instanceofAccessDeniedException !== expectedInstanceof) {
    throw new Error(
      `Expected instanceof=${expectedInstanceof}, received ${result.instanceofAccessDeniedException}`,
    );
  }
} finally {
  if (next.exitCode === null && next.signalCode === null) {
    next.kill("SIGTERM");
    await new Promise((resolve) => next.once("exit", resolve));
  }
}
