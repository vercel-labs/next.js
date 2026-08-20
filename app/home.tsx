'use client'

// Minimal manual-suspense cache (equivalent to suspend-react in the report)
let status: 'pending' | 'success' | 'error' = 'pending'
let result: number | null = null
let error: unknown = null
let promise: Promise<void> | null = null

function getMultipliers() {
  if (status === 'success') return result
  if (status === 'error') throw error
  if (!promise) {
    promise = (async () => {
      // this is the line from the issue report
      const res = await fetch(`${window.location.origin}/multipliers.bin`)
      const buffer = await res.arrayBuffer()
      result = buffer.byteLength
    })().then(
      () => {
        status = 'success'
      },
      (e) => {
        status = 'error'
        error = e
        console.error('[repro] fetch failed:', e)
      }
    )
  }
  throw promise
}

export function Home() {
  const bytes = getMultipliers()
  return <div id="result">bytes: {String(bytes)}</div>
}
