'use client';

import dynamic from 'next/dynamic';

const Inner = dynamic(() => import('./Heavy').then((m) => m.Heavy), { ssr: false });

export function Lazy() {
    return <Inner />;
}
