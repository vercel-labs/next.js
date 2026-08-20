'use client'
import { useEffect, useState } from 'react'

export default function Page() {
  const [out, setOut] = useState<any>({})
  useEffect(() => {
    const w = new Worker(new URL('./worker.ts', import.meta.url))
    w.onmessage = (e) => {
      console.log('worker result', e.data)
      setOut((p: any) => ({ ...p, plain: e.data }))
    }
    w.onerror = (e) => setOut((p: any) => ({ ...p, plain: 'worker error: ' + e.message }))
    w.postMessage('go')

    const t = new Worker(new URL('./worker-three.ts', import.meta.url))
    t.onmessage = (e) => {
      console.log('three worker result', e.data)
      setOut((p: any) => ({ ...p, three: e.data }))
    }
    t.onerror = (e) => setOut((p: any) => ({ ...p, three: 'worker error: ' + e.message }))
    t.postMessage('go')
    return () => { w.terminate(); t.terminate() }
  }, [])
  return <pre id="result">{Object.keys(out).length === 2 ? JSON.stringify(out) : 'pending'}</pre>
}
