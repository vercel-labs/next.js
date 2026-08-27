'use client'
import dynamic from 'next/dynamic'
export const LazyBox = dynamic(() => import('./box'), { ssr: false, loading: () => <span>loading…</span> })
