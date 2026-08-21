'use client';

import { useRouter } from 'next/navigation';

export default function Actions() {
  const router = useRouter();
  return (
    <div>
      <button id="refresh" onClick={() => router.refresh()}>
        1. router.refresh()
      </button>{' '}
      <button
        id="reload"
        onClick={() => {
          // What the browser reload button does while requests are in flight:
          // abort them, then navigate.
          window.stop();
          location.reload();
        }}
      >
        2. reload page (abort in-flight requests)
      </button>
    </div>
  );
}
