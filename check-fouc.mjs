// Deterministic, browser-free check for https://github.com/vercel/next.js/issues/48505
//
// Usage:
//   1) node check-fouc.mjs http://localhost:3000/ssr     (dev server or `next start`)
//
// It requests the same server-rendered URL 3 times and counts the
// `<style data-emotion="...">` tags emitted in the SSR HTML.
// Expected: the same number every time.
// Actual: only the FIRST render after server start ships the component CSS;
// every later request ships class names with no CSS -> FOUC until hydration.

const url = process.argv[2] || "http://localhost:3000/ssr";

for (let i = 1; i <= 3; i++) {
  const html = await (await fetch(url, { cache: "no-store" })).text();
  const tags = [...html.matchAll(/data-emotion="([^"]+)"/g)].map((m) => m[1]);
  console.log(
    `request ${i}: ${tags.length} emotion <style> tag(s) -> ${JSON.stringify(tags)}`,
  );
}
