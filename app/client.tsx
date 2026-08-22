'use client';

import { startTransition, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { bump } from './actions';

const lines: string[] = [];
function log(msg: string) {
  const line = `${performance.now().toFixed(0)}ms ${msg}`;
  lines.push(line);
  console.log(line);
  const el = document.getElementById('log');
  if (el) el.textContent = lines.join('\n');
}

export function Client({ value }: { value: number }) {
  const router = useRouter();
  const prev = useRef(value);
  const [, setLocal] = useState(0);
  const [slow, setSlow] = useState(0);

  if (typeof window !== 'undefined' && prev.current !== value) {
    log(`RENDER with new server value (was=${prev.current} now=${value})`);
    prev.current = value;
  }

  useEffect(() => {
    log(`COMMIT value=${value}`);
  }, [value]);

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1 id="value">{value}</h1>
      <p>
        unrelated async transition state: <span id="slow">{slow}</span>
      </p>
      <p>
        <button
          id="pending"
          onClick={() => {
            log('1) opened an unrelated async transition (settles in 8s)');
            startTransition(async () => {
              await new Promise((r) => setTimeout(r, 8000));
              log('unrelated async transition body finished');
              setSlow((n) => n + 1);
            });
          }}
        >
          1. open unrelated async transition (8s)
        </button>{' '}
        <button
          id="act"
          onClick={async () => {
            log('2) server action dispatched');
            const r = await bump();
            log(`server action resolved -> ${r} (RSC payload received)`);
            router.refresh();
            log('router.refresh() called');
          }}
        >
          2. run server action + router.refresh()
        </button>{' '}
        <button id="unrelated" onClick={() => { log('unrelated click (discrete setState)'); setLocal((n) => n + 1); }}>
          3. unrelated click
        </button>
      </p>
      <pre id="log" style={{ background: '#111', color: '#0f0', padding: 12, minHeight: 160 }} />
    </main>
  );
}
