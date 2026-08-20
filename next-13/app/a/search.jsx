'use client';
import { useSearchParams } from 'next/navigation';
export default function Search() {
  const sp = useSearchParams();
  return <p>a q={sp.get('q')}</p>;
}
