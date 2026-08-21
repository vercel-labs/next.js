'use client'
import ChildStatic from '../child-static'
let n = 0
export default function ParentStatic() {
  n++
  if (typeof window !== 'undefined') console.log('[render] parent-static #' + n)
  return (
    <main>
      <div id="parent-renders">{n}</div>
      <ChildStatic />
    </main>
  )
}
