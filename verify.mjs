// Builds and inspects the prerendered HTML for the custom Link marker.
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

execSync("npx next build", { stdio: "inherit" });

const html = (f) => readFileSync(`.next/server/app/${f}`, "utf8");
const bug = html("index.html").includes('data-custom-link="yes"'); // next/link alias
const control = html("control.html").includes('data-custom-link="yes"'); // aliased-link

console.log(`\ncontrol page ("aliased-link" alias applied): ${control}`);
console.log(`bug page ("next/link" alias applied):       ${bug}`);
if (control && !bug) {
  console.log("REPRODUCED: turbopack.resolveAlias is ignored for next/link only");
  process.exit(1);
}
console.log("NOT REPRODUCED");
