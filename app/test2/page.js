'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function T() {
  const router = useRouter();
  useEffect(() => { const t = setTimeout(() => router.push('/?q=1'), 500); return () => clearTimeout(t); }, [router]);
  return <h1>Redirecting…</h1>;
}
