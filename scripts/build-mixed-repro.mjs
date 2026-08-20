import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const outputRoot = resolve(projectRoot, ".repro");
const nextOutput = resolve(projectRoot, "out");

function runBuild(label) {
  console.log(`\nBuilding release ${label}...`);
  const result = spawnSync("pnpm", ["exec", "next", "build"], {
    cwd: projectRoot,
    env: {
      ...process.env,
      NEXT_PUBLIC_REPRO_BUILD: label,
    },
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  const destination = resolve(outputRoot, `out-${label.toLowerCase()}`);
  rmSync(destination, { recursive: true, force: true });
  cpSync(nextOutput, destination, { recursive: true });
  return destination;
}

function readHtmlBuildId(file) {
  const source = readFileSync(file, "utf8");
  return source.match(/\\"b\\":\\"([^\\"]+)/)?.[1] ?? "not found";
}

function readRscBuildId(file) {
  const source = readFileSync(file, "utf8");
  return source.match(/"b":"([^"]+)/)?.[1] ?? "not found";
}

rmSync(outputRoot, { recursive: true, force: true });
mkdirSync(outputRoot, { recursive: true });

const buildA = runBuild("A");
const buildB = runBuild("B");
const mixedOutput = resolve(outputRoot, "out-mixed");

cpSync(buildA, mixedOutput, { recursive: true });
cpSync(resolve(buildB, "_next"), resolve(mixedOutput, "_next"), {
  recursive: true,
  force: true,
});
cpSync(resolve(buildB, "target"), resolve(mixedOutput, "target"), {
  recursive: true,
  force: true,
});

const homeHtml = resolve(mixedOutput, "index.html");
const targetRsc = resolve(mixedOutput, "target", "index.txt");

if (!existsSync(homeHtml) || !existsSync(targetRsc)) {
  throw new Error("Mixed output is missing the expected HTML or RSC file.");
}

console.log("\nMixed build ready:");
console.log(`  home HTML build ID: ${readHtmlBuildId(homeHtml)}`);
console.log(`  target RSC build ID: ${readRscBuildId(targetRsc)}`);
console.log(`  output: ${mixedOutput}`);
console.log("\nRun `pnpm repro:serve`, open http://localhost:8765/, and click the link.");
