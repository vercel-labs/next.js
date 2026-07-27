'use client';

import {useSyncExternalStore} from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function StatusPanel() {
  const isOnline = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );

  return (
    <section>
      <h2>Status</h2>
      <p>{isOnline ? 'online' : 'offline'}</p>
    </section>
  );
}
