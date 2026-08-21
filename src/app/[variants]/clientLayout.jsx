'use client';

import { useSelectedLayoutSegments } from 'next/navigation';
import { useMemo } from 'react';

export default function ClientLayout({ children }) {
  const segments = useSelectedLayoutSegments();

  const mainKey = useMemo(
    () => segments.filter((segment) => !segment.startsWith('(')).join('/'),
    [segments]
  );

  console.log('segments', segments);
  console.log('mainKey', mainKey);

  return (
    <div key={mainKey} className='w-full h-full'>
      {children}
    </div>
  );
}
