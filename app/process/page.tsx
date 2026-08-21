'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProcessPage() {
  const router = useRouter();
  const [status, setStatus] = useState('idle');

  const run = async (mode: 'push' | 'refresh-push') => {
    setStatus('Processing...');
    await new Promise((r) => setTimeout(r, 500));
    document.cookie = 'processingComplete=true; path=/';
    setStatus('cookie set, navigating');
    if (mode === 'refresh-push') {
      router.refresh();
      await new Promise((r) => setTimeout(r, 100));
    }
    console.log('calling router.push("/") mode=' + mode);
    router.push('/');
  };

  return (
    <div>
      <h1>Process Page</h1>
      <p id="status">{status}</p>
      <button id="push" onClick={() => run('push')}>Start Process (push only)</button>
      <button id="refresh-push" onClick={() => run('refresh-push')}>Start Process (refresh + push)</button>
    </div>
  );
}
