// Emulates Slack's unfurl fetch: only the first 32KB of the response is read.
// Reports whether og:* meta tags are inside that window.
const base = process.env.BASE_URL ?? 'http://localhost:3000';
const LIMIT = 32 * 1024;

for (const path of ['/', '/no-styles']) {
  const url = base + path;
  const res = await fetch(url, { headers: { Range: 'bytes=0-32767' } });
  const html = await res.text();
  const bytes = Buffer.from(html, 'utf8');
  const idx = html.indexOf('og:title');
  const firstWindow = bytes.subarray(0, LIMIT).toString('utf8');
  const inWindow = firstWindow.includes('og:title');
  const byteOffset = idx === -1 ? -1 : Buffer.byteLength(html.slice(0, idx), 'utf8');
  console.log(`${path}`);
  console.log(`  status: ${res.status} (range honored: ${res.status === 206})`);
  console.log(`  total html bytes: ${bytes.length}`);
  console.log(`  og:title byte offset: ${byteOffset}`);
  console.log(`  og:title within first 32768 bytes: ${inWindow}  -> slack unfurl ${inWindow ? 'OK' : 'BROKEN'}`);
}
