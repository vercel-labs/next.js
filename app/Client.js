'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { slowAction } from './actions'

export default function Client() {
  const router = useRouter()
  const [log, setLog] = useState([])
  const add = (m) => setLog((l) => [...l, `${Date.now() - window.__t0}ms ${m}`])

  return (
    <div>
      <button
        id="push-then-action"
        onClick={async () => {
          window.__t0 = Date.now()
          add('click: calling router.push')
          router.push('/target')
          add('router.push returned; calling server action')
          const res = await slowAction()
          add('server action resolved: ' + res)
        }}
      >
        router.push then server action
      </button>
      <button
        id="action-then-push"
        onClick={async () => {
          window.__t0 = Date.now()
          add('click: calling server action')
          const p = slowAction()
          router.push('/target')
          add('router.push returned')
          add('server action resolved: ' + (await p))
        }}
      >
        server action then router.push
      </button>
      <button
        id="push-only"
        onClick={() => {
          window.__t0 = Date.now()
          add('click: router.push only')
          router.push('/target')
        }}
      >
        router.push only (control)
      </button>
      <pre id="log">{log.join('\n')}</pre>
    </div>
  )
}
