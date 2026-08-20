'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { startTransition } from 'react';
export default function Nav() {
  const router = useRouter();
  return (
    <div>
      <button id="push-a" onClick={() => router.push('/a')}>push /a</button>
      <button id="push-b" onClick={() => router.push('/b')}>push /b</button>
      <button id="push-p" onClick={() => router.push('/p/1')}>push /p/1</button>
      <button id="push-q1" onClick={() => router.push('/q?n=1')}>push /q?n=1</button>
      <button id="push-q2" onClick={() => router.push('/q?n=2')}>push /q?n=2</button>
      <button id="push-t" onClick={() => startTransition(() => router.push('/a'))}>push transition /a</button>
      <Link id="link-a" href="/a">link /a</Link>
      <Link id="link-p" href="/p/1">link /p/1</Link>
      <Link id="link-q2" href="/q?n=2">link /q?n=2</Link>
    </div>
  );
}
