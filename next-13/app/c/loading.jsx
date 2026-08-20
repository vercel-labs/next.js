'use client';
import { useSearchParams } from 'next/navigation';
export default function Loading() {
  const sp = useSearchParams();
  return <p>loading q={sp.get('q')}</p>;
}
