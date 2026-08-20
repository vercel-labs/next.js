'use client';
import { useRouter } from 'next/navigation';

export default function Test() {
  const router = useRouter();
  return (
    <main>
      <h1>Test page</h1>
      <button id="go" onClick={() => router.push('/')}>Go home via router.push</button>
    </main>
  );
}
