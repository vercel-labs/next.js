// Usage: node scripts/upload.mjs <baseUrl> [sizeBytes]
const base = process.argv[2] || 'http://localhost:3000';
const size = Number(process.argv[3] || 16);
const bytes = Buffer.alloc(size, 0x61);

async function run(path, body, headers) {
  const t0 = Date.now();
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 30000);
  try {
    const res = await fetch(base + path, { method: 'POST', body, headers, signal: ac.signal });
    const text = await res.text();
    console.log(`${path} -> ${res.status} in ${Date.now() - t0}ms :: ${text.slice(0, 200)}`);
  } catch (e) {
    console.log(`${path} -> FAILED/HUNG after ${Date.now() - t0}ms :: ${e.name}: ${e.message}`);
  } finally {
    clearTimeout(timer);
  }
}

const fd = new FormData();
fd.append('file', new Blob([bytes], { type: 'image/png' }), 'test.png');
fd.append('field', 'value');

await run('/api/upload', fd);
await run('/api/upload-json', JSON.stringify({ data: bytes.toString('base64') }), { 'content-type': 'application/json' });
