'use client';
import { useEffect, useState } from 'react';

export default function WorkerDemo() {
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    const log = (s: string) => setLines((p) => [...p, s]);
    (async () => {
      // Dynamic segment, like maplibre-gl 6.x picks its dev/prod worker entry.
      const name = process.env.NEXT_PUBLIC_DEV_WORKER ? 'entry-dev.mjs' : 'entry.mjs';
      const url = new URL(`./worker/${name}`, import.meta.url).href;
      log('worker url  : ' + url);
      try {
        const res = await fetch(url);
        const src = await res.text();
        log('worker fetch: ' + res.status);
        const spec = (src.match(/from\s*['"](\.\/[^'"]+)['"]/) || [])[1];
        log('import in emitted worker: ' + JSON.stringify(spec));
        if (spec) {
          const sib = new URL(spec, new URL(url, location.href)).href;
          const r2 = await fetch(sib);
          log('sibling fetch: ' + r2.status + ' ' + sib);
        }
      } catch (e) {
        log('fetch failed: ' + String(e));
      }
      const w = new Worker(url, { type: 'module' });
      w.onmessage = (e) => log('worker onmessage: ' + e.data);
      w.onerror = (e) => log('worker onerror, message=' + JSON.stringify(e.message) + ' (empty by spec)');
      setTimeout(() => log('--- 3s elapsed ---'), 3000);
    })();
  }, []);
  return <pre id="out" style={{ background: '#111', color: '#0f0', padding: 12 }}>{lines.join('\n')}</pre>;
}
