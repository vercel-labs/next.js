// Fetches the CSS chunk served by `next dev` and asserts both
// `backdrop-filter` and `-webkit-backdrop-filter` survive in `.bad`.
const port = process.argv[2] ?? "3000";
const html = await (await fetch(`http://localhost:${port}/`)).text();
const href = html.match(/\/_next\/static\/[^"\\]*\.css/)?.[0];
if (!href) throw new Error("no css link found in HTML");
const css = await (await fetch(`http://localhost:${port}${href}`)).text();
console.log(css);
const bad = css.match(/\.bad\s*\{[^}]*\}/)?.[0] ?? "";
console.log("\n.bad rule:", bad);
console.log("has standard backdrop-filter:", /(^|[^-])backdrop-filter/.test(bad));
