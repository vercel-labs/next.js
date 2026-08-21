'use client'
let n = 0
export default function Baseline() {
  n++
  if (typeof window !== 'undefined') console.log('[render] baseline #' + n, new Error().stack)
  return <div>baseline {n}</div>
}
