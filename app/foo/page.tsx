'use client';
import { useRouter } from 'next/navigation';

export default function Foo() {
  const router = useRouter();
  return (
    <div>
      <h1>Foo page</h1>
      <button id="push-root" onClick={() => router.push('/')}>
        router.push(&apos;/&apos;)
      </button>
      <button id="refresh" onClick={() => router.refresh()}>
        router.refresh()
      </button>
    </div>
  );
}
