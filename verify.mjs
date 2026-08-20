// Fetches the built stylesheet(s) from a running `next start` server on :3000
// and prints the final CSS rule order. Import order in src/app/layout.js is
// globals.css (blue) -> green.css (green) -> z.css (black) -> yellow.css (yellow)
// so the last declaration must be yellow.
const html = await (await fetch('http://localhost:3000/')).text();
const hrefs = [...new Set([...html.matchAll(/href="(\/_next\/static\/[^"]+\.css)"/g)].map(m => m[1]))];
console.log('stylesheets:', hrefs);
for (const h of hrefs) {
  const css = await (await fetch('http://localhost:3000' + h)).text();
  console.log(h, '=>', [...css.matchAll(/color:\s*([a-z#0-9]+)/g)].map(m => m[1]).join(' , '));
}
