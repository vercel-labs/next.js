'use client';
import { lazy, Suspense, useEffect, useState } from 'react';

const Info = lazy(() => import('./coin-info'));

export default function ClientContainer({ coinId }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 800);
    return () => clearTimeout(id);
  }, []);
  return (
    <div>
      <Suspense fallback={<p>loading info…</p>}>{ready ? <Info coinId={coinId} /> : <p>fetching…</p>}</Suspense>
    </div>
  );
}
