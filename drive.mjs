// Forces ISR re-renders of every route for N rounds and prints the server's
// [mem] line after each round. Usage: node drive.mjs <server-log> <rounds>
import fs from 'node:fs';

const LOG = process.argv[2];
const ROUNDS = Number(process.argv[3] || 10);
const manifest = JSON.parse(fs.readFileSync('.next/prerender-manifest.json', 'utf8'));
const previewId = manifest.preview.previewModeId;
const routes = Object.keys(manifest.routes).filter(r => r.startsWith('/posts/'));
const lastMem = () => {
  const l = fs.readFileSync(LOG, 'utf8').split('\n').filter(x => x.includes('[mem]'));
  return l[l.length - 1]?.replace(/^.*\[mem\]/, '').trim();
};
console.log(`routes=${routes.length} rounds=${ROUNDS} node=${process.version}`);
for (let round = 1; round <= ROUNDS; round++) {
  let i = 0;
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (i < routes.length) {
      const r = routes[i++];
      const res = await fetch(`http://localhost:3299${r}`, {
        headers: { 'x-prerender-revalidate': previewId },
      });
      await res.arrayBuffer();
    }
  }));
  await new Promise(r => setTimeout(r, 7000));
  console.log(`round ${round}: ${lastMem()}`);
}
