'use client'
import dynamic from 'next/dynamic'
const LazyComponent = dynamic(() => import('./lazy'))
export default function Page() {
  return <main><LazyComponent /></main>
}
