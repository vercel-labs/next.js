'use client'
import dynamic from 'next/dynamic'
const Child = dynamic(() => import('../child'))
let n = 0
export default function ParentDynamic() {
  n++
  if (typeof window !== 'undefined') console.log('[render] parent-dynamic #' + n)
  return (
    <main>
      <div id="parent-renders">{n}</div>
      <Child />
    </main>
  )
}
