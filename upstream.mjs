#!/usr/bin/env node
// A trivial local upstream, so the cached function performs a real `fetch()`.
//
// This is not incidental: the retained object graph is rooted at a live keep-alive TCP socket
// (`Global handles -> TCP -> AsyncContextFrame -> ...`). With no outbound fetch there is no socket
// to anchor it and nothing is retained. Kept local so the reproduction needs no external service.
//
// Usage: node upstream.mjs      (listens on 3101)
import { createServer } from 'node:http';

const PORT = Number(process.env.PORT || 3101);
const ITEMS = Number(process.env.ITEMS || 60);

function hash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

let served = 0;

createServer((req, res) => {
  const slug = new URL(req.url, 'http://x').searchParams.get('slug') ?? 'none';
  const n = hash(slug);
  const items = Array.from({ length: ITEMS }, (_, i) => ({
    id: `${slug}-${i}`,
    name: `Item ${i} for ${slug}`,
    blurb: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. '.repeat(6),
    values: Array.from({ length: 24 }, (_, j) => (n + i * 31 + j * 7) % 100000),
  }));
  const body = Buffer.from(JSON.stringify({ items }));
  served++;
  res.writeHead(200, { 'content-type': 'application/json', 'content-length': body.length });
  res.end(body);
}).listen(PORT, () => console.log(`[upstream] :${PORT}`));

setInterval(() => console.log(`[upstream] served=${served}`), 15000).unref?.();
