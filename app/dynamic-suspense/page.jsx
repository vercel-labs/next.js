'use client'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
const Child = dynamic(() => import('../child'))
let n = 0
export default function ParentDynamicSuspense() {
  n++
  if (typeof window !== 'undefined') console.log('[render] parent-dynamic-suspense #' + n)
  return (
    <main>
      <div id="parent-renders">{n}</div>
      <Suspense fallback={null}>
        <Child />
      </Suspense>
    </main>
  )
}
