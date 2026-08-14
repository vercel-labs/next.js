'use client';

import { useEffect, type PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth } from './actions';

export function Providers({ children }: PropsWithChildren) {
  const router = useRouter();

  useEffect(() => {
    // 1. Server Action dispatched on mount -> app router state becomes a pending promise
    getAuth();
    // 2. a router.refresh() while that action is still in flight
    const t = setTimeout(() => router.refresh(), 50);
    return () => clearTimeout(t);
  }, [router]);

  return <div>{children}</div>;
}
