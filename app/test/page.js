'use client';

import { useSearchParams } from 'next/navigation';

export default function TestPage() {
  const searchParams = useSearchParams();
  return <p>q = {searchParams.get('q')}</p>;
}
